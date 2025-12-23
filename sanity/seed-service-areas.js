const fs = require('fs');
const path = require('path');

const serviceAreasList = [
    {
        group: "🖥️ Technology, IT & Infrastructure",
        areas: [
            "Managed IT", "Cybersecurity", "Cloud Infrastructure", "Backup & Disaster Recovery",
            "Network Monitoring", "Network Firewalls", "Identity & Access Management (IAM)",
            "System Uptime & Monitoring", "Data Residency & Hosting Region", "Privacy & Data Security",
            "Zero Trust Security", "VoIP & Communications", "Messaging App Sync", "Endpoint Security (EDR)"
        ]
    },
    {
        group: "🧩 CRM, Automation & Systems",
        areas: [
            "CRM Design", "CRM Optimisation", "Marketing Automation", "AI & Automations",
            "System Integrations", "API Integrations", "Workflow Mapping", "Process Automation",
            "Smart Task Automation", "SOP Creation & Documentation", "Database Reactivation",
            "Data Validation & Duplicate Control"
        ]
    },
    {
        group: "📋 Forms, Documents & Client Intake",
        areas: [
            "Lead Capture", "Forms & Surveys", "Smart Form Builders", "Document Collection",
            "Document Collection & Verification", "OCR & AI Document Parsing", "Secure Document Uploads",
            "Submission Review & Approval", "Accept / Reject Workflows"
        ]
    },
    {
        group: "📊 Data, Analytics & Reporting",
        areas: [
            "Data & Analytics", "Reporting & Dashboards", "Margin Reporting Dashboards",
            "Lead Attribution & Source Tracking", "Usage Analytics", "Feature Flags & Releases"
        ]
    },
    {
        group: "📣 Marketing, Growth & Revenue",
        areas: [
            "Paid Ads (Google, Meta, YouTube)", "SEO / SEM / AEO", "Local SEO", "Content Marketing",
            "Copywriting & Storytelling", "Brand Messaging", "Organic Marketing", "Social Media Marketing",
            "Funnels & Landing Pages", "Conversion Rate Optimisation (CRO)", "Referral Systems",
            "Thought Leadership", "Public Relations & Reviews"
        ]
    },
    {
        group: "📞 Sales, Enablement & Client Retention",
        areas: [
            "Sales Training", "Objection Handling & Closing", "Deal & Lead Management Systems",
            "Lead Management Systems", "Client Retention", "Lead Nurture Programs", "Cross-Selling Intelligence"
        ]
    },
    {
        group: "🎓 Learning, Media & Content Delivery",
        areas: [
            "Team Training", "Internal Knowledge Bases", "Course & Learning Design", "Community Building",
            "Video & Podcast Production", "Media Training", "Presentation Skills", "Public Speaking"
        ]
    },
    {
        group: "📅 Scheduling & Events",
        areas: [
            "Calendar Sync", "Scheduling Automation", "Event Registration & Ticketing"
        ]
    },
    {
        group: "🧾 Finance, Broker Ops & Compliance",
        areas: [
            "Loan Processing Systems", "Credit Assessments", "Lender Policy Support", "Broker Compliance",
            "Deal Packaging", "Settlement Processing", "Trail Tracking", "Cashflow Forecasting",
            "Profit Optimisation", "Financial Strategy", "Business Valuations", "Exit & Succession Planning"
        ]
    },
    {
        group: "🛡️ Fraud, Risk & Verification",
        areas: [
            "Fraud Detection Systems", "Compliance Reporting", "Compliance Workflow Automation", "Audit Trail Reporting"
        ]
    },
    {
        group: "👥 Outsourcing & Operations Support",
        areas: [
            "Operations Support", "Offshore Staffing", "Broker Operations Support"
        ]
    },
    {
        group: "🧠 Mindset Coaching & Growth Strategy",
        areas: [
            "Leadership Development", "Performance Management", "Team Task Management", "Team Training",
            "Culture Building", "Founder Accountability", "Emotional Intelligence", "Identity & Confidence Work",
            "Burnout & Nervous System Regulation", "Anxiety Reduction", "Overthinking & Procrastination Support",
            "Focus & Productivity", "High-Performance Psychology"
        ]
    }
];

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const docs = [];

serviceAreasList.forEach(groupObj => {
    const groupName = groupObj.group;
    groupObj.areas.forEach(area => {
        docs.push({
            _id: `serviceArea-${slugify(area)}`,
            _type: 'serviceArea',
            title: area,
            slug: { _type: 'slug', current: slugify(area) },
            group: groupName
        });
    });
});

const ndjson = docs.map(d => JSON.stringify(d)).join('\n');
fs.writeFileSync(path.join(__dirname, 'seed-service-areas.ndjson'), ndjson);

console.log(`Generated ${docs.length} service area documents.`);
