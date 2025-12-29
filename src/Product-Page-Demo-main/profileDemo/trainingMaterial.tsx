import React, { useState } from 'react';
import { Play, ChevronRight, ChevronLeft, Check, X } from 'lucide-react';

interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  title: string;
}

interface TrainingMaterialProps {
  businessName: string;
}

const TrainingMaterial: React.FC<TrainingMaterialProps> = ({ businessName }) => {
  const [activeMedia, setActiveMedia] = useState(0);

  const media: MediaItem[] = [
    { id: 1, type: 'image', url: 'https://picsum.photos/1200/800?random=10', thumbnail: 'https://picsum.photos/300/200?random=10', title: 'Dashboard Overview' },
    { id: 2, type: 'image', url: 'https://picsum.photos/1200/800?random=11', thumbnail: 'https://picsum.photos/300/200?random=11', title: 'Team View' },
    { id: 3, type: 'image', url: 'https://picsum.photos/1200/800?random=12', thumbnail: 'https://picsum.photos/300/200?random=12', title: 'Mobile Interface' },
    { id: 4, type: 'video', url: '#', thumbnail: 'https://picsum.photos/300/200?random=13', title: 'Feature Spotlight' },
    { id: 5, type: 'video', url: '#', thumbnail: 'https://picsum.photos/300/200?random=14', title: 'Success Story' },
    { id: 6, type: 'video', url: '#', thumbnail: 'https://picsum.photos/300/200?random=15', title: 'Getting Started' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{businessName} Training Material</h2>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Main Viewer */}
        <div className="flex-1 relative group">
          <div className="aspect-[16/10] bg-gray-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            <img 
              src={media[activeMedia].url} 
              alt={media[activeMedia].title}
              className="w-full h-full object-cover"
            />
            {media[activeMedia].type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                  <Play size={40} className="text-white fill-white ml-1" />
                </div>
              </div>
            )}
            
            {/* Navigation Arrows */}
            <button 
              onClick={() => setActiveMedia((prev) => (prev > 0 ? prev - 1 : media.length - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setActiveMedia((prev) => (prev < media.length - 1 ? prev + 1 : 0))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="mt-4">
             <h3 className="text-lg font-bold text-gray-900">{media[activeMedia].title}</h3>
          </div>
        </div>

        {/* Thumbnails Grid */}
        <div className="w-full lg:w-[340px] grid grid-cols-2 lg:grid-cols-2 gap-3 h-fit">
          {media.map((item, idx) => (
            <button 
              key={item.id}
              onClick={() => setActiveMedia(idx)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all ${activeMedia === idx ? 'border-orange-500 scale-[1.02] shadow-md' : 'border-transparent hover:border-gray-300'}`}
            >
              <img src={item.thumbnail} alt={item.title} className="w-full aspect-video object-cover" />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-8 h-8 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40">
                    <Play size={16} className="text-white fill-white ml-0.5" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Survey / CTA prompted below as in image */}
      <div className="mt-8 bg-indigo-50/50 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between border border-indigo-100/50">
        <div className="flex items-center gap-6 mb-6 md:mb-0">
          <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center p-3 border border-indigo-100">
             <div className="text-red-500 font-bold text-2xl">N</div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Have you used {businessName} before?</h3>
            <p className="text-gray-600 text-sm">Answer a few questions to help the community.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Check size={20} className="text-indigo-600" /> Yes
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <X size={20} className="text-red-500" /> No
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingMaterial;