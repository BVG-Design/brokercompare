import React from 'react';
import { Star, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

const MainCard: React.FC = () => {
  const keyFeatures = [
    "Task Management",
    "Time Tracking",
    "Goal Setting",
    "Document Collaboration",
    "Chat & Messaging",
    "Automations",
    "Custom Fields",
    "Integrations",
    "Reporting"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10 mb-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Icon, Details, Features */}
          <div className="flex-1">
            <div className="flex gap-6">
              {/* Logo Box */}
              <div className="w-20 h-20 bg-black rounded-lg flex-shrink-0 flex items-center justify-center">
                <div className="text-red-500 font-bold text-3xl">N</div>
              </div>

              {/* Title & Badges */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">ClickUp</h1>
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded border border-orange-200 font-medium">🥇 Leader</span>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded border border-yellow-200 font-medium">⚡ High Performer</span>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded border border-purple-200 font-medium">🏆 Momentum Leader</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <div className="flex text-orange-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" className="text-gray-300" style={{ clipPath: 'inset(0 30% 0 0)' }} />
                  </div>
                  <span className="font-bold text-gray-900">4.7</span>
                  <span className="text-gray-500">(8542 reviews)</span>
                  <span className="text-gray-300">|</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Project Management</span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  ClickUp is an all-in-one productivity platform that serves as a central hub for planning, organizing, and collaborating on work. It provides tasks, docs, goals, chat, and more - all in one app. Perfect for teams of all sizes looking to streamline their workflow.
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
                    Visit Website
                    <ExternalLink size={14} />
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-md font-medium text-sm transition-colors">
                    Compare
                  </button>
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
                    <ShieldCheck size={14} />
                    Write Review
                  </button>
                </div>

                {/* MOVED KEY FEATURES HERE as requested */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                   <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features</h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                      {keyFeatures.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={14} className="text-orange-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Meta */}
          <div className="w-full lg:w-72 bg-gray-50 rounded-lg p-5 border border-gray-100 h-fit">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Pricing</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Freemium</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold text-gray-900">$0 - $29</span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
              <p className="text-xs text-gray-500 leading-snug">
                Free tier available with unlimited tasks. Paid plans start at $7/user/month.
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Service Areas</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">North America</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">Europe</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">Asia Pacific</span>
                <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">Global</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">Broker Type</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded text-xs">Enterprise</span>
                <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded text-xs">SMB</span>
                <span className="px-2 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded text-xs">Startup</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MainCard;