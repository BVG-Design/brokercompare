import React from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, GripVertical, Check, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryStyles = {
  people: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700"
  },
  software: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700"
  },
  process: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700"
  },
  services: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700"
  }
};

const typeLabels = {
  aggregator: "Aggregator",
  insurance: "Insurance",
  website: "Website",
  accounting: "Accounting",
  crm: "CRM",
  lodgement: "Lodgement",
  compliance: "Compliance",
  marketing: "Marketing",
  communication: "Communication",
  document_management: "Doc Management",
  other: "Other"
};

export default function ContentCard({ 
  tool, 
  onSelect, 
  isSelected, 
  onCompare,
  isDragging,
  dragHandleProps 
}) {
  const styles = categoryStyles[tool.category] || categoryStyles.software;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative rounded-xl border-2 p-3 cursor-pointer transition-all duration-200",
        styles.bg,
        styles.border,
        isSelected && "ring-2 ring-slate-900 ring-offset-2",
        isDragging && "shadow-2xl rotate-2 z-50"
      )}
      onClick={() => onSelect?.(tool)}
    >
      {/* Drag Handle */}
      <div 
        {...dragHandleProps}
        className="absolute -left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>
      
      {/* Category Accent */}
      <div className={cn("absolute top-0 left-4 w-8 h-1 rounded-b-full", styles.accent)} />
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 text-sm truncate">{tool.name}</h4>
          {tool.type && (
            <Badge variant="secondary" className={cn("text-xs mt-1", styles.badge)}>
              {typeLabels[tool.type] || tool.type}
            </Badge>
          )}
        </div>
        {tool.logo_url && (
          <img 
            src={tool.logo_url} 
            alt={tool.name}
            className="w-8 h-8 rounded-lg object-contain bg-white p-1"
          />
        )}
      </div>
      
      {/* Description */}
      {tool.description && (
        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
          {tool.description}
        </p>
      )}
      
      {/* Rating & Price */}
      <div className="flex items-center justify-between text-xs">
        {tool.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-medium text-slate-700">{tool.rating}</span>
          </div>
        )}
        {tool.pricing && (
          <span className="text-slate-500 truncate max-w-[80px]">{tool.pricing}</span>
        )}
      </div>
      
      {/* Quick Actions - Show on Hover */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center gap-1 bg-white rounded-full shadow-lg px-2 py-1 border">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompare?.(tool);
            }}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
            title="Add to compare"
          >
            <Check className="w-3 h-3 text-emerald-600" />
          </button>
          {tool.website_url && (
            <a
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              title="Visit website"
            >
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}