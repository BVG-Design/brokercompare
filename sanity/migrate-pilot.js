const fs = require('fs');
const path = require('path');

const PILOT_SOFTWARE_MAP = {
    "Google Workspace": "category-core-business",
    "Microsoft 365": "category-core-business",
    "Microsoft Azure": "category-data-hosting",
    "AWS": "category-data-hosting",
    "HubSpot": "category-crm",
    "Pipedrive": "category-crm",
    "GoHighLevel": "category-crm",
    "WordPress": "category-website",
    "Webflow": "category-website",
    "SalesTrekker": "category-broker-industry-tools",
    "ActivePipe": "category-broker-industry-tools",
    "Effi": "category-broker-industry-tools",
    "ActiveCampaign": "category-marketing-growth-platforms",
    "Ontraport": "category-marketing-growth-platforms",
    "Mailchimp": "category-marketing-growth-platforms",
    "Google Ads": "category-marketing-growth-platforms",
    "Meta Ads": "category-marketing-growth-platforms",
    "Google Analytics": "category-marketing-growth-platforms",
    "Google My Business": "category-marketing-growth-platforms",
    "Zapier": "category-automation-integration-platforms",
    "Make.com": "category-automation-integration-platforms",
    "Pabbly": "category-automation-integration-platforms",
    "Slack": "category-collaboration-communication",
    "Microsoft Teams": "category-collaboration-communication",
    "Chameleon": "category-learning-design-course-content",
    "Skool": "category-learning-design-course-content",
    "VideoAsk": "category-video-ux-feedback-tools",
    "Elasticsearch": "category-data-monitoring",
    "OpenObserve": "category-data-monitoring"
};

const SERVICE_CATEGORY_MAP = {
    "Marketing": "category-marketing-growth-platforms",
    "IT Support": "category-core-business",
    "Virtual Assistant": "category-broker-industry-tools",
    "Commercial Finance": "category-broker-industry-tools",
    "Workflow Design": "category-automation-integration-platforms",
    "Public Speaking": "category-collaboration-communication",
    "Accounting & Tax": "category-core-business",
    "Finance Strategy": "category-core-business",
    "Client Experience": "category-marketing-growth-platforms",
    "Mindset": "category-broker-industry-tools",
    "Broker Coaching": "category-broker-industry-tools"
};

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function normalizePricingType(type) {
    if (!type) return 'subscription';
    const t = type.toLowerCase();
    if (t.includes('free') && t.includes('sub')) return 'freemium';
    if (t.includes('freemium')) return 'freemium';
    if (t.includes('free')) return 'free';
    if (t.includes('one-time')) return 'one-time';
    if (t.includes('pay-as-you-go')) return 'pay-as-you-go';
    if (t.includes('custom')) return 'custom';
    return 'subscription';
}

function normalizeBrokerType(types) {
    if (!Array.isArray(types)) return [];
    return types.map(t => {
        if (t === 'Mortgage') return 'Mortgage';
        if (t === 'Asset' || t === 'Asset Finance') return 'Asset Finance';
        if (t === 'Commercial') return 'Commercial';
        return null;
    }).filter(Boolean);
}

function loadNdjson(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return [];
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanContent = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
    return cleanContent
        .split('\n')
        .filter(line => line.trim())
        .map((line, i) => {
            try {
                return JSON.parse(line);
            } catch (e) {
                return null;
            }
        })
        .filter(Boolean);
}

const softwareData = loadNdjson(path.join(__dirname, 'software.ndjson'));
const EXPORT_DIR = 'production-export-2025-12-23t09-23-18-480z';
const serviceProviderData = loadNdjson(path.join(__dirname, EXPORT_DIR, 'data.ndjson'))
    .filter(doc => doc._type === 'serviceProvider' && !doc._id.startsWith('drafts.'));

const docs = [];
const softwareSlugToId = {};

// 1. Process Pilot Software
Object.entries(PILOT_SOFTWARE_MAP).forEach(([name, catId]) => {
    const slug = slugify(name);
    const existing = softwareData.find(s =>
        s.title.toLowerCase() === name.toLowerCase() ||
        s.slug?.current === slug
    );

    const docId = `listing-software-${slug}`;
    softwareSlugToId[slug] = docId;

    const doc = {
        _id: docId,
        _type: 'directoryListing',
        title: name,
        slug: { _type: 'slug', current: slug },
        listingType: 'software',
        category: { _type: 'reference', _ref: catId },
        isFeatured: false
    };

    if (existing) {
        doc.title = existing.title;
        doc.tagline = existing.tagline;
        doc.description = existing.description;
        doc.websiteURL = existing.websiteURL;
        doc.brokerType = normalizeBrokerType(existing.brokerType);
        doc.pricing = { type: normalizePricingType(existing.pricing_model) };
    }

    docs.push(doc);
});

// 2. Process Service Providers
const seenSlugs = new Set();
serviceProviderData.forEach(sp => {
    const slug = sp.slug?.current;
    if (!slug) return;
    if (seenSlugs.has(slug)) return; // Avoid duplicates
    seenSlugs.add(slug);

    const docId = `listing-service-${slug}`;

    let newCatId = "category-broker-industry-tools"; // Default
    const oldCat = typeof sp.category === 'string' ? sp.category : (sp.category?._ref || '');

    for (const [key, val] of Object.entries(SERVICE_CATEGORY_MAP)) {
        if (oldCat.toLowerCase().includes(key.toLowerCase())) {
            newCatId = val;
            break;
        }
    }

    const SERVICE_AREA_MAPPING = {
        "it support": "managed-it",
        "it support (edr)": "endpoint-security-edr",
        "admin support": "operations-support",
        "lead generation": "lead-capture",
        "crm configuration": "crm-optimisation",
        "workflow design": "workflow-mapping",
        "accounting & tax": "profit-optimisation",
        "finance strategy": "financial-strategy"
    };

    const serviceAreaRefs = (sp.serviceAreas || []).map(sa => {
        const areaName = typeof sa === 'string' ? sa : sa.title;
        if (!areaName) return null;

        let areaSlug = slugify(areaName);
        if (SERVICE_AREA_MAPPING[areaName.toLowerCase()]) {
            areaSlug = SERVICE_AREA_MAPPING[areaName.toLowerCase()];
        }

        return {
            _type: 'reference',
            _ref: `serviceArea-${areaSlug}`,
            _key: `sa-${areaSlug}-${Math.random().toString(36).substring(2, 9)}`
        };
    }).filter(Boolean);

    const worksWithRefs = (sp.worksWith || []).map(item => {
        const itemSlug = slugify(item);
        if (softwareSlugToId[itemSlug]) {
            return { _type: 'reference', _ref: softwareSlugToId[itemSlug], _key: `ww-${itemSlug}` };
        }
        return null;
    }).filter(Boolean);

    docs.push({
        _id: docId,
        _type: 'directoryListing',
        title: sp.name,
        slug: { _type: 'slug', current: slug },
        listingType: 'service',
        tagline: sp.tagline,
        description: sp.description,
        category: { _type: 'reference', _ref: newCatId },
        logo: sp.logo,
        websiteURL: sp.websiteUrl || sp.website,
        brokerType: normalizeBrokerType(sp.brokerTypes),
        serviceAreas: serviceAreaRefs,
        worksWith: worksWithRefs,
        isFeatured: sp.isFeatured || false,
        featuredLabel: sp.featuredLabel
    });
});

const output = docs.map(d => JSON.stringify(d)).join('\n');
fs.writeFileSync(path.join(__dirname, 'migrate-pilot.ndjson'), output, 'utf8');

console.log(`Generated ${docs.length} documents for pilot migration.`);
