import { Home, Settings, Smartphone, Users, FileText, Zap, Sparkles, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';

export const navGroups = [
    {
        label: 'Software',
        items: [
            { label: 'Getting Started', category: 'getting-started', icon: Home },
            { label: 'AI & Workflow Design', category: 'ai_workflow_design', icon: Zap },
            { label: 'Mortgage Software', category: 'mortgage_software', icon: Smartphone },
            { label: 'Asset Software', category: 'asset_software', icon: Settings },
            { label: 'Commercial Software', category: 'commercial_software', icon: FileText },
            { label: 'CRM & Document Collection', category: 'crm_document_collection', icon: Users },
            { label: 'Other Topics', category: 'software-all', icon: Sparkles },
        ],
    },
    {
        label: 'Services',
        items: [
            { label: 'Broker Coaching', category: 'broker_coaching', icon: Users },
            { label: 'Virtual Assistants & Outsourcing', category: 'virtual_assistants_outsourcing', icon: Users },
            { label: 'Mindset & Performance', category: 'mindset_performance', icon: Sparkles },
            { label: 'Client Experience & Retention', category: 'client_experience_retention', icon: Users },
            { label: 'More Growth Topics', category: 'services-all', icon: Sparkles },
        ],
    },
    {
        label: 'Support',
        badge: 'Coming Soon',
        items: [
            { label: 'Workbooks & Guides', category: 'workbooks_guides', icon: BookOpen },
            { label: 'VA Training & Development', category: 'va_training_development', icon: Users },
            { label: 'Audits & Assessments', category: 'audits_assessments', icon: ShieldCheck },
            { label: 'Further Help', category: 'further_help', icon: HelpCircle },
        ],
    },
];

export const flatCategories = [
    { value: 'all', label: 'All Categories' },
    // Top Priority
    { value: 'ai_workflow_design', label: 'AI & Workflow Design' },
    { value: 'mortgage_software', label: 'Mortgage Software' },
    { value: 'asset_software', label: 'Asset Software' },
    { value: 'commercial_software', label: 'Commercial Software' },
    { value: 'crm_document_collection', label: 'CRM & Document Collection' },
    // Alphabetical
    { value: 'accounting_tax', label: 'Accounting & Tax' },
    { value: 'admin_ops', label: 'Admin & Ops' },
    { value: 'brand_media', label: 'Brand & Media' },
    { value: 'broker_coaching', label: 'Broker Coaching' },
    { value: 'client_experience_retention', label: 'Client Experience & Retention' },
    { value: 'compliance_risk_legal', label: 'Compliance, Risk & Legal' },
    { value: 'data_reporting', label: 'Data & Reporting' },
    { value: 'finance_strategy_virtual_cfo', label: 'Finance Strategy & Virtual CFO' },
    { value: 'it_support_cyber_security', label: 'IT Support & Cyber Security' },
    { value: 'loan_processing_credit_support', label: 'Loan Processing & Credit Support' },
    { value: 'marketing_automation', label: 'Marketing Automation' },
    { value: 'mindset_performance', label: 'Mindset & Performance' },
    { value: 'organic_social_traffic', label: 'Organic Social Traffic' },
    { value: 'other', label: 'Other' },
    { value: 'paid_advertising', label: 'Paid Advertising' },
    { value: 'public_speaking_authority', label: 'Public Speaking & Authority' },
    { value: 'recruitment_team_building', label: 'Recruitment & Team Building' },
    { value: 'sales_training', label: 'Sales Training' },
    { value: 'virtual_assistants_outsourcing', label: 'Virtual Assistants & Outsourcing' },
];

export const brokerTypes = [
    { label: 'All Broker Types', value: 'all' },
    { label: 'Mortgage Broker', value: 'Mortgage Broker' },
    { label: 'Asset Finance Broker', value: 'Asset Finance Broker' },
    { label: 'Commercial Finance Broker', value: 'Commercial Finance Broker' },
];

export const listingTypes = [
    { label: 'All Listings', value: 'all' },
    { label: 'Guide', value: 'Guide' },
    { label: 'News', value: 'News' },
    { label: 'Case Study', value: 'Case Study' },
    { label: 'Review', value: 'Review' },
];
