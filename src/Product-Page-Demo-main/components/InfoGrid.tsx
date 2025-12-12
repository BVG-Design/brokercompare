import React from 'react';
import { ExternalLink, BookOpen, FileText, PlayCircle, Star } from 'lucide-react';

const InfoGrid: React.FC = () => {
  const reviewStats = [
    { stars: 5, percent: 72, count: '6.1k' },
    { stars: 4, percent: 18, count: '1.5k' },
    { stars: 3, percent: 6, count: '512' },
    { stars: 2, percent: 3, count: '256' },
    { stars: 1, percent: 1, count: '85' },
  ];

  const integrations = [
    { name: 'Slack', domain: 'slack.com' },
    { name: 'Google Drive', domain: 'drive.google.com' },
    { name: 'GitHub', domain: 'github.com' },
    { name: 'Zoom', domain: 'zoom.us' },
    { name: 'Figma', domain: 'figma.com' },
    { name: 'Notion', domain: 'notion.so' },
    { name: 'Salesforce', domain: 'salesforce.com' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Main Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About ClickUp</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              ClickUp is an all-in-one productivity platform that serves as a central hub for planning, organizing, and collaborating on work. It provides tasks, docs, goals, chat, and more - all in one app. Perfect for teams of all sizes looking to streamline their workflow.
            </p>

            {/* Editor Notes */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <h3 className="text-blue-900 font-semibold text-sm mb-2">Editor Notes</h3>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                ClickUp stands out for its exceptional flexibility and comprehensive feature set. It's ideal for teams wanting to consolidate multiple tools into one platform.
              </p>
              <div className="flex items-center text-xs text-blue-600 font-medium">
                <span className="w-6 h-0.5 bg-blue-400 mr-2"></span>
                Sarah Chen, Senior Editor
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Resources</h2>
              <span className="text-xs text-gray-400">Curated by our team</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Resource 1 */}
              <a href="#" className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                 <div className="h-24 bg-gray-100 overflow-hidden relative">
                    <img src="https://picsum.photos/300/150?random=1" alt="Guide" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <BookOpen size={20} className="text-white drop-shadow-md" />
                    </div>
                 </div>
                 <div className="p-3 flex flex-col justify-between flex-grow">
                    <span className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                        Getting Started Guide: 2024 Edition
                    </span>
                    <span className="text-[10px] text-gray-500 mt-2 flex items-center">
                        Read Article <ExternalLink size={8} className="ml-1"/>
                    </span>
                 </div>
              </a>

              {/* Resource 2 */}
              <a href="#" className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                 <div className="h-24 bg-gray-100 overflow-hidden relative">
                    <img src="https://picsum.photos/300/150?random=2" alt="Case Study" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <FileText size={20} className="text-white drop-shadow-md" />
                    </div>
                 </div>
                 <div className="p-3 flex flex-col justify-between flex-grow">
                    <span className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                        Case Study: Boosting Productivity by 40%
                    </span>
                    <span className="text-[10px] text-gray-500 mt-2 flex items-center">
                        View Case Study <ExternalLink size={8} className="ml-1"/>
                    </span>
                 </div>
              </a>

              {/* Resource 3 */}
              <a href="#" className="group flex flex-col h-full bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                 <div className="h-24 bg-gray-100 overflow-hidden relative">
                    <img src="https://picsum.photos/300/150?random=3" alt="Webinar" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <PlayCircle size={20} className="text-white drop-shadow-md" />
                    </div>
                 </div>
                 <div className="p-3 flex flex-col justify-between flex-grow">
                    <span className="text-xs font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                        Webinar: Advanced Automations
                    </span>
                    <span className="text-[10px] text-gray-500 mt-2 flex items-center">
                        Watch Now <ExternalLink size={8} className="ml-1"/>
                    </span>
                 </div>
              </a>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8 flex flex-col h-full">
           {/* Integrations */}
           <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                 <h3 className="font-bold text-gray-900">Integrations</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                 {integrations.map(tool => (
                     <div key={tool.name} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-700 hover:border-gray-300 cursor-default transition-colors">
                         <img 
                            src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=32`} 
                            alt={tool.name} 
                            className="w-3.5 h-3.5 rounded-sm object-contain opacity-85"
                            loading="lazy"
                         />
                         {tool.name}
                     </div>
                 ))}
              </div>
           </div>

           {/* User Reviews (Moved from bottom, Replaces Quick Stats) */}
           <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex-grow flex flex-col">
              <h3 className="font-bold text-gray-900 mb-5">User Reviews</h3>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-bold text-gray-900 tracking-tighter leading-none">4.7</span>
                <div className="flex flex-col pb-1">
                    <div className="flex gap-0.5 mb-1">
                        {[1, 2, 3, 4].map(i => <Star key={i} size={14} className="text-orange-400 fill-orange-400" />)}
                        <Star size={14} className="text-orange-400 fill-orange-400" style={{ clipPath: 'inset(0 30% 0 0)' }} />
                    </div>
                    <span className="text-xs text-gray-500">8,542 reviews</span>
                </div>
              </div>

              <div className="space-y-2.5 mb-6 flex-grow">
                 {reviewStats.map((stat) => (
                    <div key={stat.stars} className="flex items-center gap-2">
                         <div className="flex items-center gap-1 w-8">
                             <span className="text-xs font-semibold text-gray-700">{stat.stars}</span>
                             <Star size={8} className="text-gray-300" />
                         </div>
                         <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                             <div className="h-full bg-orange-500 rounded-full" style={{ width: `${stat.percent}%` }}></div>
                         </div>
                         <span className="text-xs text-gray-400 w-8 text-right">{stat.percent}%</span>
                    </div>
                 ))}
              </div>

              <button className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors mt-auto">
                  Write a Review
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InfoGrid;