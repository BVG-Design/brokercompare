import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Check, Minus, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryColors = {
  people: "bg-amber-500",
  software: "bg-blue-500",
  process: "bg-violet-500",
  services: "bg-emerald-500"
};

export default function CompareDrawer({ tools, onRemove, onClear }) {
  if (!tools?.length) return null;
  
  const maxFeatures = Math.max(...tools.map(t => t.features?.length || 0));
  const allFeatures = [...new Set(tools.flatMap(t => t.features || []))];
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-40 max-h-[60vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-slate-50">
          <div>
            <h3 className="font-semibold text-slate-900">Compare Tools</h3>
            <p className="text-sm text-slate-500">{tools.length} selected</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear All
          </Button>
        </div>
        
        {/* Comparison Grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-max">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-slate-500 w-40 sticky left-0 bg-white">
                    Feature
                  </th>
                  {tools.map((tool) => (
                    <th key={tool.id} className="p-4 min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          {tool.logo_url ? (
                            <img 
                              src={tool.logo_url} 
                              alt={tool.name}
                              className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-1"
                            />
                          ) : (
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                              categoryColors[tool.category]
                            )}>
                              {tool.name.charAt(0)}
                            </div>
                          )}
                          <button
                            onClick={() => onRemove(tool.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-slate-900">{tool.name}</span>
                        <Badge variant="outline" className="capitalize text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Rating Row */}
                <tr className="border-b">
                  <td className="p-4 text-sm font-medium text-slate-600 sticky left-0 bg-white">
                    Rating
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 text-center">
                      {tool.rating ? (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{tool.rating}</span>
                        </div>
                      ) : (
                        <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                
                {/* Pricing Row */}
                <tr className="border-b bg-slate-50">
                  <td className="p-4 text-sm font-medium text-slate-600 sticky left-0 bg-slate-50">
                    Pricing
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 text-center text-sm text-slate-700">
                      {tool.pricing || <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                  ))}
                </tr>
                
                {/* Features Rows */}
                {allFeatures.map((feature, index) => (
                  <tr key={index} className={cn("border-b", index % 2 === 0 ? "bg-white" : "bg-slate-50")}>
                    <td className={cn(
                      "p-4 text-sm text-slate-600 sticky left-0",
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    )}>
                      {feature}
                    </td>
                    {tools.map((tool) => (
                      <td key={tool.id} className="p-4 text-center">
                        {tool.features?.includes(feature) ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}