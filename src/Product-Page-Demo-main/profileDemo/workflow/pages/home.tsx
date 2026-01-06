import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, X, LayoutGrid, List, ChevronDown, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import StageHeader from '../components/swimlane/StageHeader';
import SwimLane from '../components/swimlane/SwimLane';
import ToolDetailPanel from '../components/swimlane/ToolDetailPanel';
import CompareDrawer from '../components/swimlane/CompareDrawer';
import AddToolModal from '../components/swimlane/AddToolModal';

const STAGES = [
  { id: "pre_start", label: "Pre-Start", description: "Before becoming a broker" },
  { id: "client_acquisition", label: "Client Acquisition", description: "Finding & attracting clients" },
  { id: "application", label: "Application", description: "Loan application process" },
  { id: "settlement", label: "Settlement", description: "Finalizing the deal" },
  { id: "post_settlement", label: "Post-Settlement", description: "After loan settles" },
  { id: "ongoing", label: "Ongoing", description: "Continuous operations" },
  { id: "ninja_mode", label: "Ninja-Mode", description: "Advanced mastery" }
];

const CATEGORIES = ["people", "software", "process", "services"];

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [compareTools, setCompareTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ['tools'],
    queryFn: () => base44.entities.Tool.list()
  });
  
  const updateToolMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Tool.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tools'] })
  });
  
  const createToolMutation = useMutation({
    mutationFn: (data) => base44.entities.Tool.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tools'] })
  });
  
  // Filter tools based on search and category
  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || tool.category === filterCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const [newCategory, newStage] = destination.droppableId.split('-');
    
    updateToolMutation.mutate({
      id: draggableId,
      data: { category: newCategory, stage: newStage }
    });
  };
  
  // Compare functionality
  const handleCompare = (tool) => {
    if (compareTools.find(t => t.id === tool.id)) {
      setCompareTools(compareTools.filter(t => t.id !== tool.id));
    } else if (compareTools.length < 4) {
      setCompareTools([...compareTools, tool]);
    }
  };
  
  const removeFromCompare = (id) => {
    setCompareTools(compareTools.filter(t => t.id !== id));
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Broker Tech Stack
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Map your journey from pre-start to ongoing success
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to={createPageUrl('TasksView')}>
                <Button variant="outline">
                  Task View
                </Button>
              </Link>
              <Link to={createPageUrl('Articles')}>
                <Button variant="outline">
                  Article Mode
                </Button>
              </Link>
              <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Tool
              </Button>
            </div>
          </div>
          
          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {filterCategory === "all" ? "All Categories" : filterCategory}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterCategory("all")}>
                  All Categories
                </DropdownMenuItem>
                {CATEGORIES.map(cat => (
                  <DropdownMenuItem key={cat} onClick={() => setFilterCategory(cat)}>
                    <span className="capitalize">{cat}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {compareTools.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Layers className="w-3 h-3" />
                {compareTools.length} comparing
              </Badge>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content - Swim Lane Diagram */}
      <main className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="min-w-[1400px]">
              <StageHeader stages={STAGES} />
              
              {CATEGORIES.map(category => (
                <SwimLane
                  key={category}
                  category={category}
                  stages={STAGES}
                  tools={filteredTools}
                  onSelectTool={setSelectedTool}
                  selectedTool={selectedTool}
                  onCompare={handleCompare}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </main>
      
      {/* Empty State */}
      {!isLoading && tools.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <LayoutGrid className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No tools added yet</h2>
          <p className="text-slate-500 mb-6">Start mapping your broker tech stack</p>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Your First Tool
          </Button>
        </div>
      )}
      
      {/* Tool Detail Panel */}
      <AnimatePresence>
        {selectedTool && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedTool(null)}
            />
            <ToolDetailPanel
              tool={selectedTool}
              onClose={() => setSelectedTool(null)}
              onCompare={handleCompare}
            />
          </>
        )}
      </AnimatePresence>
      
      {/* Compare Drawer */}
      <CompareDrawer
        tools={compareTools}
        onRemove={removeFromCompare}
        onClear={() => setCompareTools([])}
      />
      
      {/* Add Tool Modal */}
      <AddToolModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={createToolMutation.mutateAsync}
      />
    </div>
  );
}