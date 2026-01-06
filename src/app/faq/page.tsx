'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Unused
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
import StillNotSure from '@/components/product-page/StillNotSure';
import { createClient } from '@/lib/supabase/client';
// TODO: Replace with Supabase queries when tables are ready
// import { faqQueries } from '@/lib/supabase';
import { submitQuestion } from '@/app/actions/ask-question';

function FAQContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [askDialogOpen, setAskDialogOpen] = useState(false);
  const [askQuestion, setAskQuestion] = useState('');
  const [askContext, setAskContext] = useState('');
  const [questionCategory, setQuestionCategory] = useState<string>('general');
  const [postAs, setPostAs] = useState<'public' | 'private'>('public');
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Sample FAQs - sorted by category (10 questions total)
  const sampleFaqs = [
    {
      id: '1',
      question: 'What is Broker Tools?',
      answer: 'Broker Tools is a comprehensive directory platform that connects brokers with software partners and service providers. It helps brokers discover, compare, and connect with tools and services that can enhance their business operations.',
      category: 'general',
      helpful_count: 45,
      view_count: 320,
      published: true,
    },
    {
      id: '2',
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button in the top right corner. You can sign up using your email address or through social authentication. Once registered, you\'ll be able to access all features of the platform.',
      category: 'account',
      helpful_count: 38,
      view_count: 280,
      published: true,
    },
    {
      id: '3',
      question: 'How do I search for partners in the directory?',
      answer: 'You can search for partners using the search bar at the top of the directory page. Filter by category, features, or use keywords to find specific partners. You can also browse by category to discover partners in specific areas.',
      category: 'directory',
      helpful_count: 52,
      view_count: 410,
      published: true,
    },
    {
      id: '4',
      question: 'How do I submit a partner application?',
      answer: 'partners can submit an application by clicking the "Apply to List" button on the directory page. Fill out the application form with your company details, services, and relevant information. Our team will review your application and get back to you.',
      category: 'partners',
      helpful_count: 29,
      view_count: 195,
      published: true,
    },
    {
      id: '5',
      question: 'What features are available for brokers?',
      answer: 'Brokers have access to a comprehensive dashboard where they can search and compare partners, save favorites to a shortlist, read reviews, submit leads, and manage their profile. Premium features may include advanced filtering and priority support.',
      category: 'brokers',
      helpful_count: 41,
      view_count: 350,
      published: true,
    },
    {
      id: '6',
      question: 'Is Broker Tools free to use?',
      answer: 'Broker Tools offers both free and premium plans. The free plan includes basic directory access and partner search. Premium plans unlock advanced features like detailed comparisons, priority support, and exclusive partner access.',
      category: 'pricing',
      helpful_count: 67,
      view_count: 520,
      published: true,
    },
    {
      id: '7',
      question: 'How do I update my broker profile?',
      answer: 'To update your broker profile, navigate to your dashboard and click on "Profile Settings". From there, you can update your company information, contact details, preferences, and other profile settings.',
      category: 'account',
      helpful_count: 33,
      view_count: 240,
      published: true,
    },
    {
      id: '8',
      question: 'How do I leave a review for a partner?',
      answer: 'To leave a review, navigate to the partner\'s profile page and click the "Write a Review" button. You can rate the partner and provide detailed feedback about your experience. Reviews help other brokers make informed decisions.',
      category: 'directory',
      helpful_count: 28,
      view_count: 180,
      published: true,
    },
    {
      id: '9',
      question: 'What browser and device requirements are needed?',
      answer: 'Broker Tools works on all modern browsers including Chrome, Firefox, Safari, and Edge. The platform is fully responsive and works on desktop, tablet, and mobile devices. For the best experience, we recommend using the latest version of your browser.',
      category: 'technical',
      helpful_count: 19,
      view_count: 150,
      published: true,
    },
    {
      id: '10',
      question: 'How do I contact partner support?',
      answer: 'You can contact partner support directly through their profile page by clicking the "Contact partner" button. This will open a form where you can send a message. partners typically respond within 24-48 hours.',
      category: 'brokers',
      helpful_count: 35,
      view_count: 290,
      published: true,
    },
  ];

  React.useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(Boolean(user));
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name')
          .eq('id', user.id)
          .maybeSingle();
        setFirstName(profile?.first_name || user.user_metadata?.first_name || null);
      }
    };
    loadUser();
    // Set sample FAQs for now - will be replaced with Supabase query when tables are ready
    setFaqs(sampleFaqs);
  }, []);

  React.useEffect(() => {
    if (searchParams?.get('ask') === '1') {
      const defaultCategory = selectedCategory === 'all' ? 'general' : selectedCategory;
      setQuestionCategory(defaultCategory);
      setAskDialogOpen(true);
    }
  }, [searchParams, selectedCategory]);

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


  const handleOpenAskDialog = () => {
    if (!isLoggedIn) {
      toast({
        title: 'Please sign in',
        description: 'You need to be logged in to ask a question.',
        variant: 'destructive',
      });
      // Still open the dialog to show the login requirement
      setAskDialogOpen(true);
      setShowThankYou(false);
      return;
    }
    const defaultCategory = selectedCategory === 'all' ? 'general' : selectedCategory;
    setQuestionCategory(defaultCategory);
    setAskDialogOpen(true);
    setShowThankYou(false);
  };

  const handleSubmitQuestion = async () => {
    if (!askQuestion.trim()) {
      toast({
        title: 'Question required',
        description: 'Please enter your question before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingQuestion(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const result = await submitQuestion({
        question: askQuestion.trim(),
        context: askContext,
        category: questionCategory,
        // Using pathname as source page if available, or just 'faq'
        sourcePage: window.location.pathname || 'faq',
        postAs: postAs,
        userId: user?.id,
        userEmail: user?.email, // Note: We might want to check the profile for name if available
        userName: firstName || user?.email,
        isLoggedIn: !!user,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setShowThankYou(true);
      setAskQuestion('');
      setAskContext('');
      setPostAs('public');
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: 'Something went wrong',
        description: 'We could not submit your question. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: HelpCircle },
    { value: 'general', label: 'General', icon: HelpCircle },
    { value: 'brokers', label: 'For Brokers', icon: HelpCircle },
    { value: 'partners', label: 'For partners', icon: HelpCircle },
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
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-10">
        <div className="container mx-auto px-4 md:px-10 text-center">
          {/* Icon removed */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-4xl">
              <div className="text-center w-full">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">
                  Frequently Asked Questions <br />
                </h1>
                <p className="text-xl text-primary-foreground/80">
                  Find answers to your questions or ask our AI assistant <br /><br />
                </p>
              </div>
            </div>
          </div>

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
          <div className="lg:col-span-1 space-y-6 sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.value
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
            <Card className="border-accent bg-gradient-to-br from-accent/5 to-background">
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
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-primary">
                    Frequently Asked Questions
                  </CardTitle>
                  <Button
                    onClick={handleOpenAskDialog}
                    className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                    size="sm"
                  >
                    + Ask a Question
                  </Button>
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
                                {faq.view_count} views | {faq.helpful_count || 0} found helpful
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

            {/* CTA */}
            <StillNotSure />
          </div>
        </div>
      </div>

      {/* Ask a Question Modal */}
      <Dialog open={askDialogOpen} onOpenChange={setAskDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white border-4 border-brand-blue shadow-xl text-gray-800">
          {!showThankYou ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <img
                    src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Profile.png"
                    alt="Simba profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-dark-gray-10"
                  />
                  <DialogTitle>Ask a question</DialogTitle>
                  <DialogDescription className="text-gray-800">Hi, Simba here, let me know how I or the humans can help...</DialogDescription>
                </div>
              </DialogHeader>
              {!isLoggedIn ? (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      You need to be logged in to ask a question. Please sign in to continue.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setAskDialogOpen(false);
                        // Redirect to login - you may want to use router.push('/login') here
                      }}
                      variant="outline"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      id="ask-question"
                      value={askQuestion}
                      onChange={(e) => setAskQuestion(e.target.value)}
                      placeholder="What are you trying to figure out?"
                      rows={3}
                      className="border-gray-600 bg-white text-gray-800 placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ask-about" className="text-sm font-medium">
                      This is about
                    </Label>
                    <Select
                      value={questionCategory}
                      onValueChange={setQuestionCategory}
                    >
                      <SelectTrigger id="ask-about" className="border-gray-600 text-gray-800">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((cat) => cat.value !== 'all')
                          .map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ask-context" className="text-sm font-medium">
                      Add context (optional)
                    </Label>
                    <Textarea
                      id="ask-context"
                      value={askContext}
                      onChange={(e) => setAskContext(e.target.value)}
                      placeholder="Add any details that might help provide a better answer"
                      rows={4}
                      className="border-gray-600 bg-white text-gray-800 placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Post as</Label>
                    <RadioGroup
                      value={postAs}
                      onValueChange={(val) => setPostAs(val as 'public' | 'private')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="post-public" />
                        <Label htmlFor="post-public" className="font-normal cursor-pointer">
                          Publically, as {firstName || 'your account name'}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="post-private" />
                        <Label htmlFor="post-private" className="font-normal cursor-pointer">
                          Privately, support team question.
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSubmitQuestion}
                      disabled={isSubmittingQuestion || !askQuestion.trim()}
                      className="bg-[#ef4e23] hover:bg-[#d8441f] text-white"
                    >
                      {isSubmittingQuestion ? 'Submitting...' : 'Submit'}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Thank you for your Question.</h3>
                <p className="text-muted-foreground">
                  I am digging for answers - if I can&apos;t find a solution for you soon, will have one of our humans review and get back to you asap.
                </p>
              </div>
              <div className="flex justify-center pt-4">
                <img
                  src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Digging.png"
                  alt="Simba digging for answers"
                  className="w-64 h-64 object-contain"
                />
              </div>
              <DialogFooter className="justify-center">
                <Button onClick={() => {
                  setAskDialogOpen(false);
                  setShowThankYou(false);
                }}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
