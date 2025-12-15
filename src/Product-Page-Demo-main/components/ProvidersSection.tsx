import React from 'react';
import { BadgeCheck, Star, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Provider } from '../types';

const ProvidersSection: React.FC = () => {
    const providers: Provider[] = [
        {
            id: 1,
            name: "ProcessPro Consulting",
            rating: 4.8,
            reviewCount: 156,
            description: "Boutique consulting firm focused on productivity tool implementation for mid-sized teams.",
            location: "Austin, TX",
            tags: ["ClickUp Implementation", "Workflow Design", "Team Training"],
            certified: true,
            logoLetter: "P"
        },
        {
            id: 2,
            name: "Accenture",
            rating: 4.5,
            reviewCount: 342,
            description: "Global professional services company specializing in digital transformation and enterprise solutions.",
            location: "Global",
            tags: ["Enterprise Implementation", "Digital Transformation", "Change Management", "+1"],
            certified: true,
            logoLetter: "A"
        },
        {
            id: 3,
            name: "Deloitte Digital",
            rating: 4.6,
            reviewCount: 289,
            description: "Creative digital consultancy delivering human-centered digital experiences and tech.",
            location: "New York, USA",
            tags: ["Strategy Consulting", "System Integration", "Process Optimization"],
            certified: true,
            logoLetter: "D"
        },
        {
            id: 4,
            name: "Workflow Masters",
            rating: 4.9,
            reviewCount: 98,
            description: "Specialized in helping teams automate their modern project management stack.",
            location: "London, UK",
            tags: ["Migration Services", "Custom Dev", "Automation Setup"],
            certified: true,
            logoLetter: "W"
        }
    ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-16">
      <div className="flex justify-between items-end mb-6">
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Service Providers (Implementation)</h2>
            <p className="text-sm text-gray-500">Certified partners to help you implement and optimize</p>
        </div>
        <div className="flex gap-2">
            <button className="w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900">
                <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-900">
                <ChevronRight size={16} />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded text-gray-600 font-bold flex items-center justify-center text-lg">
                        {provider.logoLetter}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <h3 className="font-semibold text-gray-900 text-sm truncate max-w-[120px]">{provider.name}</h3>
                            {provider.certified && <BadgeCheck size={14} className="text-blue-500" />}
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex text-orange-400">
                                <Star size={10} fill="currentColor"/>
                                <Star size={10} fill="currentColor"/>
                                <Star size={10} fill="currentColor"/>
                                <Star size={10} fill="currentColor"/>
                                <Star size={10} fill="currentColor" className="text-gray-300"/>
                            </div>
                            <span className="text-xs text-gray-500">({provider.reviewCount})</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {provider.description}
                </p>

                <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full border border-gray-400"></div>
                    {provider.location}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {provider.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-50 text-gray-600 border border-gray-100 px-2 py-0.5 rounded text-[10px]">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-auto">
                    {provider.certified && (
                         <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-medium mb-3">
                            <BadgeCheck size={10} /> Certified Partner
                        </div>
                    )}
                    <button className="w-full bg-gray-900 text-white py-2 rounded-md text-xs font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                        View Profile <ExternalLink size={12} />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ProvidersSection;