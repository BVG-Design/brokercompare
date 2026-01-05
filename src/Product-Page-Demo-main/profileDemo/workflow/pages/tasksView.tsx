import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import StageHeader from '../components/swimlane/StageHeader';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';

const stages = [
  { id: "pre_start", label: "Pre-Start", description: "Getting setup" },
  { id: "client_acquisition", label: "Client Acquisition", description: "Finding leads" },
  { id: "application", label: "Application", description: "Processing loans" },
  { id: "settlement", label: "Settlement", description: "Finalizing deals" },
  { id: "post_settlement", label: "Post-Settlement", description: "After settlement" },
  { id: "ongoing", label: "Ongoing", description: "Day-to-day operations" },
  { id: "ninja_mode", label: "Ninja-Mode", description: "Advanced mastery" }
];

const categories = [
  { id: "people", label: "People" },
  { id: "software", label: "Software" },
  { id: "process", label: "Process & Automations" }
];

export default function TasksView() {
  const [selectedTask, setSelectedTask] = useState(null);
  
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['taskTemplates'],
    queryFn: () => base44.entities.TaskTemplate.list()
  });
  
  const { data: tools = [] } = useQuery({
    queryKey: ['tools'],
    queryFn: () => base44.entities.Tool.list()
  });
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-900 text-white">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Task-Based Planning
                  </h1>
                  <p className="text-sm text-slate-500">
                    Define requirements and discover matching solutions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Home')}>
                <Button variant="outline">
                  Directory View
                </Button>
              </Link>
              <Link to={createPageUrl('Articles')}>
                <Button variant="outline">
                  Article Mode
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Swim Lane Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <StageHeader stages={stages} />
          
          {/* Task Rows */}
          {categories.map((category) => (
            <div key={category.id} className="flex border-b border-slate-200">
              {/* Category Label */}
              <div className="w-40 shrink-0 p-4 border-r border-slate-200 bg-slate-50 sticky left-0 z-10">
                <span className="font-semibold text-slate-700 text-sm">
                  {category.label}
                </span>
              </div>
              
              {/* Stage Cells */}
              {stages.map((stage) => {
                const stageTasks = tasks.filter(
                  t => t.category === category.id && t.stage === stage.id
                );
                
                return (
                  <div
                    key={stage.id}
                    className="flex-1 min-w-[200px] p-3 border-r last:border-r-0 border-slate-200"
                  >
                    <div className="space-y-2">
                      {stageTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onClick={() => setSelectedTask(task)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          tools={tools}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}