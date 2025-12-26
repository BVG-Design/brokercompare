
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
    console.error('Missing configuration. Please check NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN in .env.local');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2025-10-01',
    useCdn: false,
});

// FEATURE DATA DEFINITION
const FEATURE_DATA = [
    {
        category: 'Communication & Collaboration',
        features: [
            'Internal Chat / Messaging',
            'Comments & @Mentions',
            'Whiteboards / Visual Collaboration',
            'Notes & Documentation',
            'Activity Feeds',
            'Notifications',
            'Email Sync',
        ],
    },
    {
        category: 'Automation & Workflows',
        features: [
            'Workflow Automation',
            'Triggers & Rules',
            'Approval Flows',
            'Accept / Reject Processes',
            'Conditional Logic',
        ],
    },
    {
        category: 'Data Insights & Reporting',
        features: [
            'Dashboards',
            'Custom Reports',
            'Analytics',
            'Performance Tracking',
            'Data Export',
        ],
    },
    {
        category: 'Integrations & APIs',
        features: [
            'Native Integrations',
            'API Access',
            'Webhooks',
            'App Marketplaces',
            'Zapier / Make connectivity',
        ],
    },
    {
        category: 'AI & Intelligence',
        features: [
            'AI Assistants',
            'AI Summaries',
            'AI Content Generation',
            'AI Recommendations',
            'Conversational AI',
        ],
    },
    {
        category: 'Security & Compliance',
        features: [
            'SSO / MFA',
            'Role-based Access',
            'Audit Logs',
            'SOC 2 / ISO',
            'Secure Data Handling',
        ],
    },
    {
        category: 'Platform & Infrastructure',
        features: [
            'Cloud Hosting',
            'Backups & Recovery',
            'Scalability',
            'Uptime & Reliability',
            'Deployment Models',
        ],
    },
    {
        category: 'Marketing Channels',
        features: [
            'Email Marketing',
            'Ads Platforms',
            'Social Media Integrations',
            'Attribution Tools',
            'Analytics Channels',
        ],
    },
];

function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function seed() {
    console.log('Seeding Feature Categories and Features...');

    // 1. Ensure Feature Categories exist
    const categoryMap = new Map(); // Title -> _id

    for (const group of FEATURE_DATA) {
        const slug = generateSlug(group.category);

        // Check if exists
        const existing = await client.fetch(`*[_type == "featureCategory" && slug.current == $slug][0]`, { slug });

        let catId;
        if (existing) {
            console.log(`Category exists: ${group.category}`);
            catId = existing._id;
        } else {
            console.log(`Creating Category: ${group.category}`);
            const newCat = await client.create({
                _type: 'featureCategory',
                title: group.category,
                slug: { _type: 'slug', current: slug },
                order: FEATURE_DATA.indexOf(group) + 1, // Set generic order
            });
            catId = newCat._id;
        }
        categoryMap.set(group.category, catId);

        // 2. Ensure Features exist for this category
        for (const featureTitle of group.features) {
            const featureSlug = generateSlug(featureTitle);

            const existingFeature = await client.fetch(`*[_type == "feature" && slug.current == $slug][0]`, { slug: featureSlug });

            if (existingFeature) {
                console.log(`  Feature exists: ${featureTitle}`);
                // Optionally update category if strictly enforcing structure
            } else {
                console.log(`  Creating Feature: ${featureTitle}`);
                await client.create({
                    _type: 'feature',
                    title: featureTitle,
                    slug: { _type: 'slug', current: featureSlug },
                    category: { _type: 'reference', _ref: catId },
                });
            }
        }
    }

    console.log('Seeding complete.');
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
