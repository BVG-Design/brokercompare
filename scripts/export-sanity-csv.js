#!/usr/bin/env node
/**
 * Quick utility to turn the Sanity production export tarball into a set of CSVs.
 * Usage: node scripts/export-sanity-csv.js [path/to/production.tar.gz] [outputDir]
 */

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const tarPath =
  process.argv[2] || path.join(__dirname, '..', 'sanity', 'production.tar.gz');
const outputDir =
  process.argv[3] || path.join(__dirname, '..', 'sanity', 'csv-export');

const mappings = {
  directoryListing: {
    columns: [
      '_id',
      'title',
      'slug',
      'listingType',
      'category',
      'supabaseId',
      'tagline',
      'description',
      'websiteURL',
      'brokerType',
      'features',
      'pricingType',
      'pricingStartingFrom',
      'pricingNotes',
      'serviceAreas',
      'worksWith',
      'similarTo',
      'serviceProviders',
      'author',
      'editorNotes',
      'metaDescription',
      'synonyms',
      'isFeatured',
      'badges'
    ],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      listingType: doc.listingType || '',
      category: refValue(doc.category),
      supabaseId: doc.supabaseId || '',
      tagline: doc.tagline || '',
      description: doc.description || '',
      websiteURL: doc.websiteURL || '',
      brokerType: joinStrings(doc.brokerType),
      features: doc.features
        ? JSON.stringify(
            doc.features.map(f => ({
              feature: refValue(f.feature),
              availability: f.availability || '',
              score: f.score ?? '',
              limitationType: f.limitationType || '',
              notes: f.notes || ''
            }))
          )
        : '',
      pricingType: doc.pricing?.type || '',
      pricingStartingFrom: doc.pricing?.startingFrom ?? '',
      pricingNotes: doc.pricing?.notes || '',
      serviceAreas: joinRefs(doc.serviceAreas),
      worksWith: joinRefs(doc.worksWith),
      similarTo: Array.isArray(doc.similarTo)
        ? doc.similarTo
            .map(entry => {
              const listing = refValue(entry.listing);
              const priority = entry.priority ?? '';
              return listing ? `${listing}${priority ? `:${priority}` : ''}` : '';
            })
            .filter(Boolean)
            .join('|')
        : '',
      serviceProviders: joinRefs(doc.serviceProviders),
      author: refValue(doc.author),
      editorNotes: doc.editorNotes || '',
      metaDescription: doc.metaDescription || '',
      synonyms: joinStrings(doc.synonyms),
      isFeatured: doc.isFeatured ?? '',
      badges: joinRefs(doc.badges)
    })
  },
  serviceProvider: {
    columns: [
      '_id',
      'name',
      'slug',
      'category',
      'tagline',
      'description',
      'websiteUrl',
      'location',
      'availability',
      'brokerTypes',
      'serviceAreas',
      'features',
      'pricingModel',
      'pricingRangeMin',
      'pricingRangeMax',
      'pricingNotes',
      'badges',
      'reviews'
    ],
    map: doc => ({
      _id: doc._id || '',
      name: doc.name || '',
      slug: slugValue(doc.slug),
      category: refValue(doc.category) || doc.category || '',
      tagline: doc.tagline || '',
      description: doc.description || '',
      websiteUrl: doc.websiteUrl || '',
      location: doc.location || '',
      availability: doc.availability || '',
      brokerTypes: joinStrings(doc.brokerTypes),
      serviceAreas: joinStrings(doc.serviceAreas),
      features: joinStrings(doc.features),
      pricingModel: doc.pricing?.model || '',
      pricingRangeMin: doc.pricing?.rangeMin ?? '',
      pricingRangeMax: doc.pricing?.rangeMax ?? '',
      pricingNotes: doc.pricing?.notes || '',
      badges: joinRefs(doc.badges),
      reviews: doc.reviews ? JSON.stringify(doc.reviews) : ''
    })
  },
  serviceArea: {
    columns: [
      '_id',
      'title',
      'slug',
      'group',
      'description',
      'metaDescription',
      'icon',
      'synonyms'
    ],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      group: doc.group || '',
      description: doc.description || '',
      metaDescription: doc.metaDescription || '',
      icon: doc.icon || '',
      synonyms: joinStrings(doc.synonyms)
    })
  },
  serviceAreas: {
    columns: ['_id', 'title', 'slug', 'description', 'icon'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      description: doc.description || '',
      icon: doc.icon || ''
    })
  },
  worksWith: {
    columns: ['_id', 'title', 'slug', 'category', 'description', 'icon'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      category: doc.category || '',
      description: doc.description || '',
      icon: doc.icon || ''
    })
  },
  feature: {
    columns: ['_id', 'title', 'slug', 'description', 'category', 'synonyms'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      description: doc.description || '',
      category: refValue(doc.category),
      synonyms: joinStrings(doc.synonyms)
    })
  },
  featureCategory: {
    columns: ['_id', 'title', 'slug', 'order', 'description'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      order: doc.order ?? '',
      description: doc.description || ''
    })
  },
  category: {
    columns: ['_id', 'title', 'slug', 'description', 'metaDescription', 'synonyms'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      description: doc.description || '',
      metaDescription: doc.metaDescription || '',
      synonyms: joinStrings(doc.synonyms)
    })
  },
  badge: {
    columns: ['_id', 'title', 'slug', 'description', 'badgeType', 'color', 'priority'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      description: doc.description || '',
      badgeType: doc.badgeType || '',
      color: doc.color || '',
      priority: doc.priority ?? ''
    })
  },
  searchIntent: {
    columns: [
      '_id',
      'title',
      'slug',
      'categoryKey',
      'description',
      'synonyms',
      'exampleQueries',
      'priority',
      'isActive',
      'showInNav',
      'order'
    ],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      categoryKey: doc.categoryKey || '',
      description: doc.description || '',
      synonyms: joinStrings(doc.synonyms),
      exampleQueries: joinStrings(doc.exampleQueries),
      priority: doc.priority ?? '',
      isActive: doc.isActive ?? '',
      showInNav: doc.showInNav ?? '',
      order: doc.order ?? ''
    })
  },
  author: {
    columns: ['_id', 'name', 'bio', 'picture'],
    map: doc => ({
      _id: doc._id || '',
      name: doc.name || '',
      bio: doc.bio || '',
      picture: doc.picture?._sanityAsset || ''
    })
  },
  blog: {
    columns: [
      '_id',
      'title',
      'slug',
      'summary',
      'publishedAt',
      'author',
      'categories',
      'heroImage'
    ],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      summary: doc.summary || '',
      publishedAt: doc.publishedAt || '',
      author: refValue(doc.author),
      categories: joinRefs(doc.categories),
      heroImage: doc.heroImage?._sanityAsset || ''
    })
  },
  product: {
    columns: ['_id', 'title', 'slug', 'description', 'category'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      description: doc.description || '',
      category: refValue(doc.category)
    })
  },
  directoryCategory: {
    columns: ['_id', 'title', 'slug', 'description', 'icon'],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      description: doc.description || '',
      icon: doc.icon || ''
    })
  },
  software: {
    columns: [
      '_id',
      'title',
      'slug',
      'tagline',
      'category',
      'brokerType',
      'serviceArea',
      'description',
      'features',
      'pricingModel',
      'websiteURL',
      'metaDescription',
      'synonyms',
      'image1_alt',
      'image1_isLogo'
    ],
    map: doc => ({
      _id: doc._id || '',
      title: doc.title || '',
      slug: slugValue(doc.slug),
      tagline: doc.tagline || '',
      category: doc.category || '',
      brokerType: joinStrings(doc.brokerType),
      serviceArea: joinStrings(doc.serviceArea),
      description: doc.description || '',
      features: Array.isArray(doc.features)
        ? doc.features
            .map(feature => `${feature.name || ''}${feature.featureType ? ` (${feature.featureType})` : ''}`)
            .filter(Boolean)
            .join('|')
        : '',
      pricingModel: doc.pricing_model || '',
      websiteURL: doc.websiteURL || '',
      metaDescription: doc.metaDescription || '',
      synonyms: joinStrings(doc.synonyms),
      image1_alt: doc.image1_alt || '',
      image1_isLogo: doc.image1_isLogo ?? ''
    })
  }
};

