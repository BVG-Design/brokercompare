import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function FeatureSelector({ 
  availableFeatures, 
  selectedFeatures, 
  onToggleFeature,
  onClearAll,
  matchingCount 
}) {
  if (!availableFeatures?.length) return null;
  
  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Select Features
        </h3>
        {selectedFeatures.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-slate-500"
          >
            Clear All
          </Button>
        )}
      </div>
      
      <p className="text-sm text-slate-600 mb-4">
        Choose the features you need to filter matching tools
      </p>
      
      <div className="space-y-2 mb-6">
        {availableFeatures.map((feature) => {
          const isSelected = selectedFeatures.includes(feature);
          
          return (
            <motion.button
              key={feature}
              whileHover={{ x: 2 }}
              onClick={() => onToggleFeature(feature)}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left",
                isSelected 
                  ? "border-slate-900 bg-slate-900 text-white" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <span className="text-sm font-medium">{feature}</span>
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center",
                isSelected ? "bg-white" : "bg-slate-100"
              )}>
                {isSelected && <Check className="w-3 h-3 text-slate-900" />}
              </div>
            </motion.button>
          );
        })}
      </div>
      
      {selectedFeatures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Matching tools</span>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {matchingCount} found
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedFeatures.map((feature) => (
              <Badge 
                key={feature} 
                variant="secondary"
                className="gap-1 pr-1"
              >
                {feature}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFeature(feature);
                  }}
                  className="ml-1 hover:bg-slate-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}