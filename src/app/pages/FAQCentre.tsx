import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  HelpCircle, 
  ThumbsUp, 
  MessageSquare, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQCenter() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => base44.entities.FAQ.filter({ published: true }, 'order'),
    initialData: [],
  });

  const markHelpfulMutation = useMutation({
    mutationFn: async (faq) => {
      return base44.entities.FAQ.update(faq.id, {
        ...faq,
        helpful_count: (faq.helpful_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      toast.success("Thanks for your feedback!");
    },
  });

  const incrementViewMutation = useMutation({
    mutationFn: async (faq) => {
      return base44.entities.FAQ.update(faq.id, {
        ...faq,
        view_count: (faq.view_count || 0) + 1
      });
    },
  });

  const handleToggleFaq = (faqId) => {
    if (expandedFaqId !== faqId) {
      const faq = faqs.find(f => f.id === faqId);
      if (faq) {
        incrementViewMutation.mutate(faq);
      }
    }
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsAiLoading(true);
    setAiResponse("");

    try {
      // First, search FAQs to provide context
      const relevantFaqs = faqs
        .filter(faq => 
          faq.question.toLowerCase().includes(aiQuestion.toLowerCase()) ||
          faq.answer.toLowerCase().includes(aiQuestion.toLowerCase()) ||
          faq.keywords?.some(k => aiQuestion.toLowerCase().includes(k.toLowerCase()))
        )
        .slice(0, 3);

      const faqContext = relevantFaqs.length > 0
        ? `Here are some relevant FAQs from our knowledge base:\n${relevantFaqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}`
        : "No directly matching FAQs found in the knowledge base.";

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful customer support assistant for BrokerTools, a directory platform that connects brokers with software, products and service providers.

${faqContext}

User Question: ${aiQuestion}

Please provide a helpful, accurate answer based on the FAQ context above. If the question is not covered by the FAQs, provide a general helpful response and suggest they contact support for specific details. Keep the response concise and friendly.`,
        add_context_from_internet: false
      });

      setAiResponse(response);
    } catch (error) {
      console.error("AI response error:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "All Categories", icon: HelpCircle },
    { value: "general", label: "General", icon: HelpCircle },
    { value: "brokers", label: "For Brokers", icon: HelpCircle },
    { value: "services", label: "For Products/Services", icon: HelpCircle },
    { value: "directory", label: "Directory", icon: HelpCircle },
    { value: "pricing", label: "Pricing", icon: HelpCircle },
    { value: "technical", label: "Technical", icon: HelpCircle },
    { value: "account", label: "Account", icon: HelpCircle },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#05d8b5] to-[#ef4e23] mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Find answers to your questions or ask our AI assistant
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-[#132847] text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.value
                          ? 'bg-[#132847] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
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
            <Card className="mt-6 border-[#05d8b5] bg-gradient-to-br from-[#05d8b5]/5 to-white">
              <CardHeader>
                <CardTitle className="text-[#132847] text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#05d8b5]" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Can't find what you're looking for? Ask our AI assistant!
                </p>
                <Button 
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="w-full bg-[#05d8b5] hover:bg-[#04c5a6] text-white"
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
            <AnimatePresence>
              {showAIChat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="border-[#05d8b5]">
                    <CardHeader className="bg-gradient-to-r from-[#05d8b5]/10 to-white">
                      <CardTitle className="text-[#132847] flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#05d8b5]" />
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
                            className="bg-[#05d8b5] hover:bg-[#04c5a6]"
                          >
                            {isAiLoading ? "Thinking..." : "Ask"}
                          </Button>
                        </div>

                        {isAiLoading && (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#05d8b5]" />
                          </div>
                        )}

                        {aiResponse && (
                          <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#05d8b5] flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FAQ List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#132847]">
                    Frequently Asked Questions
                  </CardTitle>
                  <Badge variant="secondary">{filteredFaqs.length} questions</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
                    <p className="text-gray-600">Try adjusting your search or category filter</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFaqs.map((faq, idx) => (
                      <div 
                        key={faq.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => handleToggleFaq(faq.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold text-[#132847]">{faq.question}</span>
                              <Badge variant="outline" className="text-xs">
                                {faq.category}
                              </Badge>
                            </div>
                            {faq.view_count > 0 && (
                              <p className="text-xs text-gray-500">
                                {faq.view_count} views • {faq.helpful_count || 0} found helpful
                              </p>
                            )}
                          </div>
                          {expandedFaqId === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>

                        <AnimatePresence>
                          {expandedFaqId === faq.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-4 pb-4 border-t bg-gray-50">
                                <p className="text-gray-700 mt-4 mb-4 whitespace-pre-wrap">
                                  {faq.answer}
                                </p>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => markHelpfulMutation.mutate(faq)}
                                  >
                                    <ThumbsUp className="w-3 h-3 mr-1" />
                                    Helpful
                                  </Button>
                                  <span className="text-xs text-gray-500">
                                    Was this answer helpful?
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Support CTA */}
            <Card className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white border-0">
              <CardContent className="pt-6 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#05d8b5]" />
                <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                <p className="text-gray-300 mb-6">
                  Our support team is here to help you with any questions
                </p>
                <Button className="bg-[#05d8b5] hover:bg-[#04c5a6] text-[#132847] font-semibold">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}