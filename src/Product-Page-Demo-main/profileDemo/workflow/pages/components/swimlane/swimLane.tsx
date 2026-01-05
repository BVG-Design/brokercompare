import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Users, Monitor, Workflow, Briefcase } from 'lucide-react';
import { cn } from "@/lib/utils";
import ContentCard from './ContentCard';

const laneConfig = {
  people: {
    label: "People",
    icon: Users,
    color: "bg-amber-500",
    lightBg: "bg-amber-50/50",
    borderColor: "border-amber-200"
  },
  software: {
    label: "Software",
    icon: Monitor,
    color: "bg-blue-500",
    lightBg: "bg-blue-50/50",
    borderColor: "border-blue-200"
  },
  process: {
    label: "Process & Automations",
    icon: Workflow,
    color: "bg-violet-500",
    lightBg: "bg-violet-50/50",
    borderColor: "border-violet-200"
  },
  services: {
    label: "Services",
    icon: Briefcase,
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50/50",
    borderColor: "border-emerald-200"
  }
};

export default function SwimLane({ 
  category, 
  stages, 
  tools, 
  onSelectTool, 
  selectedTool,
  onCompare 
}) {
  const config = laneConfig[category];
  const Icon = config.icon;
  
  return (
    <div className={cn(
      "flex border-b last:border-b-0",
      config.borderColor
    )}>
      {/* Lane Label */}
      <div className={cn(
        "w-40 shrink-0 p-4 border-r sticky left-0 z-10",
        config.lightBg,
        config.borderColor
      )}>
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg text-white", config.color)}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-700 text-sm">{config.label}</span>
        </div>
      </div>
      
      {/* Stage Cells */}
      {stages.map((stage) => {
        const droppableId = `${category}-${stage.id}`;
        const stageTools = tools.filter(t => t.category === category && t.stage === stage.id);
        
        return (
          <Droppable key={droppableId} droppableId={droppableId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "flex-1 min-w-[200px] p-3 border-r last:border-r-0 transition-colors",
                  config.borderColor,
                  snapshot.isDraggingOver && "bg-slate-100"
                )}
              >
                <div className="space-y-2 min-h-[100px]">
                  {stageTools.map((tool, index) => (
                    <Draggable key={tool.id} draggableId={tool.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <ContentCard
                            tool={tool}
                            onSelect={onSelectTool}
                            isSelected={selectedTool?.id === tool.id}
                            onCompare={onCompare}
                            isDragging={snapshot.isDragging}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        );
      })}
    </div>
  );
}