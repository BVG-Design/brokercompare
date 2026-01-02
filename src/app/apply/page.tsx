'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { searchFeatures, searchIntegrations, searchAggregators } from './actions';
import {
  Save,
  Plus,
  Trash2,
  Globe,
  Type,
  AlignLeft,
  Tag,
  Puzzle,
  Video,
  FileText,
  Link as LinkIcon,
  AlertCircle,
  Target,
  Users,
  DollarSign,
  Check,
  User,
  Mail,
  Phone,
  CopyPlus,
  Layers,
  Building2,
  Upload,
  X,
  CheckCircle,
  Loader2,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Info,
  Briefcase,
  RefreshCcw,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ProductType = 'Software' | 'Service' | 'Product' | 'Other';

const PRICING_STRUCTURE_OPTIONS = [
  'Flat/Fixed fee',
  'Tiered Pricing',
  'Usage Base',
  'Per Seat/User',
  'Percentage/Revenue Share',
  'Subscription',
  'One-time Purchase',
  'Custom Quote'
];

const AGGREGATOR_COMPATIBILITY_OPTIONS = [
  { id: 'api', label: 'API' },
  { id: 'webhook', label: 'Webhook' },
  { id: 'zapier', label: 'Zapier' },
  { id: 'nocode', label: 'No Code (e.g. Make.com, n8n' },
  { id: 'direct', label: 'Direct Integration' },
  { id: 'none', label: 'No Integration/Standalone' }
];

const TEAM_SIZE_OPTIONS = [
  { value: 'independent', label: 'independent (1-2)' },
  { value: 'small', label: 'small (3-6)' },
  { value: 'med', label: 'med (7-10)' },
  { value: 'large', label: 'large (10+)' },
];

const REVENUE_OPTIONS = [
  { value: 'under_15k', label: 'Under $15k / month' },
  { value: '15k_30k', label: '$15k - $30k / month' },
  { value: '30k_60k', label: '$30k - $60k / month' },
  { value: '60k_100k', label: '$60k - $100k / month' },
  { value: '100k_plus', label: '$100k+ / month' },
];

const BROKER_TYPE_OPTIONS = [
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'asset', label: 'Asset' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

const COMMERCIAL_SUBTYPES = [
  { value: 'dev_finance', label: 'Development Finance' },
  { value: 'sme_lending', label: 'SME Lending' },
  { value: 'equipment', label: 'Equipment Finance' },
  { value: 'cashflow', label: 'Cashflow Finance' },
  { value: 'comm_property', label: 'Commercial Property' },
  { value: 'trade_finance', label: 'Trade Finance' },
  { value: 'other', label: 'Other' },
];

const LOOKING_TO_OPTIONS = [
  { value: 'reduce_admin', label: 'Reduce admin and manual work' },
  { value: 'improve_client', label: 'Improve client experience' },
  { value: 'scale_no_hire', label: 'Scale without hiring' },
  { value: 'better_reporting', label: 'Get better reporting or visibility' },
  { value: 'compliance_confidence', label: 'Improve compliance confidence' },
  { value: 'replace_spreadsheets', label: 'Replace spreadsheets or legacy tools' },
  { value: 'consolidate_systems', label: 'Consolidate multiple systems' },
  { value: 'other', label: 'Other' },
];

const REFERRAL_SOURCES = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'chatgpt_ai', label: 'ChatGPT/AI Chat' },
  { value: 'google', label: 'Google' },
  { value: 'friend_referral', label: 'Friend/Referral' },
];

const DEFAULT_AGGREGATORS = [
  'LMG',
  'CONNECTIVE',
  'FINSURE',
  'NMB',
  'AFG',
  'MORTGAGE CHOICE',
  'CHOICE',
  'FAST',
  'PLAN AUSTRALIA',
  'OUTSOURCE FINANCIAL'
];

type ApplicationData = {
  id: string;
  name: string;
  type: ProductType;
  typeOther: string;
  productImage: string;
  productImageFile: File | null;
  tagline: string;
  description: string;
  website: string;
  pricingStructure: string;
  pricingPackages: Array<{
    id: string;
    name: string;
    price: string;
    subtext: string;
    features: string[];
  }>;
  specialOffer: string;
  pricingDetails: string;
  features: string[];
  newFeature: string;
  integrations: string[];
  newIntegration: string;
  teamSize: string[];
  revenue: string[];
  brokerType: string[];
  brokerTypeOther: string;
  commercialSubtypes: string[];
  commercialTypeOther: string;
  budgetAmount: string;
  budgetPeriod: 'monthly' | 'yearly' | 'project';
  lookingTo: string[];
  lookingToOther: string;
  notFitFor: string;
  wantsTraining: boolean;
  aggregatorCompatibility: string[];
  integrationDocsLink: string;
  selectedAggregators: string[];
  integrationNotes: string;
};

const buildInitialAppData = (id: string, count: number): ApplicationData => ({
  id,
  name: count === 0 ? 'Primary Offering' : `Offering ${count + 1}`,
  type: 'Software',
  typeOther: '',
  productImage: '',
  productImageFile: null,
  tagline: '',
  description: '',
  website: '',
  pricingStructure: PRICING_STRUCTURE_OPTIONS[0],
  pricingPackages: [
    { id: `pkg-${Date.now()}`, name: '', price: '', subtext: '', features: [''] }
  ],
  specialOffer: '',
  pricingDetails: '',
  features: [],
  newFeature: '',
  integrations: [],
  newIntegration: '',
  teamSize: [],
  revenue: [],
  brokerType: [],
  brokerTypeOther: '',
  commercialSubtypes: [],
  commercialTypeOther: '',
  budgetAmount: '',
  budgetPeriod: 'monthly',
  lookingTo: [],
  lookingToOther: '',
  notFitFor: '',
  wantsTraining: false,
  aggregatorCompatibility: [],
  integrationDocsLink: '',
  selectedAggregators: [],
  integrationNotes: '',
});

