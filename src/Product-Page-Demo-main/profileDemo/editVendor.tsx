import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Globe, Type, AlignLeft, DollarSign, Puzzle, Video, FileText, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface EditVendorProfileProps {
  onCancel: () => void;
  onSave: (data: any) => void;
  isTrainingPublic: boolean;
}

const EditVendorProfile: React.FC<EditVendorProfileProps> = ({ onCancel, onSave, isTrainingPublic }) => {
  const [tagline, setTagline] = useState('All-in-one productivity platform');
  const [description, setDescription] = useState('ClickUp is a central hub for planning, organizing, and collaborating on work.');
  const [website, setWebsite] = useState('https://clickup.com');
  const [pricing, setPricing] = useState('$0 - $29 /mo');
  
  const [features, setFeatures] = useState(['Task Management', 'Time Tracking', 'Automations']);
  const [newFeature, setNewFeature] = useState('');

  const [integrations, setIntegrations] = useState(['Slack', 'Google Drive', 'GitHub']);
  const [newIntegration, setNewIntegration] = useState('');

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

  const addMaterial = () => {
    if (materials.length < 5 && newMaterial.title && newMaterial.link) {
      setMaterials([...materials, newMaterial]);
      setNewMaterial({ title: '', type: 'video', link: '' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Edit Vendor Profile</h2>
          <p className="text-sm text-gray-500">Update your public listing details</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave({ tagline, description, website, pricing, features, integrations, materials })} className="px-6 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center gap-2 shadow-lg shadow-gray-200 transition-all">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Basic Info */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <DollarSign size={14} className="text-gray-400" /> Pricing Structure
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
        </section>

        {/* Features & Integrations */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> Key Features
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
        </section>

        {/* Training Materials - Conditional */}
        <section className="pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Video size={16} className="text-purple-600" /> Training Materials 
              <span className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-2">({materials.length}/5)</span>
            </h3>
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
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
                    <select 
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial({...newMaterial, type: e.target.value as any})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
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
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-500"
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
import { CheckCircle2 } from 'lucide-react';