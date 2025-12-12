import React from 'react';
import { Search, X, Star } from 'lucide-react';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const suggestions = [
    { name: "Adobe Marketo Engage", rating: 4.1, reviews: "3,052", domain: "marketo.com", logoColor: "bg-red-600" },
    { name: "Salesforce Marketing Cloud", rating: 4.0, reviews: "2,404", domain: "salesforce.com", logoColor: "bg-blue-500" },
    { name: "ActiveCampaign", rating: 4.5, reviews: "14,468", domain: "activecampaign.com", logoColor: "bg-blue-600" },
    { name: "Asana", rating: 4.4, reviews: "12,705", domain: "asana.com", logoColor: "bg-pink-500" },
    { name: "Act-On", rating: 4.1, reviews: "1,051", domain: "act-on.com", logoColor: "bg-indigo-600" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add more products</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 pb-2">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search for Software and Services" 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoFocus
                />
            </div>
        </div>

        {/* Suggestions List */}
        <div className="p-6 pt-2">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Suggested Products</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {suggestions.map((product) => (
                    <div key={product.name} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                                <img 
                                    src={`https://www.google.com/s2/favicons?domain=${product.domain}&sz=64`} 
                                    alt={product.name}
                                    className="w-8 h-8 object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm md:text-base">{product.name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="flex text-orange-500">
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" className="text-gray-300" style={{ clipPath: 'inset(0 80% 0 0)' }} />
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviews})</span>
                                    <span className="text-xs font-medium text-gray-700 ml-1">{product.rating} out of 5</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-[#5932ea] hover:bg-[#4a25d9] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProductSelectionModal;