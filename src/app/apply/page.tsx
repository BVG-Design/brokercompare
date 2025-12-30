'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
} from 'lucide-react';

type MaterialType = 'video' | 'pdf' | 'link';

type ApplicationData = {
  tagline: string;
  description: string;
  website: string;
  pricing: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  features: string[];
  newFeature: string;
  integrations: string[];
  newIntegration: string;
  teamSize: string[];
  revenue: string[];
  budgetAmount: string;
  budgetPeriod: 'monthly' | 'yearly' | 'project';
  lookingTo: string[];
  lookingToOther: string;
  notFitFor: string;
  materials: { title: string; type: MaterialType; link: string }[];
  newMaterial: { title: string; type: MaterialType; link: string };
  isTrainingPublic: boolean;
};

type VendorApplication = {
  id: string;
  name: string;
  status: 'draft' | 'submitted';
  data: ApplicationData;
};

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

const buildApplicationData = (overrides: Partial<ApplicationData> = {}): ApplicationData => ({
  tagline: 'All-in-one productivity platform',
  description: 'ClickUp is a central hub for planning, organizing, and collaborating on work.',
  website: 'https://clickup.com',
  pricing: '$0 - $29 /mo',
  firstName: 'Katey',
  lastName: 'Shaw',
  email: 'katey.shaw@bearventuregroup.com',
  phone: '+1 (555) 000-0000',
  features: ['Task Management', 'Time Tracking', 'Automations'],
  newFeature: '',
  integrations: ['Slack', 'Google Drive', 'GitHub'],
  newIntegration: '',
  teamSize: ['small', 'med'],
  revenue: ['15k_30k', '30k_60k'],
  budgetAmount: '500',
  budgetPeriod: 'monthly',
  lookingTo: ['reduce_admin', 'better_reporting'],
  lookingToOther: '',
  notFitFor: 'Solo brokers on a tight budget',
  materials: [
    { title: 'Dashboard Tutorial', type: 'video', link: 'https://youtube.com/...' },
    { title: 'Feature Guide', type: 'pdf', link: 'https://clickup.com/guide.pdf' },
  ],
  newMaterial: { title: '', type: 'video', link: '' },
  isTrainingPublic: true,
  ...overrides,
});

