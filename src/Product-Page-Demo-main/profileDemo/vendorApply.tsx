import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Globe, Type, AlignLeft, Tag, Puzzle, Video, FileText, Link as LinkIcon, AlertCircle, Target, Users, DollarSign, Check, User, Mail, Phone } from 'lucide-react';

interface EditVendorProfileProps {
  onCancel: () => void;
  onSave: (data: any) => void;
  isTrainingPublic: boolean;
}

const TEAM_SIZE_OPTIONS = [
  { value: 'independent', label: 'independent (1-2)' },
  { value: 'small', label: 'small (3-6)' },
  { value: 'med', label: 'med (7-10)' },
  { value: 'large', label: 'large (10+)' },
];

const REVENUE_OPTIONS = [
  { value: 'under_15k', label: 'Under $15k / month' },
  { value: '15k_30k', label: '$15k – $30k / month' },
  { value: '30k_60k', label: '$30k – $60k / month' },
  { value: '60k_100k', label: '$60k – $100k / month' },
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

const EditVendorProfile: React.FC<EditVendorProfileProps> = ({ onCancel, onSave, isTrainingPublic }) => {
  // Basic Info
  const [tagline, setTagline] = useState('All-in-one productivity platform');
  const [description, setDescription] = useState('ClickUp is a central hub for planning, organizing, and collaborating on work.');
  const [website, setWebsite] = useState('https://clickup.com');
  const [pricing, setPricing] = useState('$0 - $29 /mo');

  // Contact Info
  const [firstName, setFirstName] = useState('Katey');
  const [lastName, setLastName] = useState('Shaw');
  const [email, setEmail] = useState('katey.shaw@bearventuregroup.com');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  
  // Lists
  const [features, setFeatures] = useState(['Task Management', 'Time Tracking', 'Automations']);
  const [newFeature, setNewFeature] = useState('');
  const [integrations, setIntegrations] = useState(['Slack', 'Google Drive', 'GitHub']);
  const [newIntegration, setNewIntegration] = useState('');

  // PMF
  const [teamSize, setTeamSize] = useState(['small', 'med']);
  const [revenue, setRevenue] = useState(['15k_30k', '30k_60k']);
  const [budgetAmount, setBudgetAmount] = useState('500');
  const [budgetPeriod, setBudgetPeriod] = useState('monthly');
  const [lookingTo, setLookingTo] = useState(['reduce_admin', 'better_reporting']);
  const [lookingToOther, setLookingToOther] = useState('');
  const [notFitFor, setNotFitFor] = useState('Solo brokers on a tight budget');

  // Materials
  const [materials, setMaterials] = useState([
    { title: 'Dashboard Tutorial', type: 'video', link: 'https://youtube.com/...' },
    { title: 'Feature Guide', type: 'pdf', link: 'https://clickup.com/guide.pdf' }
  ]);
  const [newMaterial, setNewMaterial] = useState({ title: '', type: 'video', link: '' });

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const addIntegration = () => {
    if (newIntegration.trim()) {
      setIntegrations([...integrations, newIntegration.trim()]);
      setNewIntegration('');
    }
  };

  const toggleArrayValue = (field: 'teamSize' | 'revenue' | 'lookingTo', value: string) => {
    if (field === 'teamSize') setTeamSize(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    if (field === 'revenue') setRevenue(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    if (field === 'lookingTo') setLookingTo(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const addMaterial = () => {
    if (materials.length < 5 && newMaterial.title && newMaterial.link) {
      setMaterials([...materials, newMaterial]);
      setNewMaterial({ title: '', type: 'video', link: '' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Edit Vendor Profile</h2>
          <p className="text-sm text-gray-500">Update your public listing details</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onSave({ tagline, description, website, pricing, firstName, lastName, email, phone, features, integrations, teamSize, revenue, budgetAmount, budgetPeriod, lookingTo, lookingToOther, notFitFor, materials })} 
            className="px-6 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-2 shadow-lg shadow-gray-200 transition-all"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Basic Info */}
        <section>
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
             <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Type size={18}/></div>
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
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <Globe size={14} className="text-gray-400" /> Website Link
                </span>
                <input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <Tag size={14} className="text-gray-400" /> Pricing Structure
                </span>
                <input 
                  type="text" 
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
              />
            </label>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
             <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><User size={18}/></div>
             <h3 className="text-lg font-bold text-gray-900">Contact Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <label className="block">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                <User size={14} className="text-gray-400" /> First Name
              </span>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                <User size={14} className="text-gray-400" /> Last Name
              </span>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                <Mail size={14} className="text-gray-400" /> Email
              </span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                <Phone size={14} className="text-gray-400" /> Phone
              </span>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </label>
          </div>
        </section>

        {/* Product Highlights */}
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
             <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Puzzle size={18}/></div>
             <h3 className="text-lg font-bold text-gray-900">Product Highlights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Check size={16} className="text-green-500" /> Key Features
              </h3>
              <div className="space-y-2 mb-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                    <span className="text-sm text-gray-700">{f}</span>
                    <button onClick={() => setFeatures(features.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button onClick={addFeature} className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Puzzle size={16} className="text-blue-500" /> Integrations
              </h3>
              <div className="space-y-2 mb-4">
                {integrations.map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                    <span className="text-sm text-gray-700">{n}</span>
                    <button onClick={() => setIntegrations(integrations.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add integration..."
                  value={newIntegration}
                  onChange={(e) => setNewIntegration(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addIntegration()}
                  className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button onClick={addIntegration} className="p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Market Fit */}
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
             <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Target size={18}/></div>
             <h3 className="text-lg font-bold text-gray-900">Product Market Fit</h3>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1.5"><Users size={12}/> Best suited for: Team Size</label>
                <div className="flex flex-wrap gap-2">
                  {TEAM_SIZE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleArrayValue('teamSize', opt.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${teamSize.includes(opt.value) ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1.5"><DollarSign size={12}/> Ideal Customer Revenue</label>
                <div className="flex flex-wrap gap-2">
                  {REVENUE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleArrayValue('revenue', opt.value)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${revenue.includes(opt.value) ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
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
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><DollarSign size={14}/></div>
                    <input
                      type="number"
                      value={budgetAmount}
                      onChange={e => setBudgetAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <select
                    value={budgetPeriod}
                    onChange={e => setBudgetPeriod(e.target.value)}
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
                {LOOKING_TO_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleArrayValue('lookingTo', opt.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${lookingTo.includes(opt.value) ? 'bg-blue-900 text-white border-blue-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${lookingTo.includes(opt.value) ? 'bg-white border-white' : 'bg-white border-gray-200'}`}>
                      {lookingTo.includes(opt.value) && <Check size={10} className="text-blue-900" />}
                    </div>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Not the right fit for:</span>
              <textarea 
                rows={2}
                value={notFitFor}
                onChange={(e) => setNotFitFor(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
              />
            </label>
          </div>
        </section>

        {/* Training Materials - Conditional */}
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
             <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Video size={18}/></div>
             <h3 className="text-lg font-bold text-gray-900">Training Materials</h3>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-sm font-bold text-gray-900">
              Uplaod Media <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-2">({materials.length}/5)</span>
            </h4>
            {!isTrainingPublic && (
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg border border-orange-100 text-[10px] font-bold">
                <AlertCircle size={10} /> Private Mode - Hidden from Public
              </div>
            )}
          </div>

          {isTrainingPublic ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((m, i) => (
                  <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl relative group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {m.type === 'video' ? <Video size={14} className="text-purple-500" /> : m.type === 'pdf' ? <FileText size={14} className="text-red-500" /> : <LinkIcon size={14} className="text-blue-500" />}
                      </div>
                      <button onClick={() => setMaterials(materials.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-900 truncate">{m.title}</p>
                    <p className="text-[10px] text-gray-500 truncate mt-1">{m.link}</p>
                  </div>
                ))}
                {materials.length < 5 && (
                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                    <Plus size={24} className="mb-1" />
                    <span className="text-xs font-medium">Add new item below</span>
                  </div>
                )}
              </div>

              {materials.length < 5 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Intro Video"
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
                    <select 
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value as any})}
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
                      value={newMaterial.link}
                      onChange={(e) => setNewMaterial({...newMaterial, link: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <button onClick={addMaterial} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors h-[34px]">
                    Add Material
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center text-center">
              <AlertCircle size={32} className="text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-600">Training Materials section is currently hidden.</p>
              <p className="text-xs text-gray-400 mt-1">Contact your admin to enable public training material visibility.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EditVendorProfile;