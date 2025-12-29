
import React from 'react';
// Added ExternalLink to imports
import { LayoutDashboard, Mail, Package, Users, BookOpen, Handshake, TrendingUp, Settings, Star, Award, ThumbsUp, UserCheck, ChevronRight, ExternalLink } from 'lucide-react';

const BrokerDashboard: React.FC = () => {
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <Mail size={20} />, label: 'Inbox', badge: '1' },
    { icon: <Package size={20} />, label: 'Products' },
    { icon: <Users size={20} />, label: 'Services' },
    { icon: <BookOpen size={20} />, label: 'Resources' },
    { icon: <Handshake size={20} />, label: 'Partnerships' },
    { icon: <TrendingUp size={20} />, label: 'Growth Tracker' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  const stats = [
    { icon: <Mail className="text-blue-500" />, label: "You've written", value: '0', sub: 'reviews' },
    { icon: <Award className="text-emerald-500" />, label: "You've earned", value: '1', sub: 'badge' },
    { icon: <ThumbsUp className="text-orange-500" />, label: "You've answered", value: '0', sub: 'questions' },
    { icon: <Star className="text-yellow-500" />, label: "Referrals", value: '0', sub: "You've made" }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 space-y-8 sticky top-0 h-screen overflow-y-auto">
        <div className="flex flex-col items-center text-center px-2 py-4 border-b border-gray-100 mb-6">
          <div className="w-20 h-20 bg-[#1e293b] rounded-full flex items-center justify-center p-4 mb-4 shadow-lg">
             <img src="https://www.google.com/s2/favicons?domain=clickup.com&sz=128" alt="Profile" className="w-12 h-12 rounded" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Katey Shaw</h2>
          <p className="text-xs text-gray-400 mt-1">Member since 2025</p>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item, idx) => (
            <a 
              key={idx} 
              href="#" 
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-[#1e293b] text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Welcome & Stats */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h1 className="text-lg font-bold text-gray-900 mb-6">Welcome back, Katey Shaw! Check out your current stats:</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50/50 border border-gray-50 transition-transform hover:scale-[1.02]">
                  <div className="p-3 mb-4 rounded-xl bg-white shadow-sm">
                    {/* Fix: Use React.cloneElement with generic props to allow 'size' on icon elements */}
                    {React.cloneElement(s.icon as React.ReactElement<any>, { size: 28 })}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{s.sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Inbox */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Mail size={20} className="text-gray-400" />
                    <h2 className="font-bold text-gray-900">Inbox</h2>
                </div>
                <button className="text-xs font-bold text-gray-900 hover:underline">View All</button>
             </div>
             <div className="p-6">
                <div className="p-6 bg-white border border-gray-100 rounded-2xl flex flex-col gap-1 relative pl-12 shadow-sm">
                    <div className="absolute left-6 top-8 w-2 h-2 rounded-full bg-orange-600"></div>
                    <h3 className="font-bold text-[#1e3a5f] text-sm">Response from Test Deal Creation</h3>
                    <p className="text-xs text-gray-500">details</p>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium tracking-tight">07/11/2025</p>
                </div>
             </div>
          </section>

          {/* Shortlist */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star size={20} className="text-gray-400" />
                    <h2 className="font-bold text-gray-900">Your Shortlist (1)</h2>
                </div>
                <button className="text-xs font-bold text-gray-900 hover:underline border border-gray-200 px-3 py-1 rounded-lg">View All</button>
             </div>
             <div className="p-6">
                <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                    <span className="font-bold text-sm text-gray-900">Test Deal Creation</span>
                    <button className="p-2 text-gray-400 hover:text-gray-900"><ExternalLink size={16} /></button>
                </div>
             </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default BrokerDashboard;