export default function ApplyVendorPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [applications, setApplications] = useState<VendorApplication[]>([
    { id: 'app-1', name: 'Primary profile', status: 'draft', data: buildApplicationData() },
  ]);
  const [selectedAppId, setSelectedAppId] = useState('app-1');

  const selectedApp = useMemo(
    () => applications.find((app) => app.id === selectedAppId) || applications[0],
    [applications, selectedAppId],
  );
  const selectedData = selectedApp?.data;

  const updateAppData = (updater: (data: ApplicationData) => ApplicationData) => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((app) => (app.id === selectedApp.id ? { ...app, data: updater(app.data) } : app)),
    );
  };

  const handleCreateApplication = () => {
    const newId = `app-${Date.now()}`;
    const newApplication: VendorApplication = {
      id: newId,
      name: `Application ${applications.length + 1}`,
      status: 'draft',
      data: buildApplicationData({
        tagline: '',
        description: '',
        website: '',
        pricing: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        features: [],
        integrations: [],
        teamSize: [],
        revenue: [],
        lookingTo: [],
        lookingToOther: '',
        notFitFor: '',
        materials: [],
        budgetAmount: '',
        budgetPeriod: 'monthly',
      }),
    };

    setApplications((prev) => [...prev, newApplication]);
    setSelectedAppId(newId);
    toast({ title: 'New application created', description: 'Fill in the details for this profile.' });
  };

  const handleSubmit = () => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((app) => (app.id === selectedApp.id ? { ...app, status: 'submitted' } : app)),
    );
    toast({
      title: 'Application saved',
      description: `${selectedApp.name} has been captured. You can manage multiple profiles here.`,
    });
    router.push('/dashboard/vendor');
  };

  const toggleArrayValue = (field: 'teamSize' | 'revenue' | 'lookingTo', value: string) => {
    updateAppData((data) => ({
      ...data,
      [field]: data[field].includes(value)
        ? data[field].filter((v) => v !== value)
        : [...data[field], value],
    }));
  };

  const addFeature = () => {
    updateAppData((data) => {
      if (!data.newFeature.trim()) return data;
      return { ...data, features: [...data.features, data.newFeature.trim()], newFeature: '' };
    });
  };

  const addIntegration = () => {
    updateAppData((data) => {
      if (!data.newIntegration.trim()) return data;
      return { ...data, integrations: [...data.integrations, data.newIntegration.trim()], newIntegration: '' };
    });
  };

  const addMaterial = () => {
    updateAppData((data) => {
      if (data.materials.length >= 5 || !data.newMaterial.title || !data.newMaterial.link) return data;
      return {
        ...data,
        materials: [...data.materials, data.newMaterial],
        newMaterial: { title: '', type: 'video', link: '' },
      };
    });
  };

  const handleInput = <K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) => {
    updateAppData((data) => ({ ...data, [key]: value }));
  };

  if (!selectedApp || !selectedData) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1f2937] text-white py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-300 mb-2">Vendor applications</p>
            <h1 className="text-4xl font-bold">Manage your listings</h1>
            <p className="text-gray-300 mt-2 max-w-2xl">
              Keep the full VendorApply experience while supporting multiple applications or profiles per vendor.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              onClick={handleCreateApplication}
            >
              <CopyPlus className="w-4 h-4 mr-2" /> New application
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSubmit}>
              <Save className="w-4 h-4 mr-2" /> Save &amp; continue
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Layers className="text-[#132847]" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Applications</p>
                <p className="text-xs text-gray-500">Switch profiles or start another application.</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleCreateApplication} className="border-dashed">
              <Plus className="w-4 h-4 mr-2" />
              Add another profile
            </Button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`px-4 py-3 rounded-xl border transition-all text-left ${
                  selectedAppId === app.id
                    ? 'bg-[#132847] text-white border-[#132847] shadow-lg shadow-gray-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{app.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      app.status === 'submitted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  {app.status === 'submitted' ? 'Awaiting review' : 'Draft in progress'}
                </p>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Rename selected</label>
            <input
              value={selectedApp.name}
              onChange={(e) =>
                setApplications((prev) =>
                  prev.map((app) => (app.id === selectedApp.id ? { ...app, name: e.target.value } : app)),
                )
              }
              className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Profile name"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Vendor Application ({selectedApp.name})</h2>
              <p className="text-sm text-gray-500">Styled with the VendorApply layout</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-2 shadow-lg shadow-gray-200 transition-all"
              >
                <Save size={16} /> Save Application
              </button>
            </div>
          </div>

          <div className="p-8 space-y-10">
            <section>
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Type size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                      <Type size={14} className="text-gray-400" /> Tagline
                    </span>
                    <input
                      type="text"
                      value={selectedData.tagline}
                      onChange={(e) => handleInput('tagline', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                      <Globe size={14} className="text-gray-400" /> Website Link
                    </span>
                    <input
                      type="url"
                      value={selectedData.website}
                      onChange={(e) => handleInput('website', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                      <Tag size={14} className="text-gray-400" /> Pricing Structure
                    </span>
                    <input
                      type="text"
                      value={selectedData.pricing}
                      onChange={(e) => handleInput('pricing', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <AlignLeft size={14} className="text-gray-400" /> Description
                  </span>
                  <textarea
                    rows={8}
                    value={selectedData.description}
                    onChange={(e) => handleInput('description', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                  />
                </label>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <User size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Contact Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <label className="block">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <User size={14} className="text-gray-400" /> First Name
                  </span>
                  <input
                    type="text"
                    value={selectedData.firstName}
                    onChange={(e) => handleInput('firstName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <User size={14} className="text-gray-400" /> Last Name
                  </span>
                  <input
                    type="text"
                    value={selectedData.lastName}
                    onChange={(e) => handleInput('lastName', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <Mail size={14} className="text-gray-400" /> Email
                  </span>
                  <input
                    type="email"
                    value={selectedData.email}
                    onChange={(e) => handleInput('email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                    <Phone size={14} className="text-gray-400" /> Phone
                  </span>
                  <input
                    type="tel"
                    value={selectedData.phone}
                    onChange={(e) => handleInput('phone', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                  />
                </label>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Puzzle size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Product Highlights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check size={16} className="text-green-500" /> Key Features
                  </h3>
                  <div className="space-y-2 mb-4">
                    {selectedData.features.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group"
                      >
                        <span className="text-sm text-gray-700">{f}</span>
                        <button
                          onClick={() =>
                            handleInput(
                              'features',
                              selectedData.features.filter((_, idx) => idx !== i),
                            )
                          }
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add feature..."
                      value={selectedData.newFeature}
                      onChange={(e) => handleInput('newFeature', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={addFeature}
                      className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Puzzle size={16} className="text-blue-500" /> Integrations
                  </h3>
                  <div className="space-y-2 mb-4">
                    {selectedData.integrations.map((n, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group"
                      >
                        <span className="text-sm text-gray-700">{n}</span>
                        <button
                          onClick={() =>
                            handleInput(
                              'integrations',
                              selectedData.integrations.filter((_, idx) => idx !== i),
                            )
                          }
                          className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add integration..."
                      value={selectedData.newIntegration}
                      onChange={(e) => handleInput('newIntegration', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addIntegration()}
                      className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={addIntegration}
                      className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Target size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Product Market Fit</h3>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                      <Users size={12} /> Best suited for: Team Size
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TEAM_SIZE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleArrayValue('teamSize', opt.value)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            selectedData.teamSize.includes(opt.value)
                              ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                      <DollarSign size={12} /> Ideal Customer Revenue
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {REVENUE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleArrayValue('revenue', opt.value)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                            selectedData.revenue.includes(opt.value)
                              ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Ideal Budget</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <DollarSign size={14} />
                        </div>
                        <input
                          type="number"
                          value={selectedData.budgetAmount}
                          onChange={(e) => handleInput('budgetAmount', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                        />
                      </div>
                      <select
                        value={selectedData.budgetPeriod}
                        onChange={(e) => handleInput('budgetPeriod', e.target.value as ApplicationData['budgetPeriod'])}
                        className="w-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="project">Project</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Looking to:</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {LOOKING_TO_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleArrayValue('lookingTo', opt.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${
                          selectedData.lookingTo.includes(opt.value)
                            ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${
                            selectedData.lookingTo.includes(opt.value)
                              ? 'bg-white border-white'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          {selectedData.lookingTo.includes(opt.value) && <Check size={10} className="text-blue-900" />}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedData.lookingTo.includes('other') && (
                  <label className="block">
                    <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Other goals</span>
                    <textarea
                      rows={2}
                      value={selectedData.lookingToOther}
                      onChange={(e) => handleInput('lookingToOther', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Not the right fit for:</span>
                  <textarea
                    rows={2}
                    value={selectedData.notFitFor}
                    onChange={(e) => handleInput('notFitFor', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                  />
                </label>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <Video size={18} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Training Materials</h3>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-bold text-gray-900">
                  Upload Media{' '}
                  <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-2">
                    ({selectedData.materials.length}/5)
                  </span>
                </h4>
                {!selectedData.isTrainingPublic && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg border border-orange-100 text-[10px] font-bold">
                    <AlertCircle size={10} /> Private Mode - Hidden from Public
                  </div>
                )}
              </div>

              {selectedData.isTrainingPublic ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedData.materials.map((m, i) => (
                      <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl relative group">
                        <div className="flex items-start justify-between mb-2">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                            {m.type === 'video' ? (
                              <Video size={14} className="text-purple-500" />
                            ) : m.type === 'pdf' ? (
                              <FileText size={14} className="text-red-500" />
                            ) : (
                              <LinkIcon size={14} className="text-blue-500" />
                            )}
                          </div>
                          <button
                            onClick={() =>
                              handleInput(
                                'materials',
                                selectedData.materials.filter((_, idx) => idx !== i),
                              )
                            }
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900 truncate">{m.title}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-1">{m.link}</p>
                      </div>
                    ))}
                    {selectedData.materials.length < 5 && (
                      <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                        <Plus size={24} className="mb-1" />
                        <span className="text-xs font-medium">Add new item below</span>
                      </div>
                    )}
                  </div>

                  {selectedData.materials.length < 5 && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Intro Video"
                          value={selectedData.newMaterial.title}
                          onChange={(e) =>
                            handleInput('newMaterial', { ...selectedData.newMaterial, title: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
                        <select
                          value={selectedData.newMaterial.type}
                          onChange={(e) =>
                            handleInput(
                              'newMaterial',
                              { ...selectedData.newMaterial, type: e.target.value as MaterialType },
                            )
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="video">Video</option>
                          <option value="pdf">PDF</option>
                          <option value="link">Weblink</option>
                        </select>
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Link URL</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={selectedData.newMaterial.link}
                          onChange={(e) =>
                            handleInput('newMaterial', { ...selectedData.newMaterial, link: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <button
                        onClick={addMaterial}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors h-[34px]"
                      >
                        Add Material
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center">
                  <AlertCircle size={32} className="text-gray-300 mb-3" />
                  <p className="text-sm font-semibold text-gray-600">Training Materials section is currently hidden.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Contact your admin to enable public training material visibility.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
