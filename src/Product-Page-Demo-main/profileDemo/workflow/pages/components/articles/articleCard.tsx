import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Monitor, Workflow, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categoryConfig = {
  people: {
    icon: Users,
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200"
  },
  software: {
    icon: Monitor,
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  process: {
    icon: Workflow,
    color: "bg-violet-500",
    lightBg: "bg-violet-50",
    borderColor: "border-violet-200"
  },
  services: {
    icon: Briefcase,
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-200"
  }
};

export default function ArticleCard({ article, onClick }) {
  const config = categoryConfig[article.category] || categoryConfig.software;
  const Icon = config.icon;
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl",
        config.lightBg,
        config.borderColor
      )}
      onClick={onClick}
    >
      {article.image_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("p-2 rounded-xl text-white", config.color)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-slate-500 capitalize">
            {article.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
          {article.title}
        </h3>
        
        {article.description && (
          <p className="text-slate-600 text-sm line-clamp-2 mb-4">
            {article.description}
          </p>
        )}
        
        <Button variant="ghost" className="gap-2 p-0 h-auto hover:bg-transparent group">
          <span className="text-sm font-medium">Read & Find Tools</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}