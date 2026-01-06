import React, { useState, useMemo } from 'react';
import { X, Shield, Zap, Cpu, MessageSquare, BarChart, Settings, Layout, Scale, CheckCircle2, ChevronDown, ChevronUp, ChevronRight, Sparkles, FileText, Award, Plus, Trash2, Info, Megaphone, Star, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const METRICS = {
    security: { label: 'Security & Compliance', weight: 0.25, icon: Shield, color: 'text-red-600', desc: '2FA, AML, Data Encryption, Audit Logs' },
    automation: { label: 'Automation & Workflows', weight: 0.20, icon: Zap, color: 'text-orange-600', desc: 'OCR, Auto-reminders, Doc Collection' },
    integrations: { label: 'Integrations & APIs', weight: 0.15, icon: Layout, color: 'text-blue-600', desc: 'Zapier, Make, Lender Lodgement' },
    ai: { label: 'AI & Intelligence', weight: 0.10, icon: Cpu, color: 'text-purple-600', desc: 'AI Assistants, Refinance Triggers' },
    comm: { label: 'Comm & Collaboration', weight: 0.10, icon: MessageSquare, color: 'text-emerald-600', desc: 'Portals, Messaging, @mentions' },
    data: { label: 'Data & Reporting', weight: 0.10, icon: BarChart, color: 'text-indigo-600', desc: 'Analytics, Churn Prediction' },
    marketing: { label: 'Marketing Channels', weight: 0.05, icon: Megaphone, color: 'text-pink-600', desc: 'Social distribution, CRM sync' },
    infra: { label: 'Platform & Infra', weight: 0.025, icon: Settings, color: 'text-slate-600', desc: 'Scalability, Uptime, Cloud Sync' },
    usability: { label: 'Usability', weight: 0.025, icon: CheckCircle2, color: 'text-cyan-600', desc: 'Mobile Dashboards, Onboarding' }
};

const BADGES = [
    { id: 'leader', label: 'Leader', icon: '🥇', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'high_performer', label: 'High Performer', icon: '⚡', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'momentum', label: 'Momentum Leader', icon: '🏆', color: 'bg-purple-100 text-purple-700 border-purple-200' }
];

const SERVICE_REGIONS = ['North America', 'Europe', 'Asia Pacific', 'AU/NZ Only', 'Global'];

export default function ApplicationAssessmentModal({ isOpen, onClose, application, onApprove }) {
    const [activeTab, setActiveTab] = useState('categorise');
    const [isRubricOpen, setIsRubricOpen] = useState(true);
    const [isAppDataVisible, setIsAppDataVisible] = useState(false);

    const [selectedBadges, setSelectedBadges] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState(['Global']);
    const [pricingEntry, setPricingEntry] = useState('');
    const [alternatives, setAlternatives] = useState('');
    const [faqs, setFaqs] = useState([]);

    const [features, setFeatures] = useState(() => {
        const initial = [];
        if (application?.product_service_features) {
            const featuresText = application.product_service_features.split('\n').filter(f => f.trim());
            featuresText.forEach((f, i) => {
                initial.push({
                    id: `f-${i}`,
                    name: f.trim(),
                    score: 5,
                    boost: 1.0,
                    publicNote: '',
                    privateNote: '',
                    category: 'automation'
                });
            });
        }
        if (application?.integrations) {
            initial.push({
                id: 'f-integrations',
                name: 'Core Integrations Hub',
                score: 7,
                boost: 1.2,
                publicNote: `Integrates with ${application.integrations}`,
                privateNote: 'Pre-populated from vendor application.',
                category: 'integrations'
            });
        }
        return initial;
    });

    const categoryScores = useMemo(() => {
        const results = {};
        Object.keys(METRICS).forEach(cat => {
            const catFeatures = features.filter(f => f.category === cat);
            if (catFeatures.length === 0) {
                results[cat] = 0;
                return;
            }
            const totalEffective = catFeatures.reduce((acc, f) => acc + (f.score * f.boost), 0);
            results[cat] = Number((totalEffective / catFeatures.length).toFixed(2));
        });
        return results;
    }, [features]);

    const overallScore = useMemo(() => {
        let total = 0;
        Object.keys(METRICS).forEach(cat => {
            total += (categoryScores[cat] || 0) * METRICS[cat].weight;
        });
        return total.toFixed(2);
    }, [categoryScores]);

    if (!isOpen) return null;

    const handleAddFeature = (cat) => {
        const newF = {
            id: `custom-${Date.now()}`,
            name: 'New Feature',
            score: 1,
            boost: 1.0,
            publicNote: '',
            privateNote: '',
            category: cat
        };
        setFeatures([...features, newF]);
    };

    const updateFeature = (id, updates) => {
        setFeatures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeFeature = (id) => {
        setFeatures(prev => prev.filter(f => f.id !== id));
    };

    const handleFinalApprove = () => {
        // Validation checks
        const topRankedFeatures = features.filter(f => f.topFeatureOrder).length;
        const hasScores = features.some(f => f.score > 0);

        if (!hasScores) {
            toast.error("Please score at least one feature before finalizing");
            return;
        }

        if (topRankedFeatures === 0) {
            toast.warning("Consider ranking at least 3 top features for better profile visibility");
        }

        if (!pricingEntry) {
            toast.warning("Consider adding pricing information for better comparison data");
        }

        onApprove({
            categoryScores,
            overallScore,
            selectedBadges,
            features,
            pricingEntry,
            faqs,
            alternatives,
            regions: selectedRegions
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#f8fafc] rounded-2xl shadow-2xl w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">

                <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm relative z-30">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {application?.company_name?.[0] || 'V'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Vendor Appraisal: {application?.company_name || 'Vendor'}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200">Ref: {application?.id?.substring(0, 8)}</span>
                                <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200">Assessor: Editorial Team</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right border-r border-slate-200 pr-8">
                            <p className="text-xs font-medium text-slate-500 mb-1">Effective Broker-Fit Score</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-900 leading-none">{overallScore}</span>
                                <span className="text-sm font-medium text-slate-400">/ 10.0</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                            <X size={28} />
                        </button>
                    </div>
                </div>

                <div className="bg-white px-8 flex items-center justify-between border-b border-slate-200">
                    <div className="flex gap-10">
                        <button
                            onClick={() => setActiveTab('categorise')}
                            className={`py-5 text-sm font-semibold transition-all relative flex items-center gap-2 ${activeTab === 'categorise' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Layout size={18} /> Stage 1: Categorise
                            {activeTab === 'categorise' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full animate-in slide-in-from-bottom-1" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('assessment')}
                            className={`py-5 text-sm font-semibold transition-all relative flex items-center gap-2 ${activeTab === 'assessment' ? 'text-purple-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Scale size={18} /> Stage 2: Assessment Matrix
                            {activeTab === 'assessment' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full animate-in slide-in-from-bottom-1" />}
                        </button>
                    </div>
                    <button
                        onClick={() => setIsAppDataVisible(!isAppDataVisible)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 transition-all"
                    >
                        {isAppDataVisible ? 'Hide Application Data' : 'View Full Application Data'}
                        {isAppDataVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">

                        {isAppDataVisible && (
                            <div className="mb-8 p-6 bg-[#0f172a] text-slate-300 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                        <FileText size={16} /> Vendor Application Raw Data
                                    </h3>
                                    <span className="text-xs font-medium text-slate-500">Submitted: {new Date(application?.created_date).toLocaleDateString()}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-slate-500 font-bold uppercase mb-1">Description</p>
                                            <p className="text-slate-200">{application?.company_description || 'No description provided.'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-bold uppercase mb-1">Pricing Structure</p>
                                            <p className="text-slate-200">{application?.pricing_structure || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-slate-500 font-bold uppercase mb-1">Key Features</p>
                                            <p className="text-slate-200 whitespace-pre-wrap">{application?.product_service_features || 'None listed'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-slate-500 font-bold uppercase mb-1">Integrations</p>
                                            <p className="text-slate-200">{application?.integrations || 'None listed'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 font-bold uppercase mb-1">Categories</p>
                                            <p className="text-slate-200">{application?.categories?.join(', ') || 'None'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'categorise' ? (
                            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">

                                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                                        <Award size={18} className="text-orange-500" />
                                        <h3 className="text-sm font-semibold text-slate-900">Marketplace Badges & Placement</h3>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-600 mb-3">Apply Status Badges</label>
                                            <div className="flex flex-wrap gap-3">
                                                {BADGES.map(b => (
                                                    <button
                                                        key={b.id}
                                                        onClick={() => setSelectedBadges(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])}
                                                        className={`px-5 py-2.5 rounded-xl border-2 font-black text-xs transition-all flex items-center gap-2 ${selectedBadges.includes(b.id) ? b.color : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                                                    >
                                                        <span>{b.icon}</span> {b.label}
                                                        {selectedBadges.includes(b.id) && <CheckCircle2 size={14} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-3">Service Areas</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {SERVICE_REGIONS.map(r => (
                                                        <button
                                                            key={r}
                                                            onClick={() => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                                                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${selectedRegions.includes(r) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}
                                                        >
                                                            {r}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                                        <Layout size={18} className="text-blue-600" />
                                        <h3 className="text-sm font-semibold text-slate-900">Comparison Mapping Details</h3>
                                    </div>
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <label className="block">
                                                <span className="text-xs font-medium text-slate-600 mb-2 block">Pricing (Entry) Display</span>
                                                <input
                                                    type="text" value={pricingEntry} onChange={e => setPricingEntry(e.target.value)}
                                                    placeholder="e.g. Free Forever"
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-xs font-medium text-slate-600 mb-2 block">Market Alternatives (Comma separated)</span>
                                                <textarea
                                                    rows={3} value={alternatives} onChange={e => setAlternatives(e.target.value)}
                                                    placeholder="Monday.com, Asana, ClickUp..."
                                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-xs font-medium text-slate-600">Product FAQs</label>
                                                <button onClick={() => setFaqs([...faqs, { q: '', a: '' }])} className="text-xs font-semibold text-blue-600">Add FAQ</button>
                                            </div>
                                            <div className="space-y-3">
                                                {faqs.map((f, i) => (
                                                    <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                                        <input placeholder="Question" className="w-full bg-white border-none p-1 text-xs font-bold" value={f.q} onChange={e => {
                                                            const next = [...faqs]; next[i].q = e.target.value; setFaqs(next);
                                                        }} />
                                                        <textarea placeholder="Answer" className="w-full bg-white border-none p-1 text-xs resize-none" rows={2} value={f.a} onChange={e => {
                                                            const next = [...faqs]; next[i].a = e.target.value; setFaqs(next);
                                                        }} />
                                                    </div>
                                                ))}
                                                {faqs.length === 0 && <div className="text-center py-10 border-2 border-dashed border-slate-100 text-slate-300 text-xs font-bold">No FAQs added yet</div>}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-500 space-y-12 pb-20">

                                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md pb-4">
                                    <div className="bg-[#0f172a] text-white rounded-2xl shadow-xl overflow-hidden">
                                        <button
                                            onClick={() => setIsRubricOpen(!isRubricOpen)}
                                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Scale size={18} className="text-purple-400" />
                                                <h3 className="text-sm font-semibold">Assessor Scoring Rubric & Guide</h3>
                                            </div>
                                            {isRubricOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {isRubricOpen && (
                                            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
                                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                                    <p className="text-xs font-semibold text-red-400 mb-1">1-3 Manual</p>
                                                    <p className="text-xs text-slate-300 leading-relaxed">Present but requires heavy manual work or critical parts are missing.</p>
                                                </div>
                                                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                                    <p className="text-xs font-semibold text-yellow-400 mb-1">4-6 Standard</p>
                                                    <p className="text-xs text-slate-300 leading-relaxed">Basic expectations met. Digital but static (portals, simple storage).</p>
                                                </div>
                                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                                    <p className="text-xs font-semibold text-blue-400 mb-1">7-8 Advanced</p>
                                                    <p className="text-xs text-slate-300 leading-relaxed">Highly efficient. Uses OCR, APIs, or triggers to move data automatically.</p>
                                                </div>
                                                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                                    <p className="text-xs font-semibold text-purple-400 mb-1">9-10 Elite</p>
                                                    <p className="text-xs text-slate-300 leading-relaxed">AI-native. System predicts next steps or acts on behalf of the broker.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-16">
                                    {Object.keys(METRICS).map(catKey => {
                                        const cat = METRICS[catKey];
                                        const Icon = cat.icon;
                                        const catFeatures = features.filter(f => f.category === catKey);
                                        const catScore = categoryScores[catKey] || 0;

                                        return (
                                            <div key={catKey} className="animate-in slide-in-from-bottom-4 duration-500">
                                                <div className="flex items-end justify-between mb-4 border-b-2 border-slate-200 pb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 bg-white rounded-2xl shadow-sm border border-slate-100 ${cat.color}`}>
                                                            <Icon size={18} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-semibold text-slate-900">{cat.label}</h4>
                                                            <p className="text-xs font-medium text-slate-500">Weight: {cat.weight * 100}% • {cat.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-medium text-slate-500 mb-1">Category Fit Rating</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-2xl font-bold text-slate-900">{catScore}</span>
                                                            <span className="text-xs font-medium text-slate-400">/ 10</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                                                                <th className="px-6 py-4 w-1/4 text-left">Feature Name</th>
                                                                <th className="px-6 py-4 w-[110px] text-center">Rubric (1-10)</th>
                                                                <th className="px-6 py-4 w-[100px] text-center">
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger className="flex items-center justify-center gap-1 mx-auto">
                                                                                AI Boost
                                                                                <HelpCircle className="w-3 h-3 text-slate-400" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top" className="max-w-xs">
                                                                                <p className="font-semibold mb-2">AI Boost Multipliers:</p>
                                                                                <p className="text-xs mb-1"><strong>1.0x:</strong> Standard feature, no AI enhancement</p>
                                                                                <p className="text-xs mb-1"><strong>1.2x:</strong> Uses AI to assist workflows (e.g., smart suggestions)</p>
                                                                                <p className="text-xs"><strong>1.5x:</strong> AI-native feature that automates or predicts broker actions</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </th>
                                                                <th className="px-6 py-4 text-left">Public Take</th>
                                                                <th className="px-6 py-4 text-left">Internal Notes</th>
                                                                <th className="px-6 py-4 w-[90px] text-center">
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger className="flex items-center justify-center gap-1 mx-auto">
                                                                                Top Rank
                                                                                <HelpCircle className="w-3 h-3 text-slate-400" />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top" className="max-w-md">
                                                                                <p className="font-semibold mb-2">Top Feature Ranking:</p>
                                                                                <p className="text-xs mb-2">Rank the top 3-5 features that will be highlighted on the vendor profile and comparison pages.</p>
                                                                                <p className="text-xs font-semibold mb-1">Scoring Guide Reference:</p>
                                                                                <p className="text-xs mb-1">• <strong>1-3:</strong> Manual/basic features</p>
                                                                                <p className="text-xs mb-1">• <strong>4-6:</strong> Standard digital features</p>
                                                                                <p className="text-xs mb-1">• <strong>7-8:</strong> Advanced automation</p>
                                                                                <p className="text-xs">• <strong>9-10:</strong> Elite AI-powered features</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </th>
                                                                <th className="px-6 py-4 w-10"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {catFeatures.map(f => (
                                                                <tr key={f.id} className="hover:bg-slate-50/30 transition-colors group">
                                                                    <td className="px-6 py-4">
                                                                        <input
                                                                            value={f.name} onChange={e => updateFeature(f.id, { name: e.target.value })}
                                                                            className="w-full bg-transparent font-bold text-slate-700 text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 rounded px-1 outline-none"
                                                                        />
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <div className="flex flex-col items-center gap-1">
                                                                            <input
                                                                                type="number" min="1" max="10"
                                                                                value={f.score} onChange={e => updateFeature(f.id, { score: parseInt(e.target.value) || 1 })}
                                                                                className="w-12 h-10 border-2 border-slate-100 rounded-lg text-center font-black text-slate-900 focus:border-purple-500 outline-none"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <select
                                                                            value={f.boost} onChange={e => updateFeature(f.id, { boost: parseFloat(e.target.value) })}
                                                                            className="bg-purple-50 text-purple-700 border border-purple-100 rounded-lg px-2 py-1 text-[10px] font-black outline-none focus:ring-2 focus:ring-purple-500"
                                                                        >
                                                                            <option value="1.0">1.0x</option>
                                                                            <option value="1.2">1.2x</option>
                                                                            <option value="1.5">1.5x</option>
                                                                        </select>
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <textarea
                                                                            rows={2} value={f.publicNote} onChange={e => updateFeature(f.id, { publicNote: e.target.value })}
                                                                            className="w-full bg-slate-50/50 p-2 text-xs border border-slate-100 rounded-lg focus:bg-white outline-none resize-none"
                                                                            placeholder="Expert commentary..."
                                                                        />
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <textarea
                                                                            rows={2} value={f.privateNote} onChange={e => updateFeature(f.id, { privateNote: e.target.value })}
                                                                            className="w-full bg-slate-100/30 p-2 text-xs border border-slate-100 rounded-lg focus:bg-white outline-none resize-none italic"
                                                                            placeholder="Internal context..."
                                                                        />
                                                                    </td>
                                                                    <td className="px-6 py-4 text-center">
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            <Star size={14} className={f.topFeatureOrder ? 'text-orange-500 fill-orange-500' : 'text-slate-200'} />
                                                                            <input
                                                                                type="number" min="1" max="10"
                                                                                placeholder="-"
                                                                                value={f.topFeatureOrder || ''}
                                                                                onChange={e => updateFeature(f.id, { topFeatureOrder: e.target.value ? parseInt(e.target.value) : undefined })}
                                                                                className="w-10 h-10 border border-slate-200 rounded-lg text-center font-bold text-slate-700 focus:border-orange-500 outline-none"
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right">
                                                                        <button onClick={() => removeFeature(f.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                            {catFeatures.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                                                                        No features mapped to {cat.label} yet.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            <tr>
                                                                <td colSpan={7} className="px-6 py-3 bg-slate-50/50">
                                                                    <button onClick={() => handleAddFeature(catKey)} className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800">
                                                                        <Plus size={14} /> Add new {cat.label} Feature
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-indigo-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                                    <div className="shrink-0 w-24 h-24 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center">
                                        <Sparkles size={48} className="text-indigo-300" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h4 className="text-xl font-semibold">Final Assessment Principles</h4>
                                        <p className="text-sm text-indigo-100 leading-relaxed">
                                            Ensure proportionality when applying the <span className="text-white font-semibold">1.5x AI Boost</span>. All expert commentary must provide a direct "no-fluff" insight into how the feature impacts a broker's safety or daily workflow. Ranking priority is strictly determined by market-verified automated efficiency.
                                        </p>
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-white/10 rounded-full border border-white/20">
                                                <Info size={12} /> Proportionality Checked
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-white/10 rounded-full border border-white/20">
                                                <CheckCircle2 size={12} /> Human-Verified Boosts
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>

                    <div className="w-80 bg-white border-l border-slate-200 p-8 space-y-8 hidden xl:block">
                        <div>
                            <h4 className="text-xs font-semibold text-slate-600 mb-4">Broker-Fit Breakdown</h4>
                            <div className="space-y-3">
                                {Object.keys(METRICS).map(key => (
                                    <div key={key} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span className="text-slate-600">{METRICS[key].label}</span>
                                            <span className="text-slate-900">{categoryScores[key] || 0}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-700 ${METRICS[key].color.replace('text', 'bg')}`}
                                                style={{ width: `${(categoryScores[key] || 0) * 10}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <h4 className="text-xs font-semibold text-slate-600 mb-4">Assigned Badges</h4>
                            <div className="flex flex-col gap-2">
                                {selectedBadges.map(bid => {
                                    const b = BADGES.find(x => x.id === bid);
                                    return b ? (
                                        <div key={bid} className={`p-3 rounded-xl border-2 flex items-center justify-between ${b.color}`}>
                                            <span className="text-xs font-black uppercase">{b.label}</span>
                                            <Award size={14} />
                                        </div>
                                    ) : null;
                                })}
                                {selectedBadges.length === 0 && <p className="text-xs text-slate-300 italic">No badges assigned</p>}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100">
                            <h4 className="text-xs font-semibold text-slate-600 mb-4">Top Ranked Features</h4>
                            <div className="space-y-2">
                                {features.filter(f => f.topFeatureOrder).sort((a, b) => (a.topFeatureOrder || 0) - (b.topFeatureOrder || 0)).map(f => (
                                    <div key={f.id} className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
                                        <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{f.topFeatureOrder}</span>
                                        <span className="text-xs font-bold text-slate-700 truncate">{f.name}</span>
                                    </div>
                                ))}
                                {features.filter(f => f.topFeatureOrder).length === 0 && <p className="text-xs text-slate-300 italic">No features ranked yet</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-slate-200 p-6 flex items-center justify-between shadow-lg relative z-30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                            <p className="text-xs font-medium text-slate-500 mb-0.5">Workflow Status</p>
                            <p className="text-sm font-semibold text-slate-900">{activeTab === 'categorise' ? 'Stage 1: Mapping' : 'Stage 2: Appraisal'}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={() => {
                                if (activeTab === 'categorise') {
                                    setActiveTab('assessment');
                                } else {
                                    handleFinalApprove();
                                }
                            }}
                            className="px-12 py-3 bg-[#0f172a] text-white rounded-xl text-sm font-semibold shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                        >
                            {activeTab === 'categorise' ? 'Proceed to Scoring' : 'Finalise Appraisal & Publish'}
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}