const RequiredAsterisk = () => <span className="text-red-500 ml-0.5">*</span>;

export default function ApplyPartnerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [featureSuggestions, setFeatureSuggestions] = useState<string[]>([]);
  const [integrationSuggestions, setIntegrationSuggestions] = useState<string[]>([]);
  const [aggregatorSearch, setAggregatorSearch] = useState('');
  const [filteredAggregators, setFilteredAggregators] = useState<string[]>(DEFAULT_AGGREGATORS);

  const [profile, setProfile] = useState({
    logo: '',
    companyName: '',
    website: '',
    referralSource: '',
    referralName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    logoFile: null as File | null,
  });

  const [applications, setApplications] = useState<ApplicationData[]>([
    buildInitialAppData('app-1', 0)
  ]);
  const [selectedAppId, setSelectedAppId] = useState('app-1');
  const [finalNotes, setFinalNotes] = useState('');

  const selectedApp = useMemo(
    () => applications.find((app) => app.id === selectedAppId) || applications[0],
    [applications, selectedAppId]
  );

  const hasTechnicalIntegration = ['api', 'webhook', 'zapier', 'nocode'].some(id =>
    selectedApp.aggregatorCompatibility?.includes(id)
  );
  const hasDirectIntegration = selectedApp.aggregatorCompatibility?.includes('direct');
  const showIntegrationNotes = (selectedApp.aggregatorCompatibility?.length ?? 0) > 0;

  const updateAppData = (updater: (data: ApplicationData) => ApplicationData) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === selectedAppId ? updater(app) : app))
    );
  };

  // Debounced search for Features
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (selectedApp.newFeature && selectedApp.newFeature.length >= 2) {
        try {
          const results = await searchFeatures(selectedApp.newFeature);
          // Filter out features already added - ensure results is array before filtering
          const items = Array.isArray(results) ? results : [];
          const available = items.filter(f => !selectedApp.features.includes(f));
          setFeatureSuggestions(available);
        } catch (e) {
          console.error(e);
          setFeatureSuggestions([]);
        }
      } else {
        setFeatureSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedApp.newFeature, selectedApp.features]);

  // Debounced search for Integrations
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (selectedApp.newIntegration && selectedApp.newIntegration.length >= 2) {
        try {
          const results = await searchIntegrations(selectedApp.newIntegration);
          // Filter out integrations already added - ensure results is array before filtering
          const items = Array.isArray(results) ? results : [];
          const available = items.filter(i => !selectedApp.integrations.includes(i));
          setIntegrationSuggestions(available);
        } catch (e) {
          console.error(e);
          setIntegrationSuggestions([]);
        }
      } else {
        setIntegrationSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedApp.newIntegration, selectedApp.integrations]);

  // Debounced search for Aggregators
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const results = await searchAggregators(aggregatorSearch);
        // If results from DB are zero and search is empty, show defaults
        if (results.length === 0 && !aggregatorSearch) {
          setFilteredAggregators(DEFAULT_AGGREGATORS);
        } else {
          setFilteredAggregators(results);
        }
      } catch (e) {
        console.error(e);
        if (!aggregatorSearch) setFilteredAggregators(DEFAULT_AGGREGATORS);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [aggregatorSearch]);

  const toggleAggregatorCompatibility = (optId: string) => {
    updateAppData(app => ({
      ...app,
      aggregatorCompatibility: app.aggregatorCompatibility.includes(optId)
        ? app.aggregatorCompatibility.filter(id => id !== optId)
        : [...app.aggregatorCompatibility, optId]
    }));
  };

  const toggleAggregatorSelection = (agg: string) => {
    updateAppData(app => ({
      ...app,
      selectedAggregators: app.selectedAggregators.includes(agg)
        ? app.selectedAggregators.filter(a => a !== agg)
        : [...app.selectedAggregators, agg]
    }));
  };
  const handleAddPricingPackage = () => {
    updateAppData(app => ({
      ...app,
      pricingPackages: [
        ...app.pricingPackages,
        { id: `pkg-${Date.now()}`, name: '', price: '', subtext: '', features: [''] }
      ]
    }));
  };

  const removePackage = (pkgId: string) => {
    updateAppData(app => ({
      ...app,
      pricingPackages: app.pricingPackages.filter(p => p.id !== pkgId)
    }));
  };

  const updatePackage = (pkgId: string, updates: Partial<ApplicationData['pricingPackages'][0]>) => {
    updateAppData(app => ({
      ...app,
      pricingPackages: app.pricingPackages.map(p => p.id === pkgId ? { ...p, ...updates } : p)
    }));
  };


  const handleAddApplication = () => {
    const newId = `app-${Date.now()}`;
    setApplications(prev => [...prev, buildInitialAppData(newId, prev.length)]);
    setSelectedAppId(newId);
  };

  const handleRemoveApplication = (id: string) => {
    if (applications.length > 1) {
      const nextApps = applications.filter(a => a.id !== id);
      setApplications(nextApps);
      if (selectedAppId === id) setSelectedAppId(nextApps[0].id);
    }
  };

  const validateStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/.+/i;

    if (!profile.companyName || !profile.website || !profile.referralSource || !profile.firstName || !profile.lastName || !profile.email) {
      toast({ title: "Validation Error", description: 'Please fill in all required fields in the Public Partner Profile section.', variant: "destructive" });
      return false;
    }

    if (!emailRegex.test(profile.email)) {
      toast({ title: "Validation Error", description: 'Please enter a valid email address.', variant: "destructive" });
      return false;
    }
    if (!urlRegex.test(profile.website)) {
      toast({ title: "Validation Error", description: 'Please enter a valid website URL starting with http:// or https://', variant: "destructive" });
      return false;
    }
    // Phone is optional now
    if (profile.phone) {
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      if (!phoneRegex.test(profile.phone)) {
        toast({ title: "Validation Error", description: 'Please enter a valid phone number (min 10 digits).', variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const validateStep2 = () => {
    const urlRegex = /^https?:\/\/.+/i;

    for (const app of applications) {
      if (!app.type || !app.name || !app.description) {
        toast({ title: "Validation Error", description: `Please fill in all required fields for "${app.name || 'Application'}": Type, Name, and Description.`, variant: "destructive" });
        return false;
      }
      if (app.website && !urlRegex.test(app.website)) {
        toast({ title: "Validation Error", description: `Please enter a valid URL for "${app.name}".`, variant: "destructive" });
        return false;
      }
      if (app.teamSize.length === 0 || app.revenue.length === 0 || !app.budgetAmount || app.brokerType.length === 0) {
        toast({ title: "Validation Error", description: `Please complete the Product Market Fit section for "${app.name}". All fields (Team Size, Revenue, Budget, and Broker Type) are required.`, variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const checkCompanyExists = async (email: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('company')
      .select('id')
      .eq('contact_email', email)
      .single();
    return !!data;
  };

  const uploadLogo = async (file: File, companyName: string) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const sanitizedName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${sanitizedName}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('CompanyBrand Logos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('CompanyBrand Logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const uploadProductImage = async (file: File, productName: string) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const sanitizedName = productName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${sanitizedName}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleNext = async () => {
    if (!validateStep1()) return;

    setIsSubmitting(true);
    try {
      const exists = await checkCompanyExists(profile.email);
      if (exists) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please login to the portal to continue your application.",
          variant: "destructive"
        });
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      // 1. Check again just in case (optional, but safe)
      const exists = await checkCompanyExists(profile.email);
      if (exists) {
        toast({ title: "Account Exists", description: "An account with this email already exists.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      // 2. Upload Logo if exists
      let logoUrl = profile.logo;
      if (profile.logoFile) {
        logoUrl = await uploadLogo(profile.logoFile, profile.companyName);
      }

      // 3. Create Company
      const { data: companyData, error: companyError } = await supabase
        .from('company')
        .insert({
          company_name: profile.companyName,
          company_website: profile.website,
          contact_email: profile.email,
          contact_first_name: profile.firstName,
          contact_last_name: profile.lastName,
          contact_phone: profile.phone,
          logo: logoUrl
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // 4. Create Partner Application(s)
      const inserts = await Promise.all(applications.map(async app => {
        let appProductImage = app.productImage;
        if (app.productImageFile) {
          appProductImage = await uploadProductImage(app.productImageFile, app.name);
        }

        return {
          company_id: companyData.id,
          company_name: profile.companyName,
          website: profile.website,
          contact_name: `${profile.firstName} ${profile.lastName}`.trim(),
          email: profile.email,
          phone: profile.phone,
          heard_about_us: profile.referralSource, // Mapped
          referral_name: profile.referralName,

          // Application specific
          business_type: app.type,
          business_type_other: app.typeOther,
          tagline: app.tagline,
          description: app.description,
          pricing: app.pricingStructure,
          pricing_offer: app.pricingPackages, // Map to new column
          pricing_details: app.pricingDetails,
          special_offer: app.specialOffer,

          features: app.features,
          integrations: app.integrations,
          is_training_public: app.wantsTraining,

          // Aggregator Compatibility
          aggregator_compatibility: app.aggregatorCompatibility,
          integration_docs_link: app.integrationDocsLink,
          selected_aggregators: app.selectedAggregators,
          integration_notes: app.integrationNotes,

          team_size: app.teamSize,
          revenue: app.revenue,
          broker_types: app.brokerType,
          broker_type_other: app.brokerTypeOther,
          commercial_finance_subcategories: app.commercialSubtypes,
          commercial_finance_other: app.commercialTypeOther,

          budget_amount: app.budgetAmount,
          budget_period: app.budgetPeriod,

          looking_to: app.lookingTo,
          looking_to_other: app.lookingToOther,
          not_fit_for: app.notFitFor,

          materials: {
            logo: logoUrl, // Use the uploaded URL
            product_image: appProductImage
          },

          status: 'pending'
        };
      }));

      const { error: appError } = await supabase.from('partner_application').insert(inserts);

      if (appError) throw appError;

      toast({ title: "Application Submitted", description: 'Your partner application has been submitted for review! Our team will contact you shortly.' });
      router.push('/');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error.message || 'There was an error submitting your application. Please try again.',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (field: 'logo' | 'productImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (field === 'logo') {
      setProfile(prev => ({ ...prev, logo: url, logoFile: file }));
    } else {
      updateAppData(app => ({ ...app, productImage: url, productImageFile: file }));
    }
  };

  const toggleBrokerType = (val: string) => {
    updateAppData(app => ({
      ...app,
      brokerType: app.brokerType.includes(val) ? app.brokerType.filter(v => v !== val) : [...app.brokerType, val]
    }));
  };

  const toggleCommSubtype = (val: string) => {
    updateAppData(app => ({
      ...app,
      commercialSubtypes: app.commercialSubtypes.includes(val) ? app.commercialSubtypes.filter(v => v !== val) : [...app.commercialSubtypes, val]
    }));
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-20 font-body">
      <div className="bg-brand-blue text-white py-12 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Apply as a Partner</h1>
            <p className="text-gray-300">Got a product or service made for Brokers in the Mortgage, Asset & Commercial Finance industry? <br /> Apply to partner with us for free!</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.back()} className="px-6 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 font-bold transition-all">
              Cancel
            </button>
            {step === 2 && (
              <button onClick={handleSubmit} className="px-8 py-2.5 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 font-bold shadow-lg shadow-brand-green/20 transition-all flex items-center gap-2">
                <Save size={18} /> Submit
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 space-y-8">

        {/* 1. Public Partner Profile */}
        <section className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl">
                <Building2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-brand-orange">Public Partner Profile</h2>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-shrink-0">
                <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Building2 size={14} className="text-gray-400" /> Company Logo
                </label>
                <div className="relative group w-32 h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden hover:border-brand-blue/40 transition-colors cursor-pointer">
                  {profile.logo ? (
                    <img src={profile.logo} className="w-full h-full object-contain p-4" alt="Company Logo" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload size={24} className="text-gray-400 mx-auto mb-1" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Upload</span>
                    </div>
                  )}
                  <input type="file" onChange={(e) => handleFileUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <Building2 size={14} className="text-gray-400" /> Company Name<RequiredAsterisk />
                  </label>
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={e => setProfile({ ...profile, companyName: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                    placeholder="e.g. Acme Finance"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <Globe size={14} className="text-gray-400" /> Company Website<RequiredAsterisk />
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="url"
                      value={profile.website}
                      onChange={e => setProfile({ ...profile, website: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <Users size={14} className="text-gray-400" /> How did you hear about us?<RequiredAsterisk />
                  </label>
                  <select
                    value={profile.referralSource}
                    onChange={e => setProfile({ ...profile, referralSource: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none font-medium"
                  >
                    <option value="">Select source...</option>
                    {REFERRAL_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                {profile.referralSource === 'friend_referral' && (
                  <div className="space-y-1 animate-in slide-in-from-left-2">
                    <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                      <User size={14} className="text-gray-400" /> Referral Name
                    </label>
                    <input
                      type="text"
                      value={profile.referralName}
                      onChange={e => setProfile({ ...profile, referralName: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                      placeholder="Who referred you?"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Contact Person</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <User size={14} className="text-gray-400" /> First Name<RequiredAsterisk />
                  </label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <User size={14} className="text-gray-400" /> Last Name<RequiredAsterisk />
                  </label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <Mail size={14} className="text-gray-400" /> Email<RequiredAsterisk />
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <Phone size={14} className="text-gray-400" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          {step === 1 && (
            <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-brand-blue text-white hover:bg-brand-blue/90 font-bold shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Checking...
                  </>
                ) : (
                  <>
                    Next Step <ChevronRight size={18} />
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {
          step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
              {/* 2. Application Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="text-brand-blue" size={20} />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Applications</h2>
                      <p className="text-sm text-gray-500">You can submit multiple products or services in one application.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddApplication}
                    className="px-5 py-2.5 rounded-xl border-2 border-dashed border-brand-blue text-brand-orange hover:border-brand-green hover:text-brand-blue font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <Plus size={18} /> Add Another Product/Service
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {applications.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedAppId(app.id)}
                      className={`px-5 py-3 rounded-2xl border flex-shrink-0 transition-all text-left min-w-[180px] group relative ${selectedAppId === app.id
                        ? 'bg-brand-green text-white border-brand-green shadow-xl shadow-gray-200'
                        : 'bg-white text-brand-blue border-gray-200 hover:border-brand-blue'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold truncate max-w-[120px]">{app.name || 'Untitled'}</span>
                        {applications.length > 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveApplication(app.id); }}
                            className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <p className={`text-[10px] mt-1 uppercase tracking-wider font-bold ${selectedAppId === app.id ? 'text-green-100' : 'text-gray-400'}`}>
                        {app.type}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in duration-300">
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                          <Tag size={14} className="text-gray-400" /> Selected Offering
                        </label>
                        <input
                          value={selectedApp.name}
                          onChange={e => updateAppData(app => ({ ...app, name: e.target.value }))}
                          className="text-2xl font-bold text-gray-900 border-none p-0 focus:ring-0 w-full"
                          placeholder="Offering Name..."
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase mr-2">This is a:<RequiredAsterisk /></span>
                        {(['Software', 'Service', 'Product', 'Other'] as ProductType[]).map(t => (
                          <button
                            key={t}
                            onClick={() => updateAppData(app => ({ ...app, type: t }))}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedApp.type === t ? 'bg-brand-green text-white border-brand-green shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-white'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    {selectedApp.type === 'Other' && (
                      <input
                        className="mt-4 w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm animate-in slide-in-from-top-2 text-gray-900"
                        placeholder="Specify offering type..."
                        value={selectedApp.typeOther}
                        onChange={e => updateAppData(app => ({ ...app, typeOther: e.target.value }))}
                      />
                    )}
                  </div>

                  <div className="p-8 space-y-12">
                    {/* Basic Information */}
                    <section>
                      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Type size={18} /></div>
                        <h3 className="text-lg font-bold text-brand-orange">Basic Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Product/Service Image</label>
                            <div className="relative group w-full aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden hover:border-brand-blue transition-colors cursor-pointer">
                              {selectedApp.productImage ? (
                                <img src={selectedApp.productImage} className="w-full h-full object-cover" alt="Product" />
                              ) : (
                                <div className="text-center p-4">
                                  <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Media</span>
                                </div>
                              )}
                              <input type="file" onChange={(e) => handleFileUpload('productImage', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-5">
                          <label className="block">
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Tag size={14} className="text-gray-400" /> Product/Service Name<RequiredAsterisk /></span>
                            <input
                              type="text"
                              value={selectedApp.name}
                              onChange={e => updateAppData(app => ({ ...app, name: e.target.value }))}
                              placeholder="e.g. Primary Offering"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-400 rounded-xl text-sm focus:border-brand-blue outline-none font-bold"
                            />
                          </label>
                          <label className="block">
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><AlignLeft size={14} className="text-gray-400" /> Description<RequiredAsterisk /></span>
                            <textarea
                              rows={3}
                              value={selectedApp.description}
                              onChange={e => updateAppData(app => ({ ...app, description: e.target.value }))}
                              placeholder="Tell us what makes this offering special..."
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-xl text-sm focus:border-brand-blue outline-none resize-none transition-all"
                            />
                          </label>
                          <label className="block animate-in slide-in-from-top-2">
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Type size={14} className="text-gray-400" /> Offering Tagline</span>
                            <input
                              type="text"
                              value={selectedApp.tagline}
                              onChange={e => updateAppData(app => ({ ...app, tagline: e.target.value }))}
                              placeholder="e.g. Streamline your mortgage workflow"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-400 rounded-xl text-sm focus:border-brand-blue outline-none italic"
                            />
                          </label>
                        </div>
                      </div>
                    </section>

                    {/* PRICING SECTION */}
                    <section>
                      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><DollarSign size={18} /></div>
                          <h3 className="text-lg font-bold text-brand-orange">Pricing Configuration</h3>
                        </div>
                        <button
                          onClick={handleAddPricingPackage}
                          className="px-5 py-2.5 bg-brand-green text-brand-blue rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
                        >
                          <Plus size={14} /> Add Another Pricing Offer
                        </button>
                      </div>
                      <div className="space-y-8">
                        <label className="block max-w-sm">
                          <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Tag size={14} className="text-gray-400" /> Overall Pricing Structure<RequiredAsterisk /></span>
                          <div className="relative">
                            <select
                              value={selectedApp.pricingStructure}
                              onChange={e => updateAppData(app => ({ ...app, pricingStructure: e.target.value }))}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-400 rounded-xl text-sm focus:border-brand-blue outline-none appearance-none font-semibold cursor-pointer"
                            >
                              {PRICING_STRUCTURE_OPTIONS.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                          </div>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {selectedApp.pricingPackages.map((pkg, idx) => (
                            <div key={pkg.id} className="bg-white border border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative group flex flex-col h-full">
                              {selectedApp.pricingPackages.length > 1 && (
                                <button
                                  onClick={() => removePackage(pkg.id)}
                                  className="absolute -top-2 -right-2 bg-white border border-gray-100 p-2 rounded-full text-red-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-50"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                              <div className="space-y-5 flex-grow">
                                <div className="space-y-1.5">
                                  <label className="text-[12px] font-black text-brand-blue ml-1">Package Name</label>
                                  <input
                                    placeholder="e.g. Free or Unlimited"
                                    value={pkg.name}
                                    onChange={e => updatePackage(pkg.id, { name: e.target.value })}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                                  />
                                </div>
                                <div className="flex gap-4">
                                  <div className="flex-1 space-y-1.5">
                                    <label className="text-[12px] font-black text-brand-blue ml-1">Amount</label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                                      <input
                                        placeholder="0.00"
                                        value={pkg.price}
                                        onChange={e => updatePackage(pkg.id, { price: e.target.value })}
                                        className="w-full pl-7 pr-2 py-2 bg-gray-50 border border-gray-400 rounded-lg focus:border-brand-blue focus:bg-white text-sm font-black outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 space-y-1.5 relative">
                                    <div className="flex items-center gap-1 ml-1 group/tip">
                                      <label className="text-[12px] font-black text-brand-blue">CTA Text</label>
                                      <Info size={10} className="text-gray-300 cursor-help" />
                                      <div className="absolute bottom-full left-0 mb-1 hidden group-hover/tip:block w-40 p-2 bg-gray-900 text-white text-[9px] rounded shadow-xl z-20 font-bold leading-tight">
                                        The call to action button text
                                      </div>
                                    </div>
                                    <input
                                      placeholder="Try [Product Name]. It's Free"
                                      value={pkg.subtext}
                                      onChange={e => updatePackage(pkg.id, { subtext: e.target.value })}
                                      className="w-full p-2 bg-gray-50 border border-gray-400 rounded-lg focus:border-brand-blue focus:bg-white text-[10px] font-bold outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2 pt-2 border-t border-gray-50">
                                  <p className="text-[12px] font-black text-brand-blue ml-1">Included Offers</p>
                                  {pkg.features.map((feat, fIdx) => (
                                    <div key={fIdx} className="flex gap-2 animate-in slide-in-from-left-1">
                                      <input
                                        value={feat}
                                        onChange={e => {
                                          const nextFeats = [...pkg.features];
                                          nextFeats[fIdx] = e.target.value;
                                          updatePackage(pkg.id, { features: nextFeats });
                                        }}
                                        className="flex-1 p-2 bg-gray-50 border border-gray-400 focus:border-brand-blue focus:bg-white text-xs font-medium outline-none rounded-lg"
                                        placeholder="e.g. 100mb storage"
                                      />
                                      <button
                                        onClick={() => {
                                          const nextFeats = pkg.features.filter((_, i) => i !== fIdx);
                                          updatePackage(pkg.id, { features: nextFeats });
                                        }}
                                        className="text-gray-300 hover:text-red-500 p-1"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => updatePackage(pkg.id, { features: [...pkg.features, ''] })}
                                    className="w-full py-2 border-2 border-dashed border-gray-400 rounded-xl text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
                                  >
                                    <Plus size={12} /> Add Feature to Card
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Product Highlights Section */}
                    <section>
                      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Puzzle size={18} /></div>
                        <h3 className="text-lg font-bold text-brand-orange">Product Highlights</h3>
                      </div>

                      {/* Aggregator Compatibility Section */}
                      <div className="mb-12 bg-slate-50/50 rounded-2xl border border-slate-100 p-8 space-y-8 animate-in slide-in-from-top-2">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <RefreshCcw className="text-gray-500" size={18} />
                            <h4 className="text-sm font-bold text-brand-blue uppercase">Aggregator Compatibility</h4>
                          </div>
                          <p className="text-xs text-gray-500 mb-4">Select all that apply. How can brokers connect their aggregator software to your offering?</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {AGGREGATOR_COMPATIBILITY_OPTIONS.map(opt => (
                              <button
                                key={opt.id}
                                onClick={() => toggleAggregatorCompatibility(opt.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-left text-xs font-bold transition-all ${selectedApp.aggregatorCompatibility.includes(opt.id)
                                  ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue'
                                  }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${selectedApp.aggregatorCompatibility.includes(opt.id) ? 'bg-white border-white' : 'bg-white border-gray-300'
                                  }`}>
                                  {selectedApp.aggregatorCompatibility.includes(opt.id) && <Check size={12} className="text-brand-blue" strokeWidth={3} />}
                                </div>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {hasTechnicalIntegration && (
                          <div className="animate-in slide-in-from-top-2">
                            <label className="block">
                              <span className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2 italic">
                                <LinkIcon size={14} className="text-brand-blue" /> Link to integration documentation
                              </span>
                              <input
                                type="url"
                                value={selectedApp.integrationDocsLink}
                                onChange={e => updateAppData(app => ({ ...app, integrationDocsLink: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-blue outline-none"
                                placeholder="https://docs.yoursite.com/api"
                              />
                            </label>
                          </div>
                        )}

                        {hasDirectIntegration && (
                          <div className="animate-in slide-in-from-top-2 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">Select Compatible Aggregators</span>
                              <div className="relative flex-1 max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input
                                  type="text"
                                  placeholder="Search aggregators..."
                                  value={aggregatorSearch}
                                  onChange={e => setAggregatorSearch(e.target.value)}
                                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-brand-blue"
                                />
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-4 bg-white border border-gray-100 rounded-xl no-scrollbar">
                              {filteredAggregators.map(agg => (
                                <button
                                  key={agg}
                                  onClick={() => toggleAggregatorSelection(agg)}
                                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase transition-all ${selectedApp.selectedAggregators.includes(agg)
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200'
                                    }`}
                                >
                                  {agg}
                                  {selectedApp.selectedAggregators.includes(agg) && <Check size={10} className="inline ml-1" />}
                                </button>
                              ))}
                              {filteredAggregators.length === 0 && <p className="text-[10px] text-slate-300 italic mx-auto">No aggregators found matching search.</p>}
                            </div>
                          </div>
                        )}

                        {showIntegrationNotes && (
                          <div className="animate-in slide-in-from-top-2">
                            <label className="block">
                              <span className="text-xs font-bold text-gray-700 mb-2 block uppercase tracking-tight">Any further notes or limitations</span>
                              <textarea
                                rows={2}
                                value={selectedApp.integrationNotes}
                                onChange={e => updateAppData(app => ({ ...app, integrationNotes: e.target.value }))}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-blue outline-none resize-none"
                                placeholder="e.g. Only compatible with certain LMG tiers, or requiere Enterprise API plan..."
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Check size={16} className="text-green-500" /> Key Features
                            </h4>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedApp.features.length >= 9 ? 'text-orange-500' : 'text-gray-400'}`}>
                              {selectedApp.features.length} / 9 Limit
                            </span>
                          </div>
                          <div className="space-y-2 mb-4">
                            {selectedApp.features.map((f, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                <span className="text-sm text-gray-700">{f}</span>
                                <button onClick={() => updateAppData(app => ({ ...app, features: app.features.filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          {selectedApp.features.length < 9 ? (
                            <div className="flex gap-2 animate-in fade-in duration-300">
                              <input
                                type="text"
                                placeholder="Add feature..."
                                value={selectedApp.newFeature}
                                onChange={e => updateAppData(app => ({ ...app, newFeature: e.target.value }))}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (selectedApp.newFeature.trim()) {
                                      updateAppData(app => ({ ...app, features: [...app.features, selectedApp.newFeature.trim()], newFeature: '' }));
                                    }
                                  }
                                }}
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-gray-500 outline-none"
                              />
                              <button
                                onClick={() => {
                                  if (selectedApp.newFeature.trim()) {
                                    updateAppData(app => ({ ...app, features: [...app.features, selectedApp.newFeature.trim()], newFeature: '' }));
                                  }
                                }}
                                className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                              >
                                <Plus size={20} />
                              </button>
                            </div>
                          ) : (
                            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-600 text-xs font-bold flex items-center justify-center gap-2">
                              <AlertCircle size={14} /> Maximum of 9 features reached.
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              <Puzzle size={16} className="text-blue-500" /> Key Integrations
                            </h4>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${selectedApp.integrations.length >= 9 ? 'text-orange-500' : 'text-gray-400'}`}>
                              {selectedApp.integrations.length} / 9 Limit
                            </span>
                          </div>
                          <div className="space-y-2 mb-4">
                            {selectedApp.integrations.map((n, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                <span className="text-sm text-gray-700">{n}</span>
                                <button onClick={() => updateAppData(app => ({ ...app, integrations: app.integrations.filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          {selectedApp.integrations.length < 9 ? (
                            <div className="flex gap-2 animate-in fade-in duration-300">
                              <input
                                type="text"
                                placeholder="Add integration..."
                                value={selectedApp.newIntegration}
                                onChange={e => updateAppData(app => ({ ...app, newIntegration: e.target.value }))}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (selectedApp.newIntegration.trim()) {
                                      updateAppData(app => ({ ...app, integrations: [...app.integrations, selectedApp.newIntegration.trim()], newIntegration: '' }));
                                    }
                                  }
                                }}
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-blue outline-none"
                              />
                              <button
                                onClick={() => {
                                  if (selectedApp.newIntegration.trim()) {
                                    updateAppData(app => ({ ...app, integrations: [...app.integrations, selectedApp.newIntegration.trim()], newIntegration: '' }));
                                  }
                                }}
                                className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                              >
                                <Plus size={20} />
                              </button>
                            </div>
                          ) : (
                            <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-600 text-xs font-bold flex items-center justify-center gap-2">
                              <AlertCircle size={14} /> Maximum of 9 integrations reached.
                            </div>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* Product Market Fit Section */}
                    <section>
                      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Target size={18} /></div>
                        <h3 className="text-lg font-bold text-brand-orange">Product Market Fit</h3>
                      </div>
                      <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                              <Users size={14} className="text-gray-400" /> Best suited for: Team Size (select all that apply)<RequiredAsterisk />
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {TEAM_SIZE_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => updateAppData(app => ({
                                    ...app,
                                    teamSize: app.teamSize.includes(opt.value) ? app.teamSize.filter(v => v !== opt.value) : [...app.teamSize, opt.value]
                                  }))}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedApp.teamSize.includes(opt.value) ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-gray-600 border-gray-400 hover:border-gray-500'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                              <DollarSign size={14} className="text-gray-400" /> Ideal Customer Revenue (select all that apply)<RequiredAsterisk />
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {REVENUE_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => updateAppData(app => ({
                                    ...app,
                                    revenue: app.revenue.includes(opt.value) ? app.revenue.filter(v => v !== opt.value) : [...app.revenue, opt.value]
                                  }))}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedApp.revenue.includes(opt.value) ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-gray-600 border-gray-400 hover:border-gray-500'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                              <DollarSign size={14} className="text-gray-400" /> Ideal Budget
                            </label>
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><DollarSign size={14} /></div>
                                <input
                                  type="number"
                                  value={selectedApp.budgetAmount}
                                  onChange={e => updateAppData(app => ({ ...app, budgetAmount: e.target.value }))}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-400 rounded-xl text-sm text-gray-900 focus:border-brand-blue outline-none"
                                  placeholder="Amount"
                                />
                              </div>
                              <select
                                value={selectedApp.budgetPeriod}
                                onChange={e => updateAppData(app => ({ ...app, budgetPeriod: e.target.value as any }))}
                                className="w-32 px-4 py-3 bg-gray-50 border border-gray-400 rounded-xl text-sm font-bold text-gray-900 focus:border-brand-blue outline-none"
                              >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="project">Project</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                              <Briefcase size={14} className="text-gray-400" /> Broker Type (select all that apply)<RequiredAsterisk />
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {BROKER_TYPE_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => toggleBrokerType(opt.value)}
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedApp.brokerType.includes(opt.value) ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-gray-600 border-gray-400 hover:border-gray-500'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            {selectedApp.brokerType.includes('other') && (
                              <input
                                className="mt-3 w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm animate-in slide-in-from-top-2 text-gray-900"
                                placeholder="Specify other broker type..."
                                value={selectedApp.brokerTypeOther}
                                onChange={e => updateAppData(app => ({ ...app, brokerTypeOther: e.target.value }))}
                              />
                            )}
                          </div>
                        </div>

                        {selectedApp.brokerType.includes('commercial') && (
                          <div className="animate-in slide-in-from-top-2 p-6 bg-brand-blue/5 rounded-2xl border border-blue-100">
                            <label className="text-sm font-bold text-brand-blue flex items-center gap-2 mb-4">
                              <Check size={14} /> Commercial Subcategories
                            </label>
                            <div className="flex flex-wrap gap-3">
                              {COMMERCIAL_SUBTYPES.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => toggleCommSubtype(opt.value)}
                                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedApp.commercialSubtypes.includes(opt.value) ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-brand-blue border-blue-200 hover:bg-blue-100'}`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            {selectedApp.commercialSubtypes.includes('other') && (
                              <input
                                className="mt-4 w-full p-3 bg-white border border-blue-200 rounded-xl text-sm animate-in slide-in-from-top-2 text-brand-blue placeholder:text-blue-300"
                                placeholder="Specify commercial type..."
                                value={selectedApp.commercialTypeOther}
                                onChange={e => updateAppData(app => ({ ...app, commercialTypeOther: e.target.value }))}
                              />
                            )}
                          </div>
                        )}

                        <div>
                          <label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                            <Target size={14} className="text-gray-400" /> Looking to:
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {LOOKING_TO_OPTIONS.map(opt => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => updateAppData(app => ({
                                  ...app,
                                  lookingTo: app.lookingTo.includes(opt.value) ? app.lookingTo.filter(v => v !== opt.value) : [...app.lookingTo, opt.value]
                                }))}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${selectedApp.lookingTo.includes(opt.value) ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-gray-600 border-gray-400 hover:border-gray-500'}`}
                              >
                                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${selectedApp.lookingTo.includes(opt.value) ? 'bg-white border-white' : 'bg-white border-gray-400'}`}>
                                  {selectedApp.lookingTo.includes(opt.value) && <Check size={10} className="text-brand-blue" />}
                                </div>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          {selectedApp.lookingTo.includes('other') && (
                            <input
                              className="mt-3 w-full p-3 bg-gray-50 border border-gray-400 rounded-xl text-sm animate-in slide-in-from-top-2 text-gray-900"
                              placeholder="Specify other goals..."
                              value={selectedApp.lookingToOther}
                              onChange={e => updateAppData(app => ({ ...app, lookingToOther: e.target.value }))}
                            />
                          )}
                        </div>

                        <label className="block">
                          <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <AlertCircle size={14} className="text-gray-400" /> Not the right fit for:
                          </span>
                          <textarea
                            rows={2}
                            value={selectedApp.notFitFor}
                            onChange={e => updateAppData(app => ({ ...app, notFitFor: e.target.value }))}
                            placeholder="e.g. Solo brokers on a tight budget..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-400 rounded-xl text-sm focus:border-brand-blue outline-none resize-none transition-all text-gray-900"
                          />
                        </label>
                      </div>
                    </section>

                    {/* Training Material Section (LOCKED) */}
                    <section>
                      {/* Header - same style as others */}
                      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Video size={18} /></div>
                        <h3 className="text-lg font-bold text-brand-orange">Training Material</h3>
                      </div>

                      {/* Orange dashed border container for Training Material */}
                      <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-brand-orange bg-brand-orange/5 min-h-[450px]">
                        {/* Blur Overlay & Content */}
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8 xs:p-12 overflow-y-auto">
                          <div className="w-16 h-16 bg-brand-blue text-white rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-white flex-shrink-0">
                            <Lock size={28} />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-2">Paid Premium Feature</h4>
                          <p className="text-sm text-gray-600 max-w-sm mb-6">
                            Showcase your expertise with videos, guides, and interactive training content directly on your public profile.
                          </p>
                          <label className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-400 rounded-2xl shadow-sm hover:border-brand-blue transition-all cursor-pointer flex-shrink-0">
                            <input
                              type="checkbox"
                              className="w-5 h-5 rounded border-gray-400 text-brand-blue focus:ring-brand-blue cursor-pointer"
                              checked={selectedApp.wantsTraining}
                              onChange={e => updateAppData(app => ({ ...app, wantsTraining: e.target.checked }))}
                            />
                            <span className="text-sm font-bold text-gray-800">
                              Interested in uploading Training Material?
                            </span>
                          </label>
                          {selectedApp.wantsTraining && (
                            <p className="mt-4 text-xs font-bold text-brand-blue animate-in slide-in-from-top-2 flex-shrink-0">
                              Check noted! Our team will discuss the options available to you.
                            </p>
                          )}
                        </div>

                        {/* Mock Blurred UI Content */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-none select-none opacity-40 h-full">
                          {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-video bg-gray-100 rounded-xl border border-gray-300 flex flex-col items-center justify-center p-4">
                              <div className="p-3 bg-white rounded-lg mb-2"><Video size={20} className="text-gray-300" /></div>
                              <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </section>

              {/* 3. Final Details */}
              <section className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                      <AlignLeft size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Final Details</h2>
                  </div>
                </div>
                <div className="p-8">
                  <label className="block">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-3">
                      <AlignLeft size={14} className="text-gray-400" /> Any other questions or notes?
                    </span>
                    <textarea
                      rows={4}
                      value={finalNotes}
                      onChange={e => setFinalNotes(e.target.value)}
                      placeholder="Is there anything else we should know about your application?"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-400 rounded-2xl text-sm focus:border-brand-blue outline-none resize-none transition-all text-gray-900"
                    />
                  </label>
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex items-start gap-4 max-w-2xl text-center bg-brand-blue/5 p-6 rounded-2xl border border-brand-blue/10 mb-4">
                  <AlertCircle size={20} className="text-brand-blue mt-1 flex-shrink-0 mx-auto" />
                  <p className="text-sm text-brand-blue leading-relaxed font-medium">
                    By submitting, you agree to our <span className="font-bold underline cursor-pointer">Partner Terms</span>. Our team will review your application and offerings to ensure they meet our quality standards.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full max-w-xl py-5 rounded-2xl font-bold text-lg text-white shadow-2xl transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-brand-blue via-brand-blue to-[#132847] hover:scale-[1.02] hover:shadow-brand-blue/20'}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing Application...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} />
                      Submit
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                  <Lock size={12} /> Secure encrypted transmission
                </p>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};
