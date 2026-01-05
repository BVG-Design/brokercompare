import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const categoryColors = {
  people: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    accent: "bg-amber-500"
  },
  software: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    accent: "bg-blue-500"
  },
  process: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    accent: "bg-violet-500"
  },
  services: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    accent: "bg-emerald-500"
  }
};

export default function ArticleLaneCard({ article, onClick }) {
  const colors = categoryColors[article.category] || categoryColors.software;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border-2 cursor-pointer transition-all",
        colors.bg,
        colors.border,
        "hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <BookOpen className={cn("w-4 h-4 mt-0.5", colors.text)} />
        <h4 className={cn("font-semibold text-sm flex-1", colors.text)}>
          {article.title}
        </h4>
      </div>
      
      {article.description && (
        <p className="text-xs text-slate-600 line-clamp-2">
          {article.description}
        </p>
      )}
    </motion.div>
  );
}