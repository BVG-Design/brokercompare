'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, Shield, Zap, Cpu, MessageSquare, BarChart, Settings, Layout, Scale, CheckCircle2, ChevronDown, ChevronUp, ChevronRight, Sparkles, FileText, Award, Plus, Trash2, Info, Megaphone, Star, HelpCircle, Loader2, Link2, Globe, DollarSign, MessageCircle, ExternalLink, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase/client';

const METRICS: Record<string, any> = {
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

interface ApplicationAssessmentProps {
    isOpen: boolean;
    onClose: () => void;
    application: any;
    onSaved?: () => void;
}

export default function ApplicationAssessment({ isOpen, onClose, application, onSaved }: ApplicationAssessmentProps) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('categorise');
    const [isRubricOpen, setIsRubricOpen] = useState(true);
    const [isAppDataVisible, setIsAppDataVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Visibility Controls
    const [publishedSections, setPublishedSections] = useState<Record<string, boolean>>({
        categorise: true,
        mapping: true,
        features: true,
        scores: false
    });
    const [featureAuditInProgress, setFeatureAuditInProgress] = useState(false);

    const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>(['Global']);
    const [pricingEntry, setPricingEntry] = useState('');
    const [alternatives, setAlternatives] = useState('');
    const [faqs, setFaqs] = useState<any[]>([]);
    const [linkedResources, setLinkedResources] = useState<any[]>([]);

    const [features, setFeatures] = useState<any[]>([]);

    // Load existing assessment if available
    useEffect(() => {
        const loadAssessment = async () => {
            if (!application?.id) return;

            const { data, error } = await supabase
                .from('application_assessments')
                .select('*')
                .eq('application_id', application.id.toString())
                .maybeSingle();

            if (data) {
                setSelectedBadges(data.selected_badges || []);
                setSelectedRegions(data.service_area || ['Global']);
                setPricingEntry(data.pricing_entry || '');
                setAlternatives(data.product_alternatives?.join(', ') || '');
                setFaqs(data.faqs || []);
                setFeatures(data.assessment_features || []);
                setPublishedSections(data.published_sections || {
                    categorise: true,
                    mapping: true,
                    features: true,
                    scores: false
                });
                setFeatureAuditInProgress(data.audit_in_progress || false);
                setLinkedResources(data.linked_resources || []);
            } else {
                // Initialize from application data
                const initialFeatures: any[] = [];
                if (application.features && Array.isArray(application.features)) {
                    application.features.forEach((f: string, i: number) => {
                        initialFeatures.push({
                            id: `f-${i}`,
                            name: f,
                            score: 5,
                            boost: 1.0,
                            publicNote: '',
                            privateNote: '',
                            category: 'automation'
                        });
                    });
                }
                if (application.integrations && Array.isArray(application.integrations)) {
                    initialFeatures.push({
                        id: 'f-integrations',
                        name: 'Core Integrations Hub',
                        score: 7,
                        boost: 1.2,
                        publicNote: `Integrates with ${application.integrations.join(', ')}`,
                        privateNote: 'Pre-populated from vendor application.',
                        category: 'integrations'
                    });
                }
                setFeatures(initialFeatures);
            }
        };

        if (isOpen) {
            loadAssessment();
        }
    }, [isOpen, application]);

    const categoryScores = useMemo(() => {
        const results: Record<string, number> = {};
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
        return Number(total.toFixed(2));
    }, [categoryScores]);

    if (!isOpen) return null;

    const handleAddFeature = (cat: string) => {
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

    const updateFeature = (id: string, updates: any) => {
        setFeatures(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeFeature = (id: string) => {
        setFeatures(prev => prev.filter(f => f.id !== id));
    };

    const handleAddResource = () => {
        setLinkedResources([...linkedResources, { title: '', url: '' }]);
    };

    const toggleSectionPublish = (section: string) => {
        setPublishedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const PublishToggle = ({ section }: { section: string }) => (
        <button
            onClick={() => toggleSectionPublish(section)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all border ${publishedSections[section] ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}
        >
            {publishedSections[section] ? <><Eye size={12} /> Live</> : <><EyeOff size={12} /> Hidden</>}
        </button>
    );

    const RubricTooltip = () => (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f172a] text-white p-4 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 cursor-default">
            <div className="space-y-4">
                <div className="pb-2 border-b border-slate-700">
                    <p className="text-[10px] font-black uppercase text-red-400 mb-1">1-3 Manual</p>
                    <p className="text-[9px] text-slate-300 leading-tight">Missing parts or heavy manual effort required. Static tools.</p>
                </div>
                <div className="pb-2 border-b border-slate-700">
                    <p className="text-[10px] font-black uppercase text-yellow-400 mb-1">4-6 Standard</p>
                    <p className="text-[9px] text-slate-300 leading-tight">Meets basic digital expectations. Functional but not transformative.</p>
                </div>
                <div className="pb-2 border-b border-slate-700">
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-1">7-8 Advanced</p>
                    <p className="text-[9px] text-slate-300 leading-tight">High efficiency. Uses OCR or APIs to move data automatically.</p>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-purple-400 mb-1">9-10 Elite</p>
                    <p className="text-[9px] text-slate-300 leading-tight">AI-native. System predicts next steps or acts on broker behalf.</p>
                </div>
            </div>
        </div>
    );

    const handleSave = async (isFinal: boolean) => {
        setIsSaving(true);
        try {
            const assessmentData = {
                application_id: application.id.toString(),
                overall_score: overallScore,
                category_scores: categoryScores,
                selected_badges: selectedBadges,
                assessment_features: features,
                product_alternatives: alternatives.split(',').map(s => s.trim()).filter(Boolean),
                faqs: faqs,
                service_area: selectedRegions,
                published_sections: publishedSections,
                audit_in_progress: featureAuditInProgress,
                pricing_entry: pricingEntry,
                linked_resources: linkedResources,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('application_assessments')
                .upsert(assessmentData, { onConflict: 'application_id' });

            if (error) throw error;

            if (isFinal) {
                // Update application status to approved
                const { error: appError } = await supabase
                    .from('partner_application')
                    .update({ status: 'approved' })
                    .eq('id', application.id);

                if (appError) throw appError;

                toast({
                    title: "Application Approved",
                    description: "The vendor profile has been published.",
                });
                onSaved?.();
                onClose();
            } else {
                toast({
                    title: "Progress Saved",
                    description: "Assessment draft has been updated.",
                });
            }
        } catch (error: any) {
            console.error('Save error:', error);
            toast({
                title: "Error saving assessment",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#fdfcf9] rounded-2xl shadow-2xl w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">

                <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm relative z-30">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {application?.company_name?.[0] || 'V'}
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Appraising: {application?.company_name || 'Vendor'}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 uppercase tracking-wider">Ref: APP-{application?.id?.toString().substring(0, 5) || '8822'}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded border border-blue-200 uppercase tracking-wider">Assessor: Editorial Team</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Global Controls */}
                        {activeTab === 'assessment' && (
                            <div className="flex items-center gap-3 pr-6 border-r border-slate-200">
                                <button
                                    onClick={() => setFeatureAuditInProgress(!featureAuditInProgress)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${featureAuditInProgress ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-white hover:text-slate-600'}`}
                                >
                                    {featureAuditInProgress ? <AlertCircle size={14} /> : <Shield size={14} />}
                                    Audit Mode
                                </button>
                                <PublishToggle section="features" />
                            </div>
                        )}
                        <div className="text-right border-r border-slate-200 pr-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Effective Broker-Fit Score</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">{overallScore}</span>
                                <span className="text-sm font-bold text-slate-300">/ 10.0</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all">
                            <X size={28} />
                        </button>
                    </div>
                </div>

                <div className="bg-white px-8 flex items-center justify-between border-b border-slate-200">
                    <div className="flex border-b border-slate-200 bg-slate-50/50">
                        {[
                            { id: 'categorise', label: '1. Categorise', icon: Layout },
                            { id: 'assessment', label: '2. Appraisal', icon: Scale },
                            { id: 'results', label: '3. Results', icon: BarChart },
                            { id: 'resources', label: '4. Resources', icon: Link2 },
                            { id: 'faq', label: '5. FAQ Editor', icon: MessageSquare },
                            { id: 'publish', label: '6. Publish', icon: CheckCircle2 }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#0f172a]' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <tab.icon size={14} />
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f172a]" />}
                            </button>
                        ))}
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                        <button
                            onClick={() => setIsAppDataVisible(!isAppDataVisible)}
                            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase text-slate-500 hover:text-[#0f172a] transition-all"
                        >
                            <FileText size={14} />
                            {isAppDataVisible ? 'Hide Data' : 'View Data'}
                        </button>
                    </div>
                </div>

                {/* Raw Application Data Overlay */}
                {isAppDataVisible && (
                    <div className="bg-[#0f172a] text-slate-300 p-8 overflow-y-auto max-h-[400px] border-b border-slate-800">
                        <div className="max-w-4xl mx-auto">
                            <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                                <FileText size={14} className="text-blue-400" />
                                Submission Payload
                            </h3>
                            <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-3">Product Images</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {application?.product_images?.length > 0 ? application.product_images.map((img: string, i: number) => (
                                                <img key={i} src={img} alt="Product" className="rounded-lg border border-slate-700 w-full h-24 object-cover" />
                                            )) : <p className="text-[10px] text-slate-600">No images provided</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Aggregator Compatibility</p>
                                        <div className="flex flex-wrap gap-2">
                                            {application?.aggregator_compatibility ? (
                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold border border-blue-500/20">{application.aggregator_compatibility}</span>
                                            ) : <span className="text-slate-600 text-[10px]">Not specified</span>}
                                        </div>
                                        {application?.integration_notes && (
                                            <p className="mt-2 text-[10px] italic text-slate-400">"{application.integration_notes}"</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Integration Link</p>
                                        {application?.integration_docs_link ? (
                                            <a href={application.integration_docs_link} target="_blank" className="text-blue-400 hover:underline text-[10px] flex items-center gap-1">
                                                <ExternalLink size={10} /> Documentation
                                            </a>
                                        ) : <span className="text-slate-600 text-[10px]">None provided</span>}
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Raw JSON</p>
                                        <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48">
                                            {JSON.stringify(application, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                        {activeTab === 'categorise' ? (
                            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">Feature Extraction</h3>
                                                <p className="text-xs text-slate-500">Categorise submitted features into standard platform metrics</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const id = Math.random().toString(36).substr(2, 9);
                                                        setFeatures([...features, { id, name: '', category: 'security', score: 5, boost: 1, publicNote: '', privateNote: '' }]);
                                                    }}
                                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                                                >
                                                    <Plus size={14} /> Add Feature
                                                </button>
                                                <PublishToggle section="categorise" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {features.map(feature => {
                                                const info = METRICS[feature.category];
                                                return (
                                                    <div key={feature.id} className="bg-slate-50 border border-slate-200 rounded-xl py-3">
                                                        <div className="grid grid-cols-12 gap-6 items-center">
                                                            <div className="col-span-4 pl-4 uppercase">
                                                                <input
                                                                    type="text"
                                                                    value={feature.name}
                                                                    onChange={(e) => updateFeature(feature.id, { name: e.target.value })}
                                                                    placeholder="Feature Name"
                                                                    className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 rounded-lg px-3 py-2 text-[10px] font-black placeholder:text-slate-300"
                                                                />
                                                            </div>
                                                            <div className="col-span-3">
                                                                <select
                                                                    value={feature.category}
                                                                    onChange={(e) => updateFeature(feature.id, { category: e.target.value })}
                                                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold text-slate-600 outline-none"
                                                                >
                                                                    {Object.entries(METRICS).map(([id, m]: [string, any]) => (
                                                                        <option key={id} value={id}>{m.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div className="col-span-4 pl-8">
                                                                <div className="flex items-center gap-2 text-slate-400">
                                                                    <info.icon size={12} className={info.color} />
                                                                    <span className="text-[10px] font-bold">{info.desc}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-1 flex justify-end">
                                                                <button onClick={() => removeFeature(feature.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {features.length === 0 && (
                                                <div className="text-center py-10 border-2 border-dashed border-slate-100 text-slate-300 text-xs font-bold rounded-xl">
                                                    No features added yet. Click "Add Feature" to begin.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 space-y-6">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <Award size={16} className="text-orange-500" />
                                            Badges & Regions
                                        </h3>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Marketplace Status</p>
                                            <div className="flex flex-wrap gap-2">
                                                {BADGES.map(b => (
                                                    <button
                                                        key={b.id}
                                                        onClick={() => setSelectedBadges(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${selectedBadges.includes(b.id) ? b.color : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                                    >
                                                        {b.icon} {b.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Availability</p>
                                            <div className="flex flex-wrap gap-2">
                                                {SERVICE_REGIONS.map(r => (
                                                    <button
                                                        key={r}
                                                        onClick={() => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${selectedRegions.includes(r) ? 'bg-blue-600 text-white border-blue-500 scale-105' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8 space-y-6">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <Layout size={16} className="text-blue-500" />
                                            Pricing & Mapping
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Alternatives</p>
                                                <input
                                                    value={alternatives} onChange={e => setAlternatives(e.target.value)}
                                                    placeholder="Asana, Monday, Hive..."
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Premium Pricing Entry</p>
                                                <textarea
                                                    value={pricingEntry} onChange={e => setPricingEntry(e.target.value)}
                                                    placeholder="From $50/mo. Free for teams < 5."
                                                    rows={3}
                                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        ) : activeTab === 'assessment' ? (
                            <div className="animate-in fade-in duration-500 space-y-12 pb-20">

                                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md pb-4">
                                    <div className="bg-[#132847] text-white rounded-2xl shadow-xl overflow-hidden">
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
                                                                <th className="px-6 py-4 w-[90px] text-center">Top Rank</th>
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
                                                                        <input
                                                                            type="number" min="1" max="10"
                                                                            value={f.score} onChange={e => updateFeature(f.id, { score: parseInt(e.target.value) || 1 })}
                                                                            className="w-12 h-10 border-2 border-slate-100 rounded-lg text-center font-black text-slate-900 focus:border-purple-500 outline-none"
                                                                        />
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
                                                            <tr>
                                                                <td colSpan={7} className="px-6 py-3 bg-slate-50/50">
                                                                    <button onClick={() => handleAddFeature(catKey)} className="flex items-center gap-2 text-xs font-semibold text-brand-blue hover:text-blue-800">
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

                                <div className="bg-[#132847] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                                    <div className="shrink-0 w-24 h-24 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center">
                                        <Sparkles size={48} className="text-[#22c55e]" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h4 className="text-xl font-semibold">Final Assessment Principles</h4>
                                        <p className="text-sm text-slate-100 leading-relaxed">
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
                        ) : activeTab === 'results' ? (
                            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                                        <div className="p-10 border-b border-slate-100 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Final Scorecard</h3>
                                                <p className="text-sm text-slate-500 font-medium italic">Calculated weighted averages based on Stage 2 benchmarks</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impact Rating</p>
                                                <div className="px-4 py-1.5 bg-brand-blue text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                                                    {overallScore >= 8 ? 'Elite Platform' : overallScore >= 6 ? 'Market Leading' : 'Verified Vendor'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-10 space-y-10">
                                            {Object.keys(METRICS).map(key => {
                                                const m = METRICS[key];
                                                const score = categoryScores[key] || 0;
                                                return (
                                                    <div key={key} className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg bg-slate-50 ${m.color}`}>
                                                                    <m.icon size={16} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900">{m.label}</p>
                                                                    <p className="text-[10px] text-slate-400 font-medium">Weight: {m.weight * 100}%</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="text-xl font-black text-slate-900">{score}</span>
                                                                <span className="text-[10px] font-bold text-slate-300">/ 10.0</span>
                                                            </div>
                                                        </div>
                                                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ease-out ${m.color.replace('text', 'bg')}`}
                                                                style={{ width: `${score * 10}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-[#0f172a] text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Sparkles size={12} className="text-yellow-400" />
                                                Effective Broker-Fit
                                            </p>
                                            <div className="flex items-baseline gap-2 mb-6">
                                                <h2 className="text-7xl font-black tracking-tighter leading-none">{overallScore}</h2>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Score</p>
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                                This score reflects the vendor's architectural readiness for high-volume brokerage operations.
                                            </p>
                                            <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase">Assessor Integrity</span>
                                                    <CheckCircle2 size={14} className="text-brand-blue" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase">Rubric Alignment</span>
                                                    <CheckCircle2 size={14} className="text-brand-blue" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Badges Earned</h4>
                                            <div className="space-y-3">
                                                {selectedBadges.map(bid => {
                                                    const b = BADGES.find(x => x.id === bid);
                                                    return b ? (
                                                        <div key={bid} className={`p-4 rounded-2xl border-2 flex items-center justify-between group hover:scale-[1.02] transition-all cursor-default ${b.color}`}>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xl">{b.icon}</span>
                                                                <span className="text-xs font-black uppercase tracking-tight">{b.label}</span>
                                                            </div>
                                                            <Award size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    ) : null;
                                                })}
                                                {selectedBadges.length === 0 && (
                                                    <p className="text-xs text-slate-300 italic py-4 text-center border-2 border-dashed border-slate-100 rounded-2xl font-bold">No badges selected</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'resources' ? (
                            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Knowledge Hub</h3>
                                            <p className="text-sm text-slate-500 font-medium italic">Connect external validation material and broker resources</p>
                                        </div>
                                        <button
                                            onClick={() => setLinkedResources([...linkedResources, { title: '', url: '', type: 'guide' }])}
                                            className="px-6 py-3 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                                        >
                                            <Plus size={14} /> Add Resource
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {linkedResources.map((res, i) => (
                                            <div key={i} className="group flex items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:border-brand-blue/30">
                                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-brand-blue group-hover:bg-brand-blue/5 transition-colors">
                                                    <Link2 size={24} />
                                                </div>
                                                <div className="flex-1 grid grid-cols-12 gap-6 items-center">
                                                    <div className="col-span-4">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Title</p>
                                                        <input
                                                            className="w-full bg-transparent border-none focus:ring-2 focus:ring-brand-blue rounded-lg px-2 py-1 text-sm font-bold text-slate-900"
                                                            value={res.title}
                                                            onChange={e => {
                                                                const next = [...linkedResources]; next[i].title = e.target.value; setLinkedResources(next);
                                                            }}
                                                            placeholder="e.g., API Documentation"
                                                        />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">URL</p>
                                                        <input
                                                            className="w-full bg-transparent border-none focus:ring-2 focus:ring-brand-blue rounded-lg px-2 py-1 text-sm font-medium text-slate-500"
                                                            value={res.url}
                                                            onChange={e => {
                                                                const next = [...linkedResources]; next[i].url = e.target.value; setLinkedResources(next);
                                                            }}
                                                            placeholder="https://docs.api.com"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Type</p>
                                                        <select
                                                            className="w-full bg-transparent border-none focus:ring-2 focus:ring-brand-blue rounded-lg px-2 py-1 text-xs font-black uppercase text-slate-700"
                                                            value={res.type}
                                                            onChange={e => {
                                                                const next = [...linkedResources]; next[i].type = e.target.value; setLinkedResources(next);
                                                            }}
                                                        >
                                                            <option value="guide">Guide</option>
                                                            <option value="video">Video</option>
                                                            <option value="docs">Docs</option>
                                                            <option value="pricing">Pricing</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-span-1 flex justify-end">
                                                        <button
                                                            onClick={() => setLinkedResources(linkedResources.filter((_, idx) => idx !== i))}
                                                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {linkedResources.length === 0 && (
                                            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl group cursor-pointer hover:border-brand-blue/30 transition-colors" onClick={() => handleAddResource()}>
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    <Plus size={32} className="text-slate-300 group-hover:text-brand-blue" />
                                                </div>
                                                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No resources linked yet</p>
                                                <p className="text-xs text-slate-400 mt-2 italic font-medium">Click to add technical guides, case studies or pricing sheets</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'faq' ? (
                            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
                                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Product FAQ Editor</h3>
                                            <p className="text-sm text-slate-500 font-medium italic">Answer critical prospective broker questions up-front</p>
                                        </div>
                                        <button
                                            onClick={() => setFaqs([...faqs, { q: '', a: '', category: 'General' }])}
                                            className="px-6 py-3 bg-[#0f172a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                                        >
                                            <Plus size={14} /> Add FAQ Item
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {faqs.map((f, i) => (
                                            <div key={i} className="p-8 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 relative group">
                                                <button
                                                    onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                                                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">The Question</p>
                                                    <input
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-brand-blue"
                                                        placeholder="e.g., Does this software follow the CDR data security standards?"
                                                        value={f.q}
                                                        onChange={e => {
                                                            const next = [...faqs]; next[i].q = e.target.value; setFaqs(next);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Executive Answer</p>
                                                    <textarea
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                                                        placeholder="Provide a concise expert response..."
                                                        rows={4}
                                                        value={f.a}
                                                        onChange={e => {
                                                            const next = [...faqs]; next[i].a = e.target.value; setFaqs(next);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {faqs.length === 0 && (
                                            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                                                <MessageCircle size={48} className="text-slate-200 mx-auto mb-4" />
                                                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No FAQ items created</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'publish' ? (
                            <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20">
                                <div className="text-center space-y-4">
                                    <div className="w-24 h-24 bg-brand-blue text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-brand-blue/20">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Final Appraisal Ready</h2>
                                    <p className="text-slate-500 max-w-md mx-auto font-medium">Review the calculated benchmarks and metadata before committing to the live marketplace.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center justify-between shadow-xl">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 font-black text-2xl">
                                                {overallScore}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
                                                <p className="text-lg font-bold text-slate-900 underline decoration-brand-blue decoration-4 underline-offset-4">Elite Professional Grade</p>
                                            </div>
                                        </div>
                                        <div className="flex -space-x-3">
                                            {selectedBadges.map(bid => {
                                                const b = BADGES.find(x => x.id === bid);
                                                return b ? (
                                                    <div key={bid} className="w-12 h-12 rounded-full border-4 border-white bg-slate-50 shadow-lg flex items-center justify-center text-xl" title={b.label}>
                                                        {b.icon}
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>

                                    <div className="bg-[#0f172a] rounded-3xl p-10 text-white space-y-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-3xl -mr-32 -mt-32" />
                                        <div className="flex items-center justify-between relative z-10">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Visibility Settings</h4>
                                            <div className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Globe size={12} /> Live Sync Enabled
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 relative z-10">
                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                                <p className="text-[10px] font-black text-slate-500 uppercase">Assessment Meta</p>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-slate-400 italic">Stage 2 Benchmark</span>
                                                        <span className="text-xs font-bold text-brand-blue">COMPLETE</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-slate-400 italic">Audit Status</span>
                                                        <span className={`text-xs font-bold ${featureAuditInProgress ? 'text-orange-400' : 'text-green-400'}`}>{featureAuditInProgress ? 'PENDING' : 'VERIFIED'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                                <p className="text-[10px] font-black text-slate-500 uppercase">Publish Toggle</p>
                                                <div className="space-y-3">
                                                    <PublishToggle section="mapping" />
                                                    <PublishToggle section="scores" />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSave(true)}
                                            disabled={isSaving}
                                            className="w-full py-5 bg-brand-blue text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-blue/40 transform active:scale-[0.98] transition-all hover:bg-blue-500 flex items-center justify-center gap-3 relative z-10"
                                        >
                                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap size={20} className="fill-current" />}
                                            Finalise & Push Live to Marketplace
                                        </button>
                                        <p className="text-[10px] text-center text-slate-500 font-medium italic relative z-10">
                                            Verification ID: {application?.id?.toString().toUpperCase()} • By Clicking Push Live you certify the data is human-verified.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null}
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
                            <p className="text-sm font-semibold text-slate-900 uppercase tracking-tight">
                                {activeTab === 'categorise' && 'Stage 1: Mapping'}
                                {activeTab === 'assessment' && 'Stage 2: Appraisal'}
                                {activeTab === 'results' && 'Stage 3: Verified Scoring'}
                                {activeTab === 'resources' && 'Stage 4: Knowledge Hub'}
                                {activeTab === 'faq' && 'Stage 5: FAQ Sync'}
                                {activeTab === 'publish' && 'Stage 6: Final Commitment'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleSave(false)}
                            disabled={isSaving}
                            className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save as Draft
                        </button>
                        <button
                            onClick={() => {
                                const tabs = ['categorise', 'assessment', 'results', 'resources', 'faq', 'publish'];
                                const currentIndex = tabs.indexOf(activeTab);
                                if (currentIndex < tabs.length - 1) {
                                    setActiveTab(tabs[currentIndex + 1]);
                                } else {
                                    handleSave(true);
                                }
                            }}
                            disabled={isSaving}
                            className="px-12 py-3 bg-[#132847] text-white rounded-xl text-sm font-semibold shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                        >
                            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {activeTab === 'publish' ? 'Finalise Assessment' : 'Proceed to Next Stage'}
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationAssessment;
