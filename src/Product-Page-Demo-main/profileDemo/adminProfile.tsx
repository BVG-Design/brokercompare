import React, { useState } from 'react';
import { Search, FileText, ClipboardList, Mail, Star, ExternalLink, Trash2, Users, ShieldCheck, ShieldAlert } from 'lucide-react';

interface AdminDashboardProps {
  onToggleTraining?: () => void;
  isEnabled?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onToggleTraining, isEnabled }) => {
  const [activeTab, setActiveTab] = useState('Directory Listings');

  const stats = [
    { label: 'Total Directory Listings', value: '1', sub: '1 approved', icon: <FileText className="text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending Applications', value: '0', sub: '1 total applications', icon: <ClipboardList className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'New Leads', value: '1', sub: '1 total leads', icon: <Mail className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'Pending Reviews', value: '1', sub: '2 total reviews', icon: <Star className="text-yellow-600" />, bg: 'bg-yellow-50' }
  ];

  const tabs = ['Directory Listings', 'Applications', 'Leads', 'Reviews', 'Analytics'];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Banner */}
      <div className="bg-[#1e3a5f] pt-12 pb-16 px-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100/80">Manage directory listings, applications, leads, reviews, and content</p>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-2">{s.label}</p>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
              <div className={`${s.bg} p-3 rounded-lg`}>
                {s.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-900">Directory Listings (1)</h2>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search vendors..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
            </select>
          </div>

          {/* Listing Item */}
          <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1e293b] rounded-lg flex items-center justify-center p-2">
                   <img src="https://www.google.com/s2/favicons?domain=clickup.com&sz=64" alt="ClickUp" className="w-8 h-8 rounded" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Test Deal Creation</h3>
                  <p className="text-sm text-gray-500">katey.shaw@bearventuregroup.com</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <select className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700">
                      <option>Approved</option>
                      <option>Pending</option>
                    </select>
                    <select className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs font-semibold text-gray-700">
                      <option>Premium</option>
                      <option>Basic</option>
                    </select>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200">2 categories</span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200">21 views</span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200">1 leads</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 self-start lg:self-center">
                {/* ADMIN ENABLE TOGGLE */}
                <button 
                  onClick={onToggleTraining}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isEnabled ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}
                >
                  {isEnabled ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                  {isEnabled ? 'Training Materials: Public' : 'Training Materials: Hidden'}
                </button>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                    <Users size={16} /> Relationships
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <ExternalLink size={18} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;