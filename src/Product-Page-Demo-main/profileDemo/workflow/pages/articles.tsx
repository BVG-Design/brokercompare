import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { BookOpen, Users, Monitor, Workflow, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StageHeader from '../components/swimlane/StageHeader';
import ArticleLaneCard from '../components/articles/ArticleLaneCard';

const stages = [
  { id: "pre_start", label: "Pre-Start", description: "Getting setup" },
  { id: "client_acquisition", label: "Client_Acquisition", description: "Finding leads" },
  { id: "application", label: "Application", description: "Processing loans" },
  { id: "settlement", label: "Settlement", description: "Finalizing deals" },
  { id: "post_settlement", label: "Post-Settlement", description: "After settlement" },
  { id: "ongoing", label: "Ongoing", description: "Day-to-day operations" },
  { id: "ninja_mode", label: "Ninja-Mode", description: "Advanced mastery" }
];

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

const categories = ["people", "software", "process", "services"];

export default function Articles() {
  const navigate = useNavigate();
  
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.list()
  });
  
  const publishedArticles = articles.filter(a => a.published !== false);
  
  const handleArticleClick = (articleId) => {
    navigate(createPageUrl('ArticleView') + `?id=${articleId}`);
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Home')}>
                <Button variant="ghost" size="icon">
                  <BookOpen className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Buyer's Guides
                </h1>
                <p className="text-sm text-slate-500">
                  Educational articles organized by stage and category
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to={createPageUrl('Home')}>
                <Button variant="outline">
                  Directory View
                </Button>
              </Link>
              <Link to={createPageUrl('TasksView')}>
                <Button variant="outline">
                  Task View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Swim Lane Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
        </div>
      ) : publishedArticles.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            No articles yet
          </h2>
          <p className="text-slate-500">
            Articles will help users discover the right tools
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <StageHeader stages={stages} />
            
            {/* Article Rows by Category */}
            {categories.map((category) => {
              const config = laneConfig[category];
              const Icon = config.icon;
              
              return (
                <div key={category} className={cn("flex border-b last:border-b-0", config.borderColor)}>
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
                    const stageArticles = publishedArticles.filter(
                      a => a.category === category && a.stage === stage.id
                    );
                    
                    return (
                      <div
                        key={stage.id}
                        className={cn(
                          "flex-1 min-w-[200px] p-3 border-r last:border-r-0",
                          config.borderColor
                        )}
                      >
                        <div className="space-y-2 min-h-[100px]">
                          {stageArticles.map((article) => (
                            <ArticleLaneCard
                              key={article.id}
                              article={article}
                              onClick={() => handleArticleClick(article.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}