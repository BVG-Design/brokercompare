const fs = require('fs');
const path = require('path');

const featureCategories = [
    { title: "Communication & Collaboration", order: 1, description: "How people work together inside the platform", features: ["Internal Chat / Messaging", "Comments & @Mentions", "Whiteboards / Visual Collaboration", "Real-time Collaboration", "Activity Feeds", "Notifications", "Notes & Documentation"] },
    { title: "Automation & Workflows", order: 2, description: "How work is triggered, routed, and automated", features: ["Workflow Automation", "Triggers & Rules", "Task / Process Automation", "Conditional Logic", "Approval Flows"] },
    { title: "Data Insights & Reporting", order: 3, description: "How users gain insight and make decisions", features: ["Dashboards", "Custom Reports", "Analytics", "Performance Tracking", "Data Export"] },
    { title: "Integrations & APIs", order: 4, description: "How the platform connects to other systems", features: ["Native Integrations", "API Access", "Webhooks", "App Marketplace", "Zapier / Make connectivity"] },
    { title: "AI & Intelligence", order: 5, description: "Machine-assisted productivity and insight", features: ["AI Assistants", "AI Summaries", "AI Content Generation", "AI Recommendations", "Predictive Insights"] },
    { title: "Security & Compliance", order: 6, description: "Trust, identity, and governance", features: ["SSO / MFA", "Role-based Access", "Audit Logs", "SOC 2 / ISO", "Data Encryption", "Compliance Controls"] },
    { title: "Platform & Infrastructure", order: 7, description: "How the system is delivered and operated", features: ["Cloud Hosting", "Backups & Recovery", "Scalability", "Uptime / Reliability", "Deployment Model"] },
    { title: "Marketing Channels", order: 8, description: "Outbound, inbound, and growth connectivity", features: ["Email Marketing", "Social Media Integrations", "Ads Platforms", "Attribution Tools", "Analytics Channels"] }
];

const listingCategories = [
    "Core Business",
    "Data Hosting",
    "CRM",
    "Website",
    "Broker Industry Tools",
    "Marketing & Growth Platforms",
    "Automation / Integration Platforms",
    "Collaboration & Communication",
    "Learning Design & Course Content",
    "Video / UX / Feedback Tools",
    "Data / Monitoring"
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

const docs = [];

// 1. Create Feature Categories
featureCategories.forEach(cat => {
    const catId = `featureCategory-${slugify(cat.title)}`;
    docs.push({
        _id: catId,
        _type: 'featureCategory',
        title: cat.title,
        order: cat.order,
        description: cat.description,
        slug: { _type: 'slug', current: slugify(cat.title) }
    });

    // 2. Create Features in this category
    cat.features.forEach(feat => {
        docs.push({
            _id: `feature-${slugify(feat)}`,
            _type: 'feature',
            title: feat,
            slug: { _type: 'slug', current: slugify(feat) },
            category: { _type: 'reference', _ref: catId }
        });
    });
});

// 3. Create Listing Categories
listingCategories.forEach(cat => {
    docs.push({
        _id: `category-${slugify(cat)}`,
        _type: 'category',
        title: cat,
        slug: { _type: 'slug', current: slugify(cat) }
    });
});

const ndjson = docs.map(d => JSON.stringify(d)).join('\n');
fs.writeFileSync(path.join(__dirname, 'seed-canonical.ndjson'), ndjson);

console.log(`Generated ${docs.length} documents for canonical data.`);
