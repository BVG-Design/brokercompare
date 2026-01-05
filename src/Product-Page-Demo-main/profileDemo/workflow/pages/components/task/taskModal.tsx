import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Circle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ProductSuggestions from './ProductSuggestions';

const moscowConfig = {
  must: {
    label: "Must Have",
    color: "bg-red-500",
    bgLight: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-500"
  },
  should: {
    label: "Should Have",
    color: "bg-amber-500",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-500"
  },
  could: {
    label: "Could Have",
    color: "bg-blue-500",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-500"
  },
  wont: {
    label: "Won't Have",
    color: "bg-slate-400",
    bgLight: "bg-slate-50",
    textColor: "text-slate-600",
    borderColor: "border-slate-400"
  }
};

export default function TaskModal({ task, tools, onClose }) {
  const [selectedCriteria, setSelectedCriteria] = useState(
    (task.criteria || []).reduce((acc, criterion) => ({
      ...acc,
      [criterion.name]: criterion.priority || 'should'
    }), {})
  );
  
  if (!task) return null;
  
  const handleToggleCriterion = (criterionName) => {
    setSelectedCriteria(prev => ({
      ...prev,
      [criterionName]: prev[criterionName] ? null : 'should'
    }));
  };
  
  const handleChangePriority = (criterionName, priority) => {
    setSelectedCriteria(prev => ({
      ...prev,
      [criterionName]: priority
    }));
  };
  
  const activeCriteria = Object.entries(selectedCriteria)
    .filter(([_, priority]) => priority)
    .map(([name, priority]) => ({ name, priority }));
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{task.name}</h2>
              {task.description && (
                <p className="text-slate-600 mt-1">{task.description}</p>
              )}
              <Badge variant="secondary" className="mt-2 capitalize">
                {task.category}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Criteria Checklist */}
            <div className="w-1/2 border-r p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Requirements Checklist
                </h3>
                <p className="text-sm text-slate-600">
                  Select criteria and prioritize using MoSCoW method
                </p>
              </div>
              
              {/* MoSCoW Legend */}
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Priority Levels:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(moscowConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", config.color)} />
                      <span className="text-xs text-slate-600">{config.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Criteria List */}
              <div className="space-y-3">
                {(task.criteria || []).map((criterion, index) => {
                  const isSelected = !!selectedCriteria[criterion.name];
                  const priority = selectedCriteria[criterion.name];
                  const priorityConfig = priority ? moscowConfig[priority] : null;
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all",
                        isSelected ? "bg-white" : "bg-slate-50 border-slate-200"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleCriterion(criterion.name)}
                          className="mt-1"
                        >
                          {isSelected ? (
                            <CheckCircle2 className={cn("w-5 h-5", priorityConfig?.textColor)} />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <h5 className="font-medium text-slate-900 mb-1">
                            {criterion.name}
                          </h5>
                          {criterion.description && (
                            <p className="text-xs text-slate-600">
                              {criterion.description}
                            </p>
                          )}
                          
                          {isSelected && (
                            <div className="flex gap-2 mt-3">
                              {Object.entries(moscowConfig).map(([key, config]) => (
                                <button
                                  key={key}
                                  onClick={() => handleChangePriority(criterion.name, key)}
                                  className={cn(
                                    "px-3 py-1 rounded-md text-xs font-medium transition-all border-2",
                                    priority === key
                                      ? cn(config.bgLight, config.borderColor, config.textColor)
                                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                  )}
                                >
                                  {config.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right Panel - Product Suggestions */}
            <div className="w-1/2 p-6 overflow-y-auto bg-slate-50">
              <ProductSuggestions
                taskCategory={task.category}
                selectedCriteria={activeCriteria}
                tools={tools}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}