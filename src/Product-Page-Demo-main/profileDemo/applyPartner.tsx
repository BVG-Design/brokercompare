import React, { useMemo, useState } from 'react';
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
  Sparkles,
  Info,
  Briefcase
} from 'lucide-react';

interface ApplyPartnerProps {
  onBack: () => void;
  isLoggedIn: boolean;
}

type ProductType = 'Software' | 'Service' | 'Product' | 'Other';

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

type ApplicationData = {
  id: string;
  name: string;
  type: ProductType;
  typeOther: string;
  productImage: string;
  tagline: string;
  description: string;
  website: string;
  pricingStructure: string;
  specialOffer: string;
  pricingDetails: string;
  features: string[];
  newFeature: string;
  integrations: string[];
  newIntegration: string;
  teamSize: string[];
  revenue: string[];
  brokerType: string[];
  commercialSubtypes: string[];
  budgetAmount: string;
  budgetPeriod: 'monthly' | 'yearly' | 'project';
  lookingTo: string[];
  lookingToOther: string;
  notFitFor: string;
  wantsTraining: boolean;
};

const buildInitialAppData = (id: string, count: number): ApplicationData => ({
  id,
  name: count === 0 ? 'Primary Offering' : `Offering ${count + 1}`,
  type: 'Software',
  typeOther: '',
  productImage: '',
  tagline: '',
  description: '',
  website: '',
  pricingStructure: '',
  specialOffer: '',
  pricingDetails: '',
  features: [],
  newFeature: '',
  integrations: [],
  newIntegration: '',
  teamSize: [],
  revenue: [],
  brokerType: [],
  commercialSubtypes: [],
  budgetAmount: '',
  budgetPeriod: 'monthly',
  lookingTo: [],
  lookingToOther: '',
  notFitFor: '',
  wantsTraining: false,
});

const RequiredAsterisk = () => <span className="text-red-500 ml-0.5">*</span>;

