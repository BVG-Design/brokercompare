const fs = require('fs');

const data = [
    {
        "_type": "serviceArea",
        "title": "Managed IT Services",
        "slug": { "_type": "slug", "current": "managed-it-services" },
        "metaDescription": "Ongoing IT support, maintenance and infrastructure management",
        "description": "Outsourced management of business IT systems including support, updates, security and performance",
        "synonyms": ["IT support", "IT management", "MSP", "managed services"]
    },
    {
        "_type": "serviceArea",
        "title": "Cloud Infrastructure & Hosting",
        "slug": { "_type": "slug", "current": "cloud-infrastructure-hosting" },
        "metaDescription": "Secure cloud hosting and infrastructure management",
        "description": "Design, deployment and management of cloud servers, storage and environments",
        "synonyms": ["Cloud hosting", "cloud servers", "IaaS", "cloud platforms"]
    },
    {
        "_type": "serviceArea",
        "title": "Data Residency & Hosting Region",
        "slug": { "_type": "slug", "current": "data-residency-hosting-region" },
        "metaDescription": "Control where your data is stored and processed",
        "description": "Ensures data is hosted in compliant geographic regions",
        "synonyms": ["Data sovereignty", "local hosting", "regional hosting"]
    },
    {
        "_type": "serviceArea",
        "title": "System Uptime, Monitoring & Alerts",
        "slug": { "_type": "slug", "current": "system-uptime-monitoring-alerts" },
        "metaDescription": "Real-time monitoring to keep systems online",
        "description": "Tracks system health with alerts for outages or performance issues",
        "synonyms": ["Uptime monitoring", "system alerts", "observability"]
    },
    {
        "_type": "serviceArea",
        "title": "Backup & Disaster Recovery",
        "slug": { "_type": "slug", "current": "backup-disaster-recovery" },
        "metaDescription": "Protect data with backups and recovery plans",
        "description": "Automated backups and recovery strategies for outages or data loss",
        "synonyms": ["BDR", "data recovery", "business continuity"]
    },
    {
        "_type": "serviceArea",
        "title": "Cybersecurity",
        "slug": { "_type": "slug", "current": "cybersecurity" },
        "metaDescription": "Protect systems from cyber threats",
        "description": "Tools and practices to secure networks, applications and data",
        "synonyms": ["Information security", "cyber protection"]
    },
    {
        "_type": "serviceArea",
        "title": "Identity & Access Management (IAM)",
        "slug": { "_type": "slug", "current": "identity-access-management" },
        "metaDescription": "Control user identities and access securely",
        "description": "Manages who can access systems and data",
        "synonyms": ["IAM", "access control", "identity security"]
    },
    {
        "_type": "serviceArea",
        "title": "Single Sign-On (SSO)",
        "slug": { "_type": "slug", "current": "single-sign-on" },
        "metaDescription": "One login across multiple systems",
        "description": "Allows users to authenticate once across platforms",
        "synonyms": ["SSO", "unified login"]
    },
    {
        "_type": "serviceArea",
        "title": "Zero Trust Security",
        "slug": { "_type": "slug", "current": "zero-trust-security" },
        "metaDescription": "Secure systems with zero trust principles",
        "description": "Assumes no user or device is trusted by default",
        "synonyms": ["Zero trust model", "ZTNA"]
    },
    {
        "_type": "serviceArea",
        "title": "Security, Encryption & Key Management",
        "slug": { "_type": "slug", "current": "security-encryption-key-management" },
        "metaDescription": "Protect data using encryption and key controls",
        "description": "Manages encryption standards and cryptographic keys",
        "synonyms": ["Data encryption", "key vaults"]
    },
    {
        "_type": "serviceArea",
        "title": "Penetration Testing",
        "slug": { "_type": "slug", "current": "penetration-testing" },
        "metaDescription": "Identify security weaknesses before attackers do",
        "description": "Simulated cyber attacks to test system security",
        "synonyms": ["Pen testing", "security testing"]
    },
    {
        "_type": "serviceArea",
        "title": "Privacy & Data Protection",
        "slug": { "_type": "slug", "current": "privacy-data-protection" },
        "metaDescription": "Safeguard personal and sensitive data",
        "description": "Ensures compliance with privacy laws and best practices",
        "synonyms": ["Data privacy", "GDPR", "privacy controls"]
    },
    {
        "_type": "serviceArea",
        "title": "SOC 2 & Security Compliance",
        "slug": { "_type": "slug", "current": "soc2-security-compliance" },
        "metaDescription": "Meet SOC 2 and security compliance standards",
        "description": "Frameworks and audits for security governance",
        "synonyms": ["SOC 2", "ISO 27001", "compliance"]
    },
    {
        "_type": "serviceArea",
        "title": "Fraud Detection & Prevention",
        "slug": { "_type": "slug", "current": "fraud-detection-prevention" },
        "metaDescription": "Detect and prevent fraudulent activity",
        "description": "Systems to identify suspicious behaviour and reduce risk",
        "synonyms": ["Fraud monitoring", "anti-fraud"]
    },
    {
        "_type": "serviceArea",
        "title": "User Access & Permissions",
        "slug": { "_type": "slug", "current": "user-access-permissions" },
        "metaDescription": "Control what users can see and do",
        "description": "Fine-grained permission and role management",
        "synonyms": ["RBAC", "permissions"]
    },
    {
        "_type": "serviceArea",
        "title": "Multi-Tenant Architecture",
        "slug": { "_type": "slug", "current": "multi-tenant-architecture" },
        "metaDescription": "Secure shared platforms for multiple clients",
        "description": "Architecture supporting multiple customers securely",
        "synonyms": ["Multi-tenant systems", "SaaS architecture"]
    },
    {
        "_type": "serviceArea",
        "title": "White-Label Platforms",
        "slug": { "_type": "slug", "current": "white-label-platforms" },
        "metaDescription": "Rebrand platforms as your own",
        "description": "Software that can be fully branded for resale",
        "synonyms": ["White label software", "rebranded SaaS"]
    },
    {
        "_type": "serviceArea",
        "title": "Mobile Applications",
        "slug": { "_type": "slug", "current": "mobile-applications" },
        "metaDescription": "iOS and Android business applications",
        "description": "Design and development of mobile apps",
        "synonyms": ["Mobile apps", "iOS apps", "Android apps"]
    },
    {
        "_type": "serviceArea",
        "title": "CRM Design & Architecture",
        "slug": { "_type": "slug", "current": "crm-design-architecture" },
        "metaDescription": "Design scalable CRM systems",
        "description": "Structuring CRMs for data, workflows and growth",
        "synonyms": ["CRM setup", "CRM systems"]
    },
    {
        "_type": "serviceArea",
        "title": "Deal & Lead Management",
        "slug": { "_type": "slug", "current": "deal-lead-management" },
        "metaDescription": "Track leads and deals efficiently",
        "description": "Manage prospects from enquiry to conversion",
        "synonyms": ["Lead tracking", "deal tracking"]
    },
    {
        "_type": "serviceArea",
        "title": "Opportunity & Pipeline Management",
        "slug": { "_type": "slug", "current": "opportunity-pipeline-management" },
        "metaDescription": "Visualise and manage sales pipelines",
        "description": "Tracks deal stages and conversion progress",
        "synonyms": ["Sales pipeline", "opportunity tracking"]
    },
    {
        "_type": "serviceArea",
        "title": "Data Validation & De-Duplication",
        "slug": { "_type": "slug", "current": "data-validation-deduplication" },
        "metaDescription": "Clean and accurate data management",
        "description": "Prevents duplicates and incorrect data",
        "synonyms": ["Data cleansing", "deduplication"]
    },
    {
        "_type": "serviceArea",
        "title": "System Integrations & APIs",
        "slug": { "_type": "slug", "current": "system-integrations-apis" },
        "metaDescription": "Connect tools via APIs and integrations",
        "description": "Enables systems to share data automatically",
        "synonyms": ["API integrations", "system sync"]
    },
    {
        "_type": "serviceArea",
        "title": "AI & Intelligent Automation",
        "slug": { "_type": "slug", "current": "ai-intelligent-automation" },
        "metaDescription": "AI-powered workflow automation",
        "description": "Uses AI to automate decisions and tasks",
        "synonyms": ["AI automation", "intelligent workflows"]
    },
    {
        "_type": "serviceArea",
        "title": "Process Automation",
        "slug": { "_type": "slug", "current": "process-automation" },
        "metaDescription": "Automate repetitive business processes",
        "description": "Streamlines workflows and operations",
        "synonyms": ["Workflow automation", "RPA"]
    },
    {
        "_type": "serviceArea",
        "title": "Data Sync & Webhooks",
        "slug": { "_type": "slug", "current": "data-sync-webhooks" },
        "metaDescription": "Real-time data syncing between systems",
        "description": "Pushes updates automatically across platforms",
        "synonyms": ["Webhooks", "data syncing"]
    },
    {
        "_type": "serviceArea",
        "title": "Workflow Design",
        "slug": { "_type": "slug", "current": "workflow-design" },
        "metaDescription": "Design efficient business workflows",
        "description": "Maps and optimises processes",
        "synonyms": ["Workflow mapping", "process design"]
    },
    {
        "_type": "serviceArea",
        "title": "In-App Notifications",
        "slug": { "_type": "slug", "current": "in-app-notifications" },
        "metaDescription": "Notify users inside applications",
        "description": "Alerts users of actions or updates",
        "synonyms": ["App alerts", "notifications"]
    },
    {
        "_type": "serviceArea",
        "title": "Internal Knowledge Bases",
        "slug": { "_type": "slug", "current": "internal-knowledge-bases" },
        "metaDescription": "Centralised internal documentation",
        "description": "Stores SOPs, guides and internal knowledge",
        "synonyms": ["Knowledge base", "internal wiki"]
    },
    {
        "_type": "serviceArea",
        "title": "AI Chatbots & Assistants",
        "slug": { "_type": "slug", "current": "ai-chatbots-assistants" },
        "metaDescription": "AI assistants for support and productivity",
        "description": "Conversational AI for users or teams",
        "synonyms": ["Chatbots", "AI assistants"]
    },
    {
        "_type": "serviceArea",
        "title": "Smart Task Automation",
        "slug": { "_type": "slug", "current": "smart-task-automation" },
        "metaDescription": "Automate tasks based on logic",
        "description": "Triggers tasks automatically",
        "synonyms": ["Task automation"]
    },
    {
        "_type": "serviceArea",
        "title": "Data, Analytics & Reporting",
        "slug": { "_type": "slug", "current": "data-analytics-reporting" },
        "metaDescription": "Turn data into insights",
        "description": "Dashboards, metrics and reporting",
        "synonyms": ["Business intelligence", "analytics"]
    },
    {
        "_type": "serviceArea",
        "title": "Lead Attribution & Source Tracking",
        "slug": { "_type": "slug", "current": "lead-attribution-source-tracking" },
        "metaDescription": "Track where leads come from",
        "description": "Identifies marketing sources driving leads",
        "synonyms": ["Attribution tracking"]
    },
    {
        "_type": "serviceArea",
        "title": "Paid Advertising (Google, Meta, YouTube)",
        "slug": { "_type": "slug", "current": "paid-advertising" },
        "metaDescription": "Paid ad campaign management",
        "description": "Strategy and execution of paid ads",
        "synonyms": ["PPC", "paid media"]
    },
    {
        "_type": "serviceArea",
        "title": "Conversion Rate Optimisation (CRO)",
        "slug": { "_type": "slug", "current": "conversion-rate-optimisation" },
        "metaDescription": "Improve website conversion rates",
        "description": "Testing and optimisation for conversions",
        "synonyms": ["CRO", "funnel optimisation"]
    },
    {
        "_type": "serviceArea",
        "title": "SEO SEM & AEO",
        "slug": { "_type": "slug", "current": "seo-sem-aeo" },
        "metaDescription": "Search and AI optimisation strategies",
        "description": "Optimisation for search engines and AI answers",
        "synonyms": ["SEO", "SEM", "AEO"]
    },
    {
        "_type": "serviceArea",
        "title": "Organic Marketing Strategy",
        "slug": { "_type": "slug", "current": "organic-marketing-strategy" },
        "metaDescription": "Sustainable organic growth strategies",
        "description": "Non-paid marketing approaches",
        "synonyms": ["Organic growth"]
    },
    {
        "_type": "serviceArea",
        "title": "Content Marketing",
        "slug": { "_type": "slug", "current": "content-marketing" },
        "metaDescription": "Content to attract and educate audiences",
        "description": "Blogs, guides, resources",
        "synonyms": ["Content strategy"]
    },
    {
        "_type": "serviceArea",
        "title": "Copywriting & Storytelling",
        "slug": { "_type": "slug", "current": "copywriting-storytelling" },
        "metaDescription": "Persuasive messaging and narratives",
        "description": "Writing that converts and connects",
        "synonyms": ["Copywriting"]
    },
    {
        "_type": "serviceArea",
        "title": "Brand Messaging & Positioning",
        "slug": { "_type": "slug", "current": "brand-messaging-positioning" },
        "metaDescription": "Clear brand positioning",
        "description": "Defines brand voice and market fit",
        "synonyms": ["Brand strategy"]
    },
    {
        "_type": "serviceArea",
        "title": "Thought Leadership Strategy",
        "slug": { "_type": "slug", "current": "thought-leadership-strategy" },
        "metaDescription": "Build authority in your industry",
        "description": "Content and presence for authority",
        "synonyms": ["Authority building"]
    },
    {
        "_type": "serviceArea",
        "title": "Social Media Marketing (SMM)",
        "slug": { "_type": "slug", "current": "social-media-marketing" },
        "metaDescription": "Social media growth and engagement",
        "description": "Strategy and execution across platforms",
        "synonyms": ["SMM", "social marketing"]
    },
    {
        "_type": "serviceArea",
        "title": "LinkedIn Authority Building",
        "slug": { "_type": "slug", "current": "linkedin-authority-building" },
        "metaDescription": "Build authority on LinkedIn",
        "description": "Position leaders as industry experts",
        "synonyms": ["LinkedIn marketing"]
    },
    {
        "_type": "serviceArea",
        "title": "Influencer & Partnership Marketing",
        "slug": { "_type": "slug", "current": "influencer-partnership-marketing" },
        "metaDescription": "Strategic partnerships for growth",
        "description": "Leverage partnerships and influencers",
        "synonyms": ["Partnerships"]
    },
    {
        "_type": "serviceArea",
        "title": "Public Relations & Reviews",
        "slug": { "_type": "slug", "current": "public-relations-reviews" },
        "metaDescription": "Manage PR and reputation",
        "description": "Earned media and reviews",
        "synonyms": ["PR", "reputation management"]
    },
    {
        "_type": "serviceArea",
        "title": "Lead Capture & Nurture",
        "slug": { "_type": "slug", "current": "lead-capture-nurture" },
        "metaDescription": "Capture and nurture leads",
        "description": "Forms, emails and follow-ups",
        "synonyms": ["Lead nurturing"]
    },
    {
        "_type": "serviceArea",
        "title": "Funnels & Landing Pages",
        "slug": { "_type": "slug", "current": "funnels-landing-pages" },
        "metaDescription": "Conversion-focused funnels and pages",
        "description": "Design high-converting funnels",
        "synonyms": ["Sales funnels"]
    },
    {
        "_type": "serviceArea",
        "title": "Landing Page Builders (No-Code)",
        "slug": { "_type": "slug", "current": "landing-page-builders" },
        "metaDescription": "Build landing pages without code",
        "description": "Drag-and-drop landing page tools",
        "synonyms": ["No-code pages"]
    },
    {
        "_type": "serviceArea",
        "title": "Smart Form Builders",
        "slug": { "_type": "slug", "current": "smart-form-builders" },
        "metaDescription": "Intelligent form creation",
        "description": "Dynamic and conditional forms",
        "synonyms": ["Form builders"]
    },
    {
        "_type": "serviceArea",
        "title": "Marketing Automation",
        "slug": { "_type": "slug", "current": "marketing-automation" },
        "metaDescription": "Automated marketing workflows",
        "description": "Email, SMS and campaign automation",
        "synonyms": ["Martech"]
    },
    {
        "_type": "serviceArea",
        "title": "Email Marketing",
        "slug": { "_type": "slug", "current": "email-marketing" },
        "metaDescription": "Email campaigns and automation",
        "description": "Nurture and convert via email",
        "synonyms": ["EDM"]
    },
    {
        "_type": "serviceArea",
        "title": "Project Management",
        "slug": { "_type": "slug", "current": "project-management" },
        "metaDescription": "Manage projects and delivery",
        "description": "Tools and processes for projects",
        "synonyms": ["PM tools"]
    },
    {
        "_type": "serviceArea",
        "title": "Team Task Management",
        "slug": { "_type": "slug", "current": "team-task-management" },
        "metaDescription": "Coordinate team tasks",
        "description": "Assign and track work",
        "synonyms": ["Task tracking"]
    },
    {
        "_type": "serviceArea",
        "title": "SOP Creation & Documentation",
        "slug": { "_type": "slug", "current": "sop-creation-documentation" },
        "metaDescription": "Document standard processes",
        "description": "Create operational documentation",
        "synonyms": ["SOPs"]
    },
    {
        "_type": "serviceArea",
        "title": "Time Tracking & Capacity Planning",
        "slug": { "_type": "slug", "current": "time-tracking-capacity-planning" },
        "metaDescription": "Track time and team capacity",
        "description": "Monitor workload and utilisation",
        "synonyms": ["Capacity planning"]
    },
    {
        "_type": "serviceArea",
        "title": "Loan Processing Systems",
        "slug": { "_type": "slug", "current": "loan-processing-systems" },
        "metaDescription": "End-to-end loan processing",
        "description": "Manage loan workflows",
        "synonyms": ["Loan systems"]
    },
    {
        "_type": "serviceArea",
        "title": "Credit Assessment Tools",
        "slug": { "_type": "slug", "current": "credit-assessment-tools" },
        "metaDescription": "Assess borrower credit",
        "description": "Credit decision tools",
        "synonyms": ["Credit scoring"]
    },
    {
        "_type": "serviceArea",
        "title": "Document Collection & Verification",
        "slug": { "_type": "slug", "current": "document-collection-verification" },
        "metaDescription": "Secure document handling",
        "description": "Collect and verify documents",
        "synonyms": ["Document management", "Upload Document Form"]
    },
    {
        "_type": "serviceArea",
        "title": "OCR & AI Document Parsing",
        "slug": { "_type": "slug", "current": "ocr-ai-document-parsing" },
        "metaDescription": "Extract data from documents",
        "description": "AI-powered document reading",
        "synonyms": ["OCR", "Document Scanning and Extraction"]
    },
    {
        "_type": "serviceArea",
        "title": "E-Signature & Consent Management",
        "slug": { "_type": "slug", "current": "e-signature-consent-management" },
        "metaDescription": "Digital signatures and consent",
        "description": "Secure signing workflows",
        "synonyms": ["E-signatures", "Digital Sign"]
    },
    {
        "_type": "serviceArea",
        "title": "Compliance Management (AFSL / Credit Licence)",
        "slug": { "_type": "slug", "current": "compliance-management" },
        "metaDescription": "Financial compliance management",
        "description": "Regulatory compliance tools",
        "synonyms": ["Compliance systems"]
    },
    {
        "_type": "serviceArea",
        "title": "Audit Trails",
        "slug": { "_type": "slug", "current": "audit-trails" },
        "metaDescription": "Track system changes",
        "description": "Logs of actions and changes",
        "synonyms": ["Change logs", "Risk Management", "QA Logs"]
    }
];

// Convert to NDJSON format
const ndjson = data.map(item => JSON.stringify(item)).join('\n');

// Write to file
fs.writeFileSync('serviceAreas.json', ndjson, 'utf8');

console.log('✅ serviceAreas.json created successfully!');
console.log(`📝 Generated ${data.length} service areas`);