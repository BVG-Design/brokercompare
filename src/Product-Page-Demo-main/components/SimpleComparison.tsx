import React from 'react';
import { Check, X, ArrowRight, Minus } from 'lucide-react';

interface SimpleComparisonProps {
    onNavigate: () => void;
}

const SimpleComparison: React.FC<SimpleComparisonProps> = ({ onNavigate }) => {
  const products = [
    { name: 'ClickUp', logo: 'N', price: 'Free', rating: '4.7', primary: true },
    { name: 'Monday.com', logo: 'M', price: '$9', rating: '4.6', primary: false },
    { name: 'Asana', logo: 'A', price: '$10.99', rating: '4.5', primary: false },
  ];

  const features = [
    { name: 'Task Management', clickup: true, monday: true, asana: true },
    { name: 'Time Tracking', clickup: true, monday: true, asana: false },
    { name: 'Goal Setting', clickup: true, monday: false, asana: false },
    { name: 'Document Collab', clickup: true, monday: false, asana: false },
    { name: 'Chat & Messaging', clickup: true, monday: false, asana: false },
    { name: 'Automations', clickup: true, monday: true, asana: false },
    { name: 'Custom Fields', clickup: true, monday: false, asana: false },
    { name: 'Integrations', clickup: true, monday: true, asana: false },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 mb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Compare Alternatives</h2>
            <p className="text-sm text-gray-500">See how ClickUp stacks up against the competition</p>
        </div>
        <button 
            onClick={onNavigate}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
            More Comparisons <ArrowRight size={16} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
                <thead>
                    <tr>
                        <th className="p-4 text-left w-1/4">Features</th>
                        {products.map(p => (
                            <th key={p.name} className="p-4 w-1/4 pb-6">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg mb-3 shadow-sm ${p.primary ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        {p.logo}
                                    </div>
                                    <span className="font-bold text-gray-900">{p.name}</span>
                                    {p.primary && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1 font-medium">Current</span>}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr className="bg-gray-50/50">
                        <td className="p-4 text-sm font-medium text-gray-900">Rating</td>
                        {products.map(p => (
                            <td key={p.name} className="p-4 text-center">
                                <div className="flex items-center justify-center gap-1 text-sm font-bold text-gray-900">
                                    <span className="text-orange-500">★</span> {p.rating}
                                </div>
                            </td>
                        ))}
                    </tr>
                    <tr className="bg-gray-50/50">
                        <td className="p-4 text-sm font-medium text-gray-900">Starting Price</td>
                        {products.map(p => (
                            <td key={p.name} className="p-4 text-center text-sm text-gray-600">
                                {p.price === 'Free' ? <span className="text-green-600 font-medium">Free</span> : <span>{p.price}<span className="text-xs">/mo</span></span>}
                            </td>
                        ))}
                    </tr>
                    {features.map((feature, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="p-4 text-sm font-medium text-gray-600">{feature.name}</td>
                            <td className="p-4 text-center">
                                {feature.clickup ? <Check size={18} className="mx-auto text-green-500" strokeWidth={2.5}/> : <X size={18} className="mx-auto text-gray-300"/>}
                            </td>
                            <td className="p-4 text-center">
                                {feature.monday ? <Check size={18} className="mx-auto text-green-500" strokeWidth={2.5}/> : <X size={18} className="mx-auto text-gray-300"/>}
                            </td>
                            <td className="p-4 text-center">
                                {feature.asana ? <Check size={18} className="mx-auto text-green-500" strokeWidth={2.5}/> : <X size={18} className="mx-auto text-gray-300"/>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SimpleComparison;