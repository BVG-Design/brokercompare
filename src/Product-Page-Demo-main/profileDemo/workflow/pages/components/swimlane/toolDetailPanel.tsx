import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ExternalLink, Check, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const categoryColors = {
  people: "bg-amber-500",
  software: "bg-blue-500",
  process: "bg-violet-500",
  services: "bg-emerald-500"
};

export default function ToolDetailPanel({ tool, onClose, onCompare }) {
  if (!tool) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {tool.logo_url ? (
                  <img 
                    src={tool.logo_url} 
                    alt={tool.name}
                    className="w-16 h-16 rounded-2xl object-contain bg-slate-50 p-2"
                  />
                ) : (
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold",
                    categoryColors[tool.category]
                  )}>
                    {tool.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{tool.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="capitalize">
                      {tool.category}
                    </Badge>
                    {tool.type && (
                      <Badge variant="outline" className="capitalize">
                        {tool.type.replace(/_/g, ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              {tool.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{tool.rating}</span>
                  <span className="text-slate-500 text-sm">/ 5</span>
                </div>
              )}
              {tool.pricing && (
                <div className="flex items-center gap-1 text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">{tool.pricing}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {tool.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">About</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{tool.description}</p>
            </div>
          )}
          
          {/* Features */}
          {tool.features?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Key Features</h3>
              <div className="space-y-2">
                {tool.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Separator />
          
          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-4">
            {tool.pros?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-emerald-700 mb-2">Pros</h3>
                <ul className="space-y-1.5">
                  {tool.pros.map((pro, index) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tool.cons?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 mb-2">Cons</h3>
                <ul className="space-y-1.5">
                  {tool.cons.map((con, index) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onCompare?.(tool)}
            >
              Add to Compare
            </Button>
            {tool.website_url && (
              <Button className="flex-1" asChild>
                <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                  Visit Website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}