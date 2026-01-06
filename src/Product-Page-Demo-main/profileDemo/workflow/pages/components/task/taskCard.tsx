import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Circle } from 'lucide-react';
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
  }
};

export default function TaskCard({ task, onClick }) {
  const colors = categoryColors[task.category] || categoryColors.software;
  const criteriaCount = task.criteria?.length || 0;
  
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
      <div className="flex items-start justify-between mb-2">
        <h4 className={cn("font-semibold text-sm", colors.text)}>
          {task.name}
        </h4>
        <CheckSquare className={cn("w-4 h-4", colors.text)} />
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {criteriaCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {criteriaCount} criteria
        </Badge>
      )}
    </motion.div>
  );
}