const refValue = value =>
  value && typeof value === 'object' ? value._ref || value._id || '' : value || '';

const slugValue = slug =>
  slug && typeof slug === 'object' ? slug.current || '' : slug || '';

const joinStrings = value => (Array.isArray(value) ? value.filter(Boolean).join('|') : '');

const joinRefs = value =>
  Array.isArray(value)
    ? value
        .map(item => refValue(item))
        .filter(Boolean)
        .join('|')
    : '';

const toCsv = (columns, rows) => {
  const escape = val =>
    val === null || val === undefined
      ? ''
      : String(val).replace(/\"/g, '\"\"');
  const header = columns.join(',');
  const body = rows.map(row =>
    columns.map(col => `"${escape(row[col])}"`).join(',')
  );
  return [header, ...body].join('\n');
};

const findNdjsonPath = () => {
  const list = spawnSync('tar', ['-tzf', tarPath], { encoding: 'utf8' });
  if (list.status !== 0) {
    throw new Error(`Failed to list tar: ${list.stderr || list.stdout}`);
  }
  const ndjson = list.stdout
    .split(/\r?\n/)
    .find(line => line.trim().endsWith('data.ndjson'));
  if (!ndjson) {
    throw new Error('Could not find data.ndjson in the tarball');
  }
  return ndjson.trim();
};

const ensureDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

async function main() {
  const ndjsonPath = findNdjsonPath();
  ensureDir(outputDir);

  const rowsByType = {};
  const skippedCounts = {};

  await new Promise((resolve, reject) => {
    const tarProc = spawn('tar', ['-xOf', tarPath, ndjsonPath]);
    let stderr = '';

    tarProc.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    const rl = readline.createInterface({ input: tarProc.stdout });
    rl.on('line', line => {
      if (!line.trim()) return;
      let doc;
      try {
        doc = JSON.parse(line);
      } catch (err) {
        reject(new Error(`Failed to parse JSON line: ${err.message}`));
        return;
      }

      if (String(doc._id || '').startsWith('drafts.')) {
        skippedCounts.drafts = (skippedCounts.drafts || 0) + 1;
        return;
      }

      const type = doc._type;
      const mapping = mappings[type];
      if (!mapping) {
        skippedCounts[type] = (skippedCounts[type] || 0) + 1;
        return;
      }

      rowsByType[type] = rowsByType[type] || [];
      rowsByType[type].push(mapping.map(doc));
    });

    tarProc.on('close', code => {
      if (code !== 0) {
        reject(new Error(`tar exited with code ${code}: ${stderr}`));
      } else {
        resolve();
      }
    });

    tarProc.on('error', err => reject(err));
  });

  const summary = [];
  Object.entries(mappings).forEach(([type, cfg]) => {
    const rows = rowsByType[type] || [];
    const outFile = path.join(outputDir, `${type}.csv`);
    const csv = toCsv(cfg.columns, rows);
    fs.writeFileSync(outFile, csv, 'utf8');
    summary.push(`${type}: ${rows.length} -> ${outFile}`);
  });

  const skippedTypes = Object.entries(skippedCounts)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');

  console.log('CSV export complete');
  console.log(summary.join('\n'));
  if (skippedTypes) {
    console.log(`Skipped (drafts/unmapped): ${skippedTypes}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
