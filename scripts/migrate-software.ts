
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

// We allow token to be missing if we are counting on 'sanity exec' to inject it, 
// BUT 'createClient' usually requires it explicitly unless using 'sanity/cli' client.
// We will warn but proceed if running in a context where it might work (unlikely with this client setup).
if (!projectId) {
    console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID.');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token, // If null, this client is anonymous (readonly usually). We need token for writes.
    apiVersion: '2025-10-01',
    useCdn: false, // We want fresh data for checks
});

function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function migrate() {
    console.log('Starting migration...');

    // 1. Fetch existing data for lookups
    console.log('Fetching reference data from Sanity...');
    const [existingListings, categories, existingFeatures, featureCategories] = await Promise.all([
        client.fetch(`*[_type == "directoryListing"]{ "slug": slug.current }`),
        client.fetch(`*[_type == "category"]{ _id, title }`),
        client.fetch(`*[_type == "feature"]{ _id, title, slug }`),
        client.fetch(`*[_type == "featureCategory"]{ _id, title }`)
    ]);

    const existingSlugs = new Set(existingListings.map((l: any) => l.slug));
    // Standardize Map keys to lowercase for robust matching
    const categoryMap = new Map(categories.map((c: any) => [c.title.toLowerCase(), c._id]));
    const featureMap = new Map(existingFeatures.map((f: any) => [f.title.toLowerCase(), f]));

    // Find a default Feature Category
    let defaultFeatureCatId = featureCategories.find((c: any) => c.title === 'Platform & Infrastructure')?._id
        || featureCategories[0]?._id;

    if (!defaultFeatureCatId && featureCategories.length === 0) {
        console.log('Creating default Feature Category...');
        try {
            const newCat = await client.create({
                _type: 'featureCategory',
                title: 'General',
                slug: { _type: 'slug', current: 'general' }
            });
            defaultFeatureCatId = newCat._id;
        } catch (e) {
            console.warn("Could not create default category, features might fail", e);
        }
    } else if (!defaultFeatureCatId) {
        defaultFeatureCatId = featureCategories[0]?._id;
    }

    // 2. Read software documents from local NDJSON
    const ndjsonPath = path.resolve(__dirname, '../sanity/software.ndjson');
    console.log(`Reading source file: ${ndjsonPath}`);

    if (!fs.existsSync(ndjsonPath)) {
        console.error(`File not found: ${ndjsonPath}`);
        return;
    }

    const fileStream = fs.createReadStream(ndjsonPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let migratedCount = 0;
    let skippedCount = 0;

    for await (const line of rl) {
        if (!line.trim()) continue;

        let doc;
        try {
            doc = JSON.parse(line);
        } catch (e) {
            console.error('Failed to parse line:', line);
            continue;
        }

        if (doc._type !== 'software') continue;

        const slug = doc.slug?.current;

        if (!slug) {
            console.warn(`Skipping doc ${doc.title} (no slug)`);
            continue;
        }

        if (existingSlugs.has(slug)) {
            console.log(`Skipping ${slug} (already exists)`);
            skippedCount++;
            continue;
        }

        console.log(`Migrating ${slug}...`);

        // Map Category
        let categoryRef = undefined;
        if (doc.category) {
            const catId = categoryMap.get(doc.category.toLowerCase());
            if (catId) {
                categoryRef = { _type: 'reference', _ref: catId };
            } else {
                console.warn(`  Warning: Category '${doc.category}' not found for ${slug}`);
            }
        }

        // Map Features
        const listingFeatures = [];
        if (doc.features && Array.isArray(doc.features)) {
            for (const f of doc.features) {
                const fName = typeof f === 'string' ? f : f.name;
                if (!fName) continue;

                const fLower = fName.toLowerCase();
                let featureObj = featureMap.get(fLower);

                // If feature doesn't interact, Create it
                if (!featureObj) {
                    console.log(`  Creating new feature: ${fName}`);
                    const newSlug = generateSlug(fName);
                    try {
                        const newFeature = await client.create({
                            _type: 'feature',
                            title: fName,
                            slug: { _type: 'slug', current: newSlug },
                            category: { _type: 'reference', _ref: defaultFeatureCatId }
                        });
                        featureObj = { _id: newFeature._id, slug: { current: newSlug }, title: fName };
                        featureMap.set(fLower, featureObj);
                    } catch (err: any) {
                        if (err.message && err.message.includes('already exists')) {
                            console.warn(`   Feature ${fName} slug collision, skipping creation.`);
                            // Ideally fetch it, but let's skip to be safe/fast
                        } else {
                            console.error(`  Error creating feature ${fName}: ${err.message}`);
                        }
                        // Even if creation failed, we might want to continue without this feature
                        continue;
                    }
                }

                if (featureObj) {
                    listingFeatures.push({
                        _key: generateSlug(fName) + Math.random().toString(36).substring(7),
                        feature: { _type: 'reference', _ref: featureObj._id },
                        availability: 'included',
                        notes: (typeof f === 'object' && f.featureType) ? f.featureType : undefined
                    });
                }
            }
        }

        // Construct Directory Listing
        // Use deterministic ID if possible, or random. 
        // "imported-software-slug" is good to prevent duplicates if ran again without existing check
        const newDocId = `imported-software-${slug}`;

        const newDoc = {
            _type: 'directoryListing',
            _id: newDocId,
            title: doc.title,
            slug: doc.slug,
            description: doc.description,
            tagline: doc.tagline,
            websiteURL: doc.websiteURL,
            // logo: doc.image1_isLogo ? doc.image1 : undefined, // Sanity image object needs asset reference
            // If doc.image1 is { _type: 'image', asset: { _ref: ... } }, it works directly.
            logo: doc.image1,
            listingType: 'software',
            brokerType: doc.brokerType, // Ensure matches schema
            pricing: doc.pricing_model ? { type: doc.pricing_model.toLowerCase() } : undefined, // standardizing pricing type?
            category: categoryRef,
            features: listingFeatures,
            isFeatured: false,
            synonyms: doc.synonyms
        };

        try {
            await client.createOrReplace(newDoc);
            console.log(`  Success: Migrated ${slug}`);
            migratedCount++;
        } catch (err: any) {
            console.error(`  Failed to migrate ${slug}: ${err.message}`);
        }
    }

    console.log('Migration complete.');
    console.log(`Migrated: ${migratedCount}`);
    console.log(`Skipped: ${skippedCount}`);
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
