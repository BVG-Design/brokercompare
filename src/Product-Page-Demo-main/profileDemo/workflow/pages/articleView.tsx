software: {
    icon: Monitor,
    color: "bg-blue-500",
    lightBg: "bg-blue-50"
  },
  process: {
    icon: Workflow,
    color: "bg-violet-500",
    lightBg: "bg-violet-50"
  },
  services: {
    icon: Briefcase,
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50"
  }
};

export default function ArticleView() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  const { data: article, isLoading: articleLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const articles = await base44.entities.Article.list();
      return articles.find(a => a.id === articleId);
    },
    enabled: !!articleId
  });
  
  const { data: allTools = [] } = useQuery({
    queryKey: ['tools'],
    queryFn: () => base44.entities.Tool.list()
  });
  
  // Filter tools that match selected features and category
  const matchingTools = useMemo(() => {
    if (!article || selectedFeatures.length === 0) return [];
    
    return allTools.filter(tool => {
      // Match category
      if (tool.category !== article.category) return false;
      
      // Check if tool has ALL selected features
      const toolFeatures = tool.features || [];
      return selectedFeatures.every(feature => toolFeatures.includes(feature));
    });
  }, [allTools, article, selectedFeatures]);
  
  const handleToggleFeature = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  if (articleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </div>
    );
  }
  
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Article not found</h2>
          <Link to={createPageUrl('Articles')}>
            <Button>Back to Articles</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const config = categoryConfig[article.category] || categoryConfig.software;
  const Icon = config.icon;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Articles')}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl text-white", config.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{article.title}</h1>
                <p className="text-sm text-slate-500 capitalize">{article.category}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Image */}
      {article.image_url && (
        <div className="h-80 overflow-hidden">
          <img 
            src={article.image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Article Body */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
              {article.description && (
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {article.description}
                </p>
              )}
              
              {article.content && (
                <ReactMarkdown 
                  className="prose prose-slate max-w-none"
                  components={{
                    h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                    h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
                    p: ({children}) => <p className="mb-4 leading-relaxed text-slate-700">{children}</p>,
                    ul: ({children}) => <ul className="list-disc ml-6 mb-4 space-y-2">{children}</ul>,
                    ol: ({children}) => <ol className="list-decimal ml-6 mb-4 space-y-2">{children}</ol>,
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              )}
            </div>
            
            {/* Matching Tools */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
              <ToolsList 
                tools={matchingTools} 
                selectedFeatures={selectedFeatures}
              />
            </div>
          </div>
          
          {/* Sidebar - Feature Selector */}
          <div className="lg:col-span-1">
            <FeatureSelector
              availableFeatures={article.available_features || []}
              selectedFeatures={selectedFeatures}
              onToggleFeature={handleToggleFeature}
              onClearAll={() => setSelectedFeatures([])}
              matchingCount={matchingTools.length}
            />
          </div>
        </div>
      </main>
    </div>
  );
}