import React from 'react';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  UserPlus, 
  FileText, 
  CheckCircle, 
  Repeat,
  Clock
} from 'lucide-react';
import { cn } from "@/lib/utils";

const stageIcons = {
  pre_start: PlayCircle,
  client_acquisition: UserPlus,
  application: FileText,
  settlement: CheckCircle,
  post_settlement: Clock,
  ongoing: Repeat
};

const stageColors = {
  pre_start: "from-slate-500 to-slate-600",
  client_acquisition: "from-sky-500 to-sky-600",
  application: "from-indigo-500 to-indigo-600",
  settlement: "from-emerald-500 to-emerald-600",
  post_settlement: "from-orange-500 to-orange-600",
  ongoing: "from-rose-500 to-rose-600"
};

export default function StageHeader({ stages }) {
  return (
    <div className="flex border-b border-slate-200 sticky top-0 z-20 bg-white">
      {/* Empty cell for lane labels */}
      <div className="w-40 shrink-0 p-4 border-r border-slate-200 bg-slate-50">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Category
        </span>
      </div>
      
      {/* Stage Headers */}
      {stages.map((stage, index) => {
        const Icon = stageIcons[stage.id] || FileText;
        const gradient = stageColors[stage.id] || stageColors.pre_start;
        
        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-1 min-w-[200px] p-4 border-r last:border-r-0 border-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl bg-gradient-to-br text-white shadow-sm",
                gradient
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">{stage.label}</h3>
                <p className="text-xs text-slate-500">{stage.description}</p>
              </div>
            </div>
            
            {/* Stage Progress Indicator */}
            <div className="mt-3 flex items-center gap-1">
              {stages.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i <= index ? "bg-slate-800" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}