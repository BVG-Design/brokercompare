import React, { useState } from 'react';
import { LayoutDashboard, Mail, UserPlus, BarChart3, TrendingUp, Settings, Eye, Users, Star, MessageSquare, ExternalLink, Edit2, Zap, Library, Plus } from 'lucide-react';
import EditVendorProfile from './EditVendorProfile';

interface VendorDashboardProps {
  onUpgrade: () => void;
  isUpgraded: boolean;
  isTrainingPublic?: boolean;
}

const VendorDashboard: React.FC<VendorDashboardProps> = ({ onUpgrade, isUpgraded, isTrainingPublic = false }) => {
  const [activeView, setActiveView] = useState<'overview' | 'edit'>('overview');

  const sidebarItems = [
    { id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'leads', icon: <Mail size={20} />, label: 'Leads & Inquiries', badge: '1' },
    { id: 'edit', icon: <Edit2 size={20} />, label: 'Edit Profile' },
    { id: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { id: 'upgrade', icon: <TrendingUp size={20} />, label: 'Upgrade Plan' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const stats = [
    { icon: <Eye className="text-blue-500" />, label: "Profile Views", value: '21' },
    { icon: <Mail className="text-emerald-500" />, label: "Total Leads", value: '1' },
    { icon: <Star className="text-yellow-500" />, label: "Avg Rating", value: '5.0' },
    { icon: <MessageSquare className="text-orange-500" />, label: "Reviews", value: '1' }
  ];

  const handleSidebarClick = (id: string) => {
    if (id === 'overview') setActiveView('overview');
    if (id === 'edit') setActiveView('edit');
  };

  const handleSaveProfile = (data: any) => {
    console.log('Profile Saved:', data);
    setActiveView('overview');
    alert('Profile successfully updated!');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 p-6 space-y-8 sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col items-center text-center px-2 py-6 border-b border-gray-100 mb-6">
          <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center p-4 mb-4 shadow-xl border-4 border-white">
             <img src="https://www.google.com/s2/favicons?domain=clickup.com&sz=128" alt="Vendor" className="w-12 h-12 rounded" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Test Deal Creation</h2>
          <div className="flex items-center gap-2 mt-3">
             <span className={`text-[10px] font-bold px-2.5 py-1 rounded shadow-sm ${isUpgraded ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {isUpgraded ? 'premium' : 'basic'}
             </span>
             <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm">approved</span>
          </div>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleSidebarClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${((activeView === 'overview' && item.id === 'overview') || (activeView === 'edit' && item.id === 'edit')) ? 'bg-[#1e293b] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-6">
            <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <ExternalLink size={14} /> View Public Profile
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {activeView === 'overview' ? (
            <>
              {/* Welcome & Stats Row */}
              <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <h1 className="text-base font-bold text-gray-900 mb-6">Welcome back! Here's your performance overview:</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {stats.map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50/50 border border-gray-50 transition-all hover:shadow-md hover:bg-white">
                      <div className="p-3 mb-4 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                        {React.cloneElement(s.icon as React.ReactElement<any>, { size: 28 })}
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
                      <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Training Material Section */}
              {isUpgraded ? (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
                   <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Library size={20} className="text-purple-600" />
                          <h2 className="font-bold text-gray-900">Manage Training Material</h2>
                      </div>
                      <button onClick={() => setActiveView('edit')} className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                        <Plus size={14} /> Add Media
                      </button>
                   </div>
                   <div className="p-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-video bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-2 group relative">
                               <img src={`https://picsum.photos/300/200?random=${i+20}`} className="w-full h-full object-cover rounded opacity-80 group-hover:opacity-100 transition-opacity" />
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setActiveView('edit')} className="bg-white/90 backdrop-blur shadow-md px-3 py-1 rounded-full text-[10px] font-bold">Edit</button>
                               </div>
                            </div>
                          ))}
                      </div>
                      <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-xs text-purple-700 font-medium flex items-center gap-2">
                          <Zap size={14} /> Your training material is {isTrainingPublic ? 'visible to the public.' : 'pending admin approval before it\'s visible on your profile.'}
                        </p>
                      </div>
                   </div>
                </section>
              ) : (
                <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Unlock Training Materials</h2>
                    <p className="text-purple-100 text-sm max-w-md">
                      Upgrade to Premium to add videos, guides, and interactive training content directly to your public profile.
                    </p>
                  </div>
                  <button 
                    onClick={onUpgrade}
                    className="bg-white text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-xl"
                  >
                    Upgrade Now
                  </button>
                </section>
              )}

              {/* Recent Leads */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                 <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserPlus size={20} className="text-gray-400" />
                        <h2 className="font-bold text-gray-900">Recent Leads</h2>
                    </div>
                    <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">1 New</span>
                 </div>
                 <div className="p-6">
                    <div className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-1 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-sm">Katey Shaw</h3>
                            <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">New</span>
                        </div>
                        <p className="text-xs text-gray-500">katey.shaw@bearventuregroup.com</p>
                        <p className="text-xs text-gray-500 mt-2">details</p>
                        <p className="text-[10px] text-gray-400 mt-3 font-medium tracking-tight">07/11/2025</p>
                    </div>
                 </div>
              </section>

              {/* Quick Actions */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8">
                  <h2 className="font-bold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <button onClick={() => setActiveView('edit')} className="flex flex-col items-center gap-4 p-8 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                          <Edit2 size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold text-gray-900">Edit Profile</span>
                      </button>
                      <button className="flex flex-col items-center gap-4 p-8 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                          <BarChart3 size={24} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold text-gray-900">View Analytics</span>
                      </button>
                      <button className="flex flex-col items-center gap-4 p-8 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                          <Zap size={24} className="text-orange-500 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold text-gray-900">Upgrade Plan</span>
                      </button>
                  </div>
              </section>
            </>
          ) : (
            <EditVendorProfile 
              onCancel={() => setActiveView('overview')} 
              onSave={handleSaveProfile}
              isTrainingPublic={isTrainingPublic}
            />
          )}

        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;