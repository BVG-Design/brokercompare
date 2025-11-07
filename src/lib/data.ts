import type { Service, Software, Review } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getLogo = (type: 'provider' | 'software', index: number) => {
    const id = `${type}-logo-${index + 1}`;
    const image = PlaceHolderImages.find(p => p.id === id);
    return image ? image.imageUrl : `https://picsum.photos/seed/${id}/100/100`;
};

const getAvatar = (index: number) => {
    const id = `avatar-${index + 1}`;
    const image = PlaceHolderImages.find(p => p.id === id);
    return image ? image.imageUrl : `https://picsum.photos/seed/${id}/40/40`;
}

const reviews: Review[] = [
  { id: 'review-1', author: 'John D.', avatarUrl: getAvatar(0), rating: 5, comment: 'Exceptional service and support. Highly recommended!', date: '2023-10-15' },
  { id: 'review-2', author: 'Sarah P.', avatarUrl: getAvatar(1), rating: 4, comment: 'Very effective, though a bit pricey. The results speak for themselves.', date: '2023-09-22' },
  { id: 'review-3', author: 'Mike T.', avatarUrl: getAvatar(2), rating: 3, comment: 'Good, but the onboarding process could be smoother.', date: '2023-11-01' },
];

export const services: Service[] = [
  {
    id: 'marketing-pro-au',
    name: 'Marketing Pro AU',
    category: 'Marketing',
    logoUrl: getLogo('provider', 0),
    tagline: 'Driving growth for Australian brokers.',
    description: 'A full-suite digital marketing agency specializing in lead generation, social media management, and SEO for the finance industry.',
    location: 'Sydney, NSW',
    website: 'https://marketingproau.com',
    reviews: reviews,
    features: ['Lead Generation Campaigns', 'SEO & Content Marketing', 'Social Media Management', 'PPC Advertising'],
  },
  {
    id: 'va-connect',
    name: 'VA Connect',
    category: 'Virtual Assistant',
    logoUrl: getLogo('provider', 1),
    tagline: 'Your reliable remote back-office support.',
    description: 'VA Connect provides highly-trained virtual assistants to handle administrative tasks, client communication, and appointment setting for busy brokers.',
    location: 'Melbourne, VIC',
    website: 'https://vaconnect.com',
    reviews: [reviews[1], reviews[2]],
    features: ['Appointment Scheduling', 'Email & Calendar Management', 'Client Follow-ups', 'Data Entry'],
  },
  {
    id: 'commercial-finance-experts',
    name: 'Commercial Finance Experts',
    category: 'Commercial Finance',
    logoUrl: getLogo('provider', 2),
    tagline: 'Complex deals, simplified.',
    description: 'We partner with brokers to structure and secure complex commercial and development finance deals, providing expertise and access to a wide panel of lenders.',
    location: 'Brisbane, QLD',
    website: 'https://cfexperts.com',
    reviews: [reviews[0]],
    features: ['Deal Structuring', 'Scenario Analysis', 'Access to Private Lenders', 'Development Finance'],
  },
   {
    id: 'broker-boost',
    name: 'Broker Boost',
    category: 'Marketing',
    logoUrl: getLogo('provider', 3),
    tagline: 'Amplify your brand and reach.',
    description: 'Specialists in branding and content creation for mortgage brokers, helping you stand out in a crowded market.',
    location: 'Perth, WA',
    website: 'https://brokerboost.com',
    reviews: [reviews[0], reviews[1], reviews[2]],
    features: ['Brand Identity Design', 'Video Marketing', 'Blog & Article Writing', 'Email Newsletters'],
  },
   {
    id: 'admin-assist-plus',
    name: 'Admin Assist Plus',
    category: 'Virtual Assistant',
    logoUrl: getLogo('provider', 4),
    tagline: 'Focus on what you do best - selling.',
    description: 'Our team of experienced VAs integrates seamlessly with your existing workflow to provide top-tier administrative support.',
    location: 'Adelaide, SA',
    website: 'https://adminassistplus.com',
    reviews: [reviews[1]],
    features: ['Loan Application Support', 'CRM Management', 'Compliance Checks', 'General Admin'],
  },
];

export const software: Software[] = [
  {
    id: 'broker-crm-x',
    name: 'BrokerCRM X',
    category: 'CRM',
    logoUrl: getLogo('software', 0),
    tagline: 'The all-in-one client relationship platform.',
    description: 'Manage your client pipeline, automate follow-ups, and track commissions with a powerful CRM built specifically for brokers.',
    pricing: 'Starts at $99/month',
    compatibility: ['Xero', 'Zapier', 'Office 365'],
    reviews: reviews,
    features: ['Lead Management', 'Automated Workflows', 'Commission Tracking', 'Reporting Dashboard'],
  },
  {
    id: 'loan-flow-pro',
    name: 'LoanFlow Pro',
    category: 'Loan Processing',
    logoUrl: getLogo('software', 1),
    tagline: 'Streamline your application process.',
    description: 'A dedicated loan processing tool that simplifies document collection, submission, and tracking from application to settlement.',
    pricing: '$75/user/month',
    compatibility: ['ApplyOnline', 'NextGen.Net'],
    reviews: [reviews[0], reviews[2]],
    features: ['Digital Document Collection', 'Lender Portal Integration', 'Automated Status Updates', 'Client Portal'],
  },
  {
    id: 'comply-guard',
    name: 'ComplyGuard',
    category: 'Compliance',
    logoUrl: getLogo('software', 2),
    tagline: 'Compliance made easy.',
    description: 'Stay on top of your regulatory obligations with automated compliance checks, reporting, and audit trail capabilities.',
    pricing: 'Contact for enterprise pricing',
    compatibility: ['BrokerCRM X', 'Salesforce'],
    reviews: [reviews[1]],
    features: ['Best Interest Duty (BID) Tools', 'Automated Disclosure Generation', 'Audit Log', 'CPD Tracking'],
  },
  {
    id: 'reach-engine',
    name: 'ReachEngine',
    category: 'Marketing Automation',
    logoUrl: getLogo('software', 3),
    tagline: 'Automate your marketing, grow your client base.',
    description: 'An easy-to-use platform for creating email campaigns, social media posts, and managing your online presence.',
    pricing: 'Starts at $49/month',
    compatibility: ['Facebook', 'LinkedIn', 'Mailchimp API'],
    reviews: [reviews[0], reviews[1]],
    features: ['Email Campaign Builder', 'Social Media Scheduler', 'Lead Capture Forms', 'Analytics'],
  },
];
