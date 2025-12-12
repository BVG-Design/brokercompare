import React, { useState } from 'react';
import { Star, Check, X, ArrowRight, ChevronDown, ChevronUp, HelpCircle, Building2, Briefcase, UserCheck, Shield } from 'lucide-react';

interface DetailedProduct {
  name: string;
  domain: string;
  logoLetter: string;
  rating: number;
  reviewCount: number;
  entryPrice: string;
  topFeatures: string[];
  alternativesCount: number;
  faqCount: number;
  integrations: string[];
  serviceAreas: string[];
  useability: {
    easeOfUse: number;
    setup: number;
    support: number;
  };
  lovedBy: {
    mortgage: boolean;
    asset: boolean;
    commercial: boolean;
    support: boolean;
    coaches: boolean;
    other: boolean;
  };
  editorNotes: string;
  faqs: { question: string; answer: string }[];
  alternatives: string[];
  isCurrent?: boolean;
}

const ComparisonTable: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [expandedAlts, setExpandedAlts] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const toggleAlts = (productName: string) => {
    setExpandedAlts(expandedAlts === productName ? null : productName);
  };

  const products: DetailedProduct[] = [
    {
      name: "ClickUp",
      domain: "clickup.com",
      logoLetter: "N",
      rating: 4.7,
      reviewCount: 8542,
      entryPrice: "Free Forever",
      topFeatures: ["Native Time Tracking", "Sprint Management", "Custom Views"],
      alternativesCount: 12,
      faqCount: 8,
      integrations: ["slack.com", "github.com", "gitlab.com", "dropbox.com"],
      serviceAreas: ["Project Management", "Product Development", "Remote Work", "Marketing"],
      useability: { easeOfUse: 8.9, setup: 8.2, support: 8.9 },
      lovedBy: { mortgage: true, asset: true, commercial: true, support: true, coaches: true, other: true },
      editorNotes: "ClickUp is the 'one app to replace them all'. It's incredibly robust but can have a steeper learning curve due to the sheer number of features.",
      faqs: [
        { question: "Is ClickUp really free?", answer: "Yes, ClickUp offers a 'Free Forever' plan that includes unlimited tasks and members, making it very generous compared to competitors." },
        { question: "Can I use it for CRM?", answer: "Yes, ClickUp has flexible custom fields and views that allow it to function effectively as a CRM for many businesses." },
        { question: "Does it support Agile?", answer: "ClickUp was built with Agile in mind, featuring native Sprints, Points, and Burndown charts." }
      ],
      alternatives: ["Monday.com", "Asana", "Trello", "Jira", "Notion"],
      isCurrent: true
    },
    {
      name: "Monday.com",
      domain: "monday.com",
      logoLetter: "M",
      rating: 4.6,
      reviewCount: 5120,
      entryPrice: "$9/seat/mo",
      topFeatures: ["Visual Project Tracking", "Automations", "Dashboards"],
      alternativesCount: 8,
      faqCount: 5,
      integrations: ["slack.com", "zendesk.com", "shopify.com", "salesforce.com"],
      serviceAreas: ["Work Management", "CRM", "Marketing", "Creative"],
      useability: { easeOfUse: 9.1, setup: 9.0, support: 8.8 },
      lovedBy: { mortgage: false, asset: true, commercial: false, support: true, coaches: true, other: true },
      editorNotes: "Monday.com excels in visual project management. It's colorful, intuitive, and great for teams that want to get up and running quickly.",
      faqs: [
        { question: "Is Monday.com good for developers?", answer: "It has good integrations, but dedicated dev teams often prefer tools like Jira or ClickUp for deeper code-related features." },
        { question: "What is the pricing model?", answer: "Monday.com charges per seat with a minimum seat count (usually 3), which can make it pricier for very small teams." },
        { question: "Does it have a free plan?", answer: "Yes, but it is more limited than ClickUp's, restricted to 2 seats." }
      ],
      alternatives: ["ClickUp", "Asana", "Smartsheet", "Wrike"]
    },
    {
      name: "HubSpot",
      domain: "hubspot.com",
      logoLetter: "H",
      rating: 4.5,
      reviewCount: 14213,
      entryPrice: "Free Tools",
      topFeatures: ["CRM Database", "Email Marketing", "Ad Management"],
      alternativesCount: 15,
      faqCount: 10,
      integrations: ["gmail.com", "outlook.com", "wordpress.com", "salesforce.com"],
      serviceAreas: ["Inbound Marketing", "Sales CRM", "Service Hub", "CMS"],
      useability: { easeOfUse: 8.6, setup: 8.1, support: 8.7 },
      lovedBy: { mortgage: true, asset: false, commercial: true, support: true, coaches: false, other: true },
      editorNotes: "HubSpot is a powerhouse for Marketing and Sales. While it has project management features, its core strength lies in customer relationship management.",
      faqs: [
        { question: "Is HubSpot just a CRM?", answer: "No, it's a full customer platform with Marketing, Sales, Service, Operations, and CMS hubs." },
        { question: "Is it expensive?", answer: "The starter plans are affordable, but costs can scale significantly as you add advanced features and contacts." },
        { question: "Can it replace ClickUp?", answer: "For marketing/sales tasks, yes. For general project management, it might lack the depth of dedicated tools." }
      ],
      alternatives: ["Salesforce", "Marketo", "Pipedrive", "ActiveCampaign"]
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9.0) return "text-green-600 bg-green-50 ring-green-100";
    if (score >= 8.0) return "text-blue-600 bg-blue-50 ring-blue-100";
    return "text-orange-600 bg-orange-50 ring-orange-100";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mb-20">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
         <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Compare Alternatives</h2>
            <p className="text-sm text-gray-500">Detailed comparison of top market leaders</p>
         </div>
         <button className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            More Comparisons <ArrowRight size={16} />
         </button>
      </div>

      <div className="flex flex-col gap-12">
        
        {/* 1. Overview Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-purple-100 p-1.5 rounded-md"><Briefcase size={16} className="text-purple-600"/></div>
             <h3 className="font-bold text-gray-900">Overview</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-4 w-1/4"></th>
                    {products.map((p) => (
                      <th key={p.name} className="p-4 align-top w-1/4">
                        <div className="flex flex-col items-center">
                          <img 
                            src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=64`} 
                            alt={p.name}
                            className="w-10 h-10 mb-2 rounded shadow-sm"
                          />
                          <span className="font-bold text-gray-900 text-base">{p.name}</span>
                          {p.isCurrent && <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full mt-1">Your Selection</span>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Ratings */}
                  <tr>
                    <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Ratings</td>
                    {products.map((p) => (
                      <td key={p.name} className="p-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex text-orange-400 gap-0.5">
                            {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= Math.round(p.rating) ? "currentColor" : "none"} className={i > Math.round(p.rating) ? "text-gray-300" : ""} />)}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{p.rating} <span className="text-xs font-normal text-gray-500">/ 5</span></span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Features */}
                  <tr>
                    <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Top Features</td>
                    {products.map((p) => (
                      <td key={p.name} className="p-4">
                        <div className="flex flex-col gap-2 items-center">
                          {p.topFeatures.map(f => (
                            <div key={f} className="flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 w-full justify-center">
                              <Check size={10} className="text-green-500" /> {f}
                            </div>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {/* Pricing */}
                  <tr>
                    <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Pricing (Entry)</td>
                    {products.map((p) => (
                      <td key={p.name} className="p-4 text-center text-sm font-semibold text-gray-900">
                        {p.entryPrice}
                      </td>
                    ))}
                  </tr>
                  {/* Alternatives Count */}
                  <tr>
                    <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">Alternatives</td>
                    {products.map((p) => (
                      <td key={p.name} className="p-4 text-center">
                        <a href="#" className="text-xs font-medium text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          View {p.alternativesCount} Alternatives
                        </a>
                      </td>
                    ))}
                  </tr>
                  {/* FAQs Count */}
                  <tr>
                    <td className="p-4 text-sm font-medium text-gray-600 bg-gray-50/30">FAQs</td>
                    {products.map((p) => (
                      <td key={p.name} className="p-4 text-center">
                        <a href="#" className="text-xs font-medium text-gray-600 hover:underline hover:text-gray-900">
                          {p.faqCount} Questions
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 2. Integrates With */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-blue-100 p-1.5 rounded-md"><ArrowRight size={16} className="text-blue-600"/></div>
             <h3 className="font-bold text-gray-900">Integrates With</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.name} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">{p.name} Integrations</h4>
                <div className="flex justify-center gap-4">
                  {p.integrations.map(domain => (
                    <img 
                      key={domain}
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                      alt={domain}
                      className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity"
                      title={domain}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Service Areas */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-green-100 p-1.5 rounded-md"><Building2 size={16} className="text-green-600"/></div>
             <h3 className="font-bold text-gray-900">Service Areas</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-4 bg-gray-50/50 flex items-center text-sm font-medium text-gray-600">
                  Best suited for...
                </div>
                {products.map(p => (
                  <div key={p.name} className="p-6">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {p.serviceAreas.map(area => (
                        <span key={area} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200 font-medium">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* 4. Useability Score */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-orange-100 p-1.5 rounded-md"><UserCheck size={16} className="text-orange-600"/></div>
             <h3 className="font-bold text-gray-900">Useability Score</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[600px]">
                 <thead>
                    <tr className="bg-gray-50/50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                       <th className="px-6 py-4">Metric</th>
                       {products.map(p => <th key={p.name} className="px-6 py-4 text-center">{p.name}</th>)}
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    {['Ease of Use', 'Ease of Setup', 'Quality of Support'].map((metric, idx) => {
                      const key = idx === 0 ? 'easeOfUse' : idx === 1 ? 'setup' : 'support';
                      return (
                        <tr key={metric}>
                           <td className="px-6 py-4 text-sm font-medium text-gray-700">{metric}</td>
                           {products.map(p => {
                             // @ts-ignore
                             const score = p.useability[key];
                             const colorClass = getScoreColor(score);
                             return (
                               <td key={p.name} className="px-6 py-4 text-center">
                                  <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ring-4 ring-opacity-50 ${colorClass}`}>
                                    {score}
                                  </span>
                               </td>
                             );
                           })}
                        </tr>
                      );
                    })}
                 </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 5. Loved By */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-red-100 p-1.5 rounded-md"><Shield size={16} className="text-red-600"/></div>
             <h3 className="font-bold text-gray-900">Loved By</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[700px]">
                   <thead>
                      <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                         <th className="px-6 py-4 text-left">Category</th>
                         {products.map(p => <th key={p.name} className="px-6 py-4 text-center">{p.name}</th>)}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {[
                        { label: 'Mortgage Brokers', key: 'mortgage' },
                        { label: 'Asset Brokers', key: 'asset' },
                        { label: 'Commercial Brokers', key: 'commercial' },
                        { label: 'Broker Support', key: 'support' },
                        { label: 'Broker Coaches', key: 'coaches' },
                        { label: 'Other', key: 'other' },
                      ].map((item) => (
                        <tr key={item.key}>
                           <td className="px-6 py-3 text-sm text-gray-700 font-medium">{item.label}</td>
                           {products.map(p => (
                             <td key={p.name} className="px-6 py-3 text-center">
                               {/* @ts-ignore */}
                               {p.lovedBy[item.key] ? (
                                 <Check size={18} className="mx-auto text-green-500" strokeWidth={3} />
                               ) : (
                                 <div className="w-2 h-0.5 bg-gray-200 mx-auto rounded"></div>
                               )}
                             </td>
                           ))}
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </section>

        {/* 6. Editor Notes */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-yellow-100 p-1.5 rounded-md"><Star size={16} className="text-yellow-600"/></div>
             <h3 className="font-bold text-gray-900">Editor Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.name} className="bg-yellow-50/50 border border-yellow-100 rounded-xl p-6">
                 <div className="flex items-center gap-2 mb-3">
                   <img src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=32`} alt="" className="w-4 h-4 rounded"/>
                   <span className="text-sm font-bold text-gray-900">{p.name}</span>
                 </div>
                 <p className="text-sm text-gray-700 leading-relaxed italic">
                   "{p.editorNotes}"
                 </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-indigo-100 p-1.5 rounded-md"><HelpCircle size={16} className="text-indigo-600"/></div>
             <h3 className="font-bold text-gray-900">FAQs</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.name} className="space-y-3">
                 <h4 className="font-semibold text-sm text-gray-900 mb-2 border-b border-gray-100 pb-2 flex items-center gap-2">
                   {p.name} Questions
                   <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{p.faqs.length}</span>
                 </h4>
                 {p.faqs.map((faq, i) => {
                   const id = `${p.name}-${i}`;
                   const isOpen = expandedFaq === id;
                   return (
                     <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                       <button 
                         onClick={() => toggleFaq(id)}
                         className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                       >
                         {faq.question}
                         {isOpen ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
                       </button>
                       {isOpen && (
                         <div className="p-3 pt-0 text-xs text-gray-600 leading-relaxed bg-gray-50/50 border-t border-gray-100">
                           {faq.answer}
                         </div>
                       )}
                     </div>
                   )
                 })}
              </div>
            ))}
          </div>
        </section>

        {/* 8. Alternatives */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <h3 className="font-bold text-gray-900">Alternatives</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => {
               const isOpen = expandedAlts === p.name;
               const displayAlts = isOpen ? p.alternatives : p.alternatives.slice(0, 3);
               
               return (
                <div key={p.name} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                   <h4 className="font-semibold text-sm text-gray-900 mb-4 flex items-center gap-2">
                     Alternatives to {p.name}
                   </h4>
                   <ul className="space-y-2 mb-4">
                     {displayAlts.map(alt => (
                       <li key={alt} className="flex items-center gap-2 text-sm text-gray-600 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors group">
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-400"></div>
                         {alt}
                       </li>
                     ))}
                   </ul>
                   {p.alternatives.length > 3 && (
                     <button 
                       onClick={() => toggleAlts(p.name)}
                       className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                     >
                       {isOpen ? 'Show Less' : `View ${p.alternatives.length - 3} More`}
                       {isOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                     </button>
                   )}
                </div>
               );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ComparisonTable;