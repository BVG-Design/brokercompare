'use client';

import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  HelpCircle, 
  ThumbsUp, 
  MessageSquare, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
// TODO: Replace with Supabase queries when tables are ready
// import { faqQueries } from '@/lib/supabase';

function FAQContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [faqs, setFaqs] = useState<any[]>([]);

  // TODO: Replace with Supabase query when tables are ready
  React.useEffect(() => {
    // Placeholder: This will be replaced with actual Supabase query
    // const fetchFAQs = async () => {
    //   const data = await faqQueries.getAll({ published: true });
    //   setFaqs(data);
    // };
    // fetchFAQs();
  }, []);

  const handleToggleFaq = (faqId: string) => {
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  };

  const handleMarkHelpful = (faq: any) => {
    // TODO: Implement Supabase mutation
    toast({
      title: 'Thanks for your feedback!',
      description: 'Your feedback helps us improve.',
    });
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a question',
        variant: 'destructive',
      });
      return;
    }

    setIsAiLoading(true);
    setAiResponse('');

    try {
      // TODO: Implement AI integration
      // For now, show a placeholder response
      setTimeout(() => {
        setAiResponse('AI assistant integration will be available once Supabase tables are set up.');
        setIsAiLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
      setIsAiLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: HelpCircle },
    { value: 'general', label: 'General', icon: HelpCircle },
    { value: 'brokers', label: 'For Brokers', icon: HelpCircle },
    { value: 'vendors', label: 'For Vendors', icon: HelpCircle },
    { value: 'directory', label: 'Directory', icon: HelpCircle },
    { value: 'pricing', label: 'Pricing', icon: HelpCircle },
    { value: 'technical', label: 'Technical', icon: HelpCircle },
    { value: 'account', label: 'Account', icon: HelpCircle },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords?.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
      <main className="flex-1 bg-background">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-secondary mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-headline">
              Help Center
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Find answers to your questions or ask our AI assistant
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-background"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-primary text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === cat.value
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <cat.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant Card */}
              <Card className="mt-6 border-accent bg-gradient-to-br from-accent/5 to-background">
                <CardHeader>
                  <CardTitle className="text-primary text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Can't find what you're looking for? Ask our AI assistant!
                  </p>
                  <Button 
                    onClick={() => setShowAIChat(!showAIChat)}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* AI Chat Section */}
              {showAIChat && (
                <Card className="border-accent">
                  <CardHeader className="bg-gradient-to-r from-accent/10 to-background">
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent" />
                      Ask AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your question here..."
                          value={aiQuestion}
                          onChange={(e) => setAiQuestion(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleAskAI}
                          disabled={isAiLoading}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          {isAiLoading ? 'Thinking...' : 'Ask'}
                        </Button>
                      </div>

                      {isAiLoading && (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
                        </div>
                      )}

                      {aiResponse && (
                        <div className="p-4 bg-muted rounded-lg border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-foreground whitespace-pre-wrap">{aiResponse}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FAQ List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary">
                      Frequently Asked Questions
                    </CardTitle>
                    <Badge variant="secondary">{filteredFaqs.length} questions</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredFaqs.length === 0 ? (
                    <div className="text-center py-12">
                      <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No FAQs found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or category filter</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredFaqs.map((faq) => (
                        <div 
                          key={faq.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => handleToggleFaq(faq.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left"
                          >
                            <div className="flex-1 pr-4">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-semibold text-primary">{faq.question}</span>
                                {faq.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {faq.category}
                                  </Badge>
                                )}
                              </div>
                              {faq.view_count > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  {faq.view_count} views • {faq.helpful_count || 0} found helpful
                                </p>
                              )}
                            </div>
                            {expandedFaqId === faq.id ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </button>

                          {expandedFaqId === faq.id && (
                            <div className="px-4 pb-4 border-t bg-muted">
                              <p className="text-foreground mt-4 mb-4 whitespace-pre-wrap">
                                {faq.answer}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkHelpful(faq)}
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1" />
                                  Helpful
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                  Was this answer helpful?
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Support CTA */}
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                  <p className="text-primary-foreground/80 mb-6">
                    Our support team is here to help you with any questions
                  </p>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
  );
}

export default function FAQPage() {
  return (
    <Suspense fallback={
      <>
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </>
    }>
      <FAQContent />
    </Suspense>
  );
}