const ApplyPartner: React.FC<ApplyPartnerProps> = ({ onBack, isLoggedIn }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profile, setProfile] = useState({
    logo: '',
    companyName: '',
    website: '',
    referralSource: '',
    referralName: '',
    firstName: isLoggedIn ? 'Katey' : '',
    lastName: isLoggedIn ? 'Shaw' : '',
    email: isLoggedIn ? 'katey.shaw@bearventuregroup.com' : '',
    phone: isLoggedIn ? '+1 (555) 000-0000' : '',
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

  const updateAppData = (updater: (data: ApplicationData) => ApplicationData) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === selectedAppId ? updater(app) : app))
    );
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

  const validate = () => {
    // Validate Profile
    if (!profile.companyName || !profile.website || !profile.referralSource || !profile.firstName || !profile.lastName || !profile.email || !profile.phone) {
      alert('Please fill in all required fields in the Public Partner Profile section.');
      return false;
    }

    // Validate Applications
    for (const app of applications) {
      if (!app.type || !app.name || !app.description) {
        alert(`Please fill in all required fields for "${app.name || 'Application'}": Type, Name, and Description.`);
        return false;
      }
      if (app.teamSize.length === 0 || app.revenue.length === 0 || !app.budgetAmount || app.brokerType.length === 0) {
        alert(`Please complete the Product Market Fit section for "${app.name}". All fields (Team Size, Revenue, Budget, and Broker Type) are required.`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Your partner application has been submitted for review! Our team will contact you shortly.');
      onBack();
    }, 1500);
  };

  const handleFileUpload = (field: 'logo' | 'productImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (field === 'logo') setProfile(prev => ({ ...prev, logo: url }));
    else updateAppData(app => ({ ...app, productImage: url }));
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
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="bg-[#0f172a] text-white py-12 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Apply as a Partner</h1>
            <p className="text-gray-400">Join our ecosystem of products and services made for Brokers in the Mortgage, Asset & Commercial Finance industry.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={onBack} className="px-6 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 font-semibold transition-all">
                Cancel
             </button>
             <button onClick={handleSubmit} className="px-8 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 font-bold shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2">
                <Save size={18} /> Submit Application
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 space-y-8">
        
        {/* 1. Public Partner Profile */}
        <section className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                    <Building2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Public Partner Profile</h2>
             </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-shrink-0">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Company Logo</label>
                    <div className="relative group w-32 h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-purple-400 transition-colors cursor-pointer">
                        {profile.logo ? (
                            <img src={profile.logo} className="w-full h-full object-contain p-4" alt="Company Logo" />
                        ) : (
                            <div className="text-center p-4">
                                <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Upload</span>
                            </div>
                        )}
                        <input type="file" onChange={(e) => handleFileUpload('logo', e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Company Name<RequiredAsterisk /></label>
                        <input 
                            type="text" 
                            value={profile.companyName}
                            onChange={e => setProfile({...profile, companyName: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                            placeholder="e.g. Acme Finance"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Company Website<RequiredAsterisk /></label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input 
                                type="url" 
                                value={profile.website}
                                onChange={e => setProfile({...profile, website: e.target.value})}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">How did you hear about us?<RequiredAsterisk /></label>
                        <select 
                            value={profile.referralSource}
                            onChange={e => setProfile({...profile, referralSource: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none font-medium"
                        >
                            <option value="">Select source...</option>
                            {REFERRAL_SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                    {profile.referralSource === 'friend_referral' && (
                        <div className="space-y-1 animate-in slide-in-from-left-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Referral Name</label>
                            <input 
                                type="text" 
                                value={profile.referralName}
                                onChange={e => setProfile({...profile, referralName: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                                placeholder="Who referred you?"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Contact Person</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">First Name<RequiredAsterisk /></label>
                        <input 
                            type="text" 
                            value={profile.firstName}
                            onChange={e => setProfile({...profile, firstName: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Last Name<RequiredAsterisk /></label>
                        <input 
                            type="text" 
                            value={profile.lastName}
                            onChange={e => setProfile({...profile, lastName: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email<RequiredAsterisk /></label>
                        <input 
                            type="email" 
                            value={profile.email}
                            onChange={e => setProfile({...profile, email: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Phone<RequiredAsterisk /></label>
                        <input 
                            type="tel" 
                            value={profile.phone}
                            onChange={e => setProfile({...profile, phone: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                        />
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* 2. Application Section */}
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layers className="text-[#132847]" size={20} />
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Applications</h2>
                        <p className="text-sm text-gray-500">You can submit multiple products or services in one application.</p>
                    </div>
                </div>
                <button 
                    onClick={handleAddApplication}
                    className="px-5 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 font-bold text-sm transition-all flex items-center gap-2"
                >
                    <Plus size={18} /> Add Another Product/Service
                </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {applications.map((app) => (
                    <button
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className={`px-5 py-3 rounded-2xl border flex-shrink-0 transition-all text-left min-w-[180px] group relative ${
                            selectedAppId === app.id
                                ? 'bg-[#132847] text-white border-[#132847] shadow-xl shadow-gray-200'
                                : 'bg-white text-gray-600 border-gray-100 hover:border-purple-200'
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
                        <p className={`text-[10px] mt-1 uppercase tracking-wider font-bold ${selectedAppId === app.id ? 'text-gray-300' : 'text-gray-400'}`}>
                            {app.type}
                        </p>
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in duration-300">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected Offering</label>
                            <input 
                                value={selectedApp.name}
                                onChange={e => updateAppData(app => ({...app, name: e.target.value}))}
                                className="text-2xl font-extrabold text-gray-900 border-none p-0 focus:ring-0 w-full"
                                placeholder="Offering Name..."
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase mr-2">This is a:<RequiredAsterisk /></span>
                            {(['Software', 'Service', 'Product', 'Other'] as ProductType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => updateAppData(app => ({...app, type: t}))}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedApp.type === t ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-white'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedApp.type === 'Other' && (
                        <input 
                            className="mt-4 w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm animate-in slide-in-from-top-2"
                            placeholder="Specify offering type..."
                            value={selectedApp.typeOther}
                            onChange={e => updateAppData(app => ({...app, typeOther: e.target.value}))}
                        />
                    )}
                </div>

                <div className="p-8 space-y-12">
                    {/* Basic Information Section */}
                    <section>
                        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Type size={18} /></div>
                            <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Product/Service Image</label>
                                    <div className="relative group w-full aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-purple-400 transition-colors cursor-pointer">
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
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Type size={14} className="text-gray-400" /> Tagline</span>
                                    <input 
                                        type="text" 
                                        value={selectedApp.tagline}
                                        onChange={e => updateAppData(app => ({...app, tagline: e.target.value}))}
                                        placeholder="e.g. Streamline your mortgage workflow"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Globe size={14} className="text-gray-400" /> Website Link</span>
                                    <input 
                                        type="url" 
                                        value={selectedApp.website}
                                        onChange={e => updateAppData(app => ({...app, website: e.target.value}))}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none"
                                    />
                                </label>
                            </div>
                            <div className="space-y-6">
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Tag size={14} className="text-gray-400" /> Product/Service Name<RequiredAsterisk /></span>
                                    <input 
                                        type="text" 
                                        value={selectedApp.name}
                                        onChange={e => updateAppData(app => ({...app, name: e.target.value}))}
                                        placeholder="e.g. Primary Offering"
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><AlignLeft size={14} className="text-gray-400" /> Description<RequiredAsterisk /></span>
                                    <textarea 
                                        rows={5}
                                        value={selectedApp.description}
                                        onChange={e => updateAppData(app => ({...app, description: e.target.value}))}
                                        placeholder="Tell us what makes this offering special..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none resize-none"
                                    />
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Tag size={14} className="text-gray-400" /> Pricing Structure</span>
                                        <input 
                                            type="text" 
                                            value={selectedApp.pricingStructure}
                                            onChange={e => updateAppData(app => ({...app, pricingStructure: e.target.value}))}
                                            placeholder="e.g. $99 /mo"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Sparkles size={14} className="text-orange-400" /> Special Offer</span>
                                        <input 
                                            type="text" 
                                            value={selectedApp.specialOffer}
                                            onChange={e => updateAppData(app => ({...app, specialOffer: e.target.value}))}
                                            placeholder="e.g. 10% off"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none"
                                        />
                                    </label>
                                </div>
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5"><Info size={14} className="text-gray-400" /> Pricing Details</span>
                                    <textarea 
                                        rows={2}
                                        value={selectedApp.pricingDetails}
                                        onChange={e => updateAppData(app => ({...app, pricingDetails: e.target.value}))}
                                        placeholder="Additional context on pricing..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none resize-none"
                                    />
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Product Highlights Section */}
                    <section>
                        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Puzzle size={18} /></div>
                            <h3 className="text-lg font-bold text-gray-900">Product Highlights</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Check size={16} className="text-green-500" /> Key Features
                                </h4>
                                <div className="space-y-2 mb-4">
                                    {selectedApp.features.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                            <span className="text-sm text-gray-700">{f}</span>
                                            <button onClick={() => updateAppData(app => ({...app, features: app.features.filter((_, idx) => idx !== i)}))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Add feature..."
                                        value={selectedApp.newFeature}
                                        onChange={e => updateAppData(app => ({...app, newFeature: e.target.value}))}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (selectedApp.newFeature.trim()) {
                                                    updateAppData(app => ({ ...app, features: [...app.features, app.newFeature.trim()], newFeature: '' }));
                                                }
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 outline-none"
                                    />
                                    <button 
                                        onClick={() => {
                                            if (selectedApp.newFeature.trim()) {
                                                updateAppData(app => ({ ...app, features: [...app.features, app.newFeature.trim()], newFeature: '' }));
                                            }
                                        }}
                                        className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Puzzle size={16} className="text-blue-500" /> Key Integrations
                                </h4>
                                <div className="space-y-2 mb-4">
                                    {selectedApp.integrations.map((n, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                            <span className="text-sm text-gray-700">{n}</span>
                                            <button onClick={() => updateAppData(app => ({...app, integrations: app.integrations.filter((_, idx) => idx !== i)}))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Add integration..."
                                        value={selectedApp.newIntegration}
                                        onChange={e => updateAppData(app => ({...app, newIntegration: e.target.value}))}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (selectedApp.newIntegration.trim()) {
                                                    updateAppData(app => ({ ...app, integrations: [...app.integrations, app.newIntegration.trim()], newIntegration: '' }));
                                                }
                                            }
                                        }}
                                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 outline-none"
                                    />
                                    <button 
                                        onClick={() => {
                                            if (selectedApp.newIntegration.trim()) {
                                                updateAppData(app => ({ ...app, integrations: [...app.integrations, app.newIntegration.trim()], newIntegration: '' }));
                                            }
                                        }}
                                        className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Product Market Fit Section */}
                    <section>
                        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Target size={18} /></div>
                            <h3 className="text-lg font-bold text-gray-900">Product Market Fit</h3>
                        </div>
                        <div className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1.5"><Users size={12} /> Best suited for: Team Size<RequiredAsterisk /></label>
                                    <div className="flex flex-wrap gap-2">
                                        {TEAM_SIZE_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => updateAppData(app => ({
                                                    ...app,
                                                    teamSize: app.teamSize.includes(opt.value) ? app.teamSize.filter(v => v !== opt.value) : [...app.teamSize, opt.value]
                                                }))}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedApp.teamSize.includes(opt.value) ? 'bg-[#132847] text-white border-[#132847] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1.5"><DollarSign size={12} /> Ideal Customer Revenue<RequiredAsterisk /></label>
                                    <div className="flex flex-wrap gap-2">
                                        {REVENUE_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => updateAppData(app => ({
                                                    ...app,
                                                    revenue: app.revenue.includes(opt.value) ? app.revenue.filter(v => v !== opt.value) : [...app.revenue, opt.value]
                                                }))}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedApp.revenue.includes(opt.value) ? 'bg-[#132847] text-white border-[#132847] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Ideal Budget<RequiredAsterisk /></label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><DollarSign size={14} /></div>
                                            <input 
                                                type="number"
                                                value={selectedApp.budgetAmount}
                                                onChange={e => updateAppData(app => ({...app, budgetAmount: e.target.value}))}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none" 
                                                placeholder="Amount"
                                            />
                                        </div>
                                        <select 
                                            value={selectedApp.budgetPeriod}
                                            onChange={e => updateAppData(app => ({...app, budgetPeriod: e.target.value as any}))}
                                            className="w-32 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:border-purple-500 outline-none"
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                            <option value="project">Project</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1.5"><Briefcase size={12} /> Broker Type<RequiredAsterisk /></label>
                                    <div className="flex flex-wrap gap-2">
                                        {BROKER_TYPE_OPTIONS.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => toggleBrokerType(opt.value)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selectedApp.brokerType.includes(opt.value) ? 'bg-[#132847] text-white border-[#132847] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {selectedApp.brokerType.includes('commercial') && (
                                <div className="animate-in slide-in-from-top-2 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                    <label className="block text-xs font-bold text-blue-900 uppercase mb-4 flex items-center gap-1.5">
                                        <Check size={12} /> Commercial Subcategories
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {COMMERCIAL_SUBTYPES.map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => toggleCommSubtype(opt.value)}
                                                className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedApp.commercialSubtypes.includes(opt.value) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-100'}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Looking to:</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {LOOKING_TO_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => updateAppData(app => ({
                                                ...app,
                                                lookingTo: app.lookingTo.includes(opt.value) ? app.lookingTo.filter(v => v !== opt.value) : [...app.lookingTo, opt.value]
                                            }))}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${selectedApp.lookingTo.includes(opt.value) ? 'bg-[#132847] text-white border-[#132847] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${selectedApp.lookingTo.includes(opt.value) ? 'bg-white border-white' : 'bg-white border-gray-200'}`}>
                                                {selectedApp.lookingTo.includes(opt.value) && <Check size={10} className="text-[#132847]" />}
                                            </div>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                {selectedApp.lookingTo.includes('other') && (
                                    <input 
                                        className="mt-3 w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm animate-in slide-in-from-top-2"
                                        placeholder="Specify other goals..."
                                        value={selectedApp.lookingToOther}
                                        onChange={e => updateAppData(app => ({...app, lookingToOther: e.target.value}))}
                                    />
                                )}
                            </div>

                            <label className="block">
                                <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Not the right fit for:</span>
                                <textarea 
                                    rows={2}
                                    value={selectedApp.notFitFor}
                                    onChange={e => updateAppData(app => ({...app, notFitFor: e.target.value}))}
                                    placeholder="e.g. Solo brokers on a tight budget..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-purple-500 outline-none resize-none transition-all"
                                />
                            </label>
                        </div>
                    </section>

                    {/* Training Material Section (LOCKED) */}
                    <section>
                        <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                            <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Video size={18} /></div>
                            <h3 className="text-lg font-bold text-gray-900">Training Material</h3>
                        </div>
                        
                        <div className="relative group overflow-hidden rounded-2xl">
                             {/* Blur Overlay */}
                             <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mb-4 shadow-xl border-4 border-white">
                                    <Lock size={28} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Paid Premium Feature</h4>
                                <p className="text-sm text-gray-600 max-w-sm mb-6">
                                    Showcase your expertise with videos, guides, and interactive training content directly on your public profile.
                                </p>
                                <label className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-purple-400 transition-all cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                        checked={selectedApp.wantsTraining}
                                        onChange={e => updateAppData(app => ({...app, wantsTraining: e.target.checked}))}
                                    />
                                    <span className="text-sm font-bold text-gray-800">
                                        Interested in uploading Training Material?
                                    </span>
                                </label>
                                {selectedApp.wantsTraining && (
                                    <p className="mt-4 text-xs font-bold text-purple-600 animate-in slide-in-from-top-2">
                                        Check noted! Our team will discuss the options available to you.
                                    </p>
                                )}
                             </div>

                             {/* Mock Blurred UI Content */}
                             <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-none select-none opacity-40">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="aspect-video bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center p-4">
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
                <span className="text-sm font-bold text-gray-900 block mb-3">Any other questions or notes?</span>
                <textarea 
                    rows={4}
                    value={finalNotes}
                    onChange={e => setFinalNotes(e.target.value)}
                    placeholder="Is there anything else we should know about your application?"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:border-purple-500 outline-none resize-none transition-all"
                />
            </label>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex items-start gap-4 max-w-2xl text-center bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-4">
                <AlertCircle size={20} className="text-purple-600 mt-1 flex-shrink-0 mx-auto" />
                <p className="text-sm text-purple-800 leading-relaxed font-medium">
                    By submitting, you agree to our <span className="font-bold underline cursor-pointer">Partner Terms</span>. Our team will review your application and offerings to ensure they meet our quality standards.
                </p>
            </div>
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full max-w-xl py-5 rounded-2xl font-extrabold text-lg text-white shadow-2xl transition-all flex items-center justify-center gap-3 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 via-purple-700 to-[#132847] hover:scale-[1.02] hover:shadow-purple-900/20'}`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Processing Application...
                    </>
                ) : (
                    <>
                        <CheckCircle size={24} />
                        Submit Listing Application
                    </>
                )}
            </button>
            <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                <Lock size={12} /> Secure encrypted transmission
            </p>
        </div>
      </div>
    </div>
  );
};

export default ApplyPartner;