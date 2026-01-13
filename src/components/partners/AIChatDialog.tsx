'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Loader2, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getAIRecommendations } from '@/app/recommendations/actions';
import { ServiceCard } from '@/components/directory/service-card';
import { SoftwareCard } from '@/components/directory/software-card';

export default function AIChatDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI assistant. Tell me about your brokerage needs and I'll recommend the perfect partners and solutions for you. What type of broker are you (mortgage, asset finance, or commercial finance)?",
      results: null as any
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim(), results: null };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Use the new Groq-integrated recommendation action
      const recommendations = await getAIRecommendations(userMessage.content);

      let assistantResponse = "";

      if (recommendations.reasoning) {
        assistantResponse = recommendations.reasoning;
      } else {
        assistantResponse = "Here is what I found based on your request:";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: assistantResponse,
          results: recommendations
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I apologize, but I encountered an error connectng to my AI brain. Please try again or browse our partners directly.",
          results: null
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 bg-gray-50/95 backdrop-blur-xl">
        <DialogHeader className="p-6 border-b bg-white/50 backdrop-blur-sm">
          <DialogTitle className="flex items-center gap-3 text-[#132847]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#05d8b5] to-[#ef4e23] flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-lg">AI Partner Recommendations</span>
              <span className="text-xs font-normal text-gray-500 font-sans">Powered by Groq & Sanity</span>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chat with our AI assistant to find the best partners for your brokerage.
          </DialogDescription>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((message, index) => (
            <div key={index} className={`space-y-4 ${message.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm ${message.role === 'user'
                  ? 'bg-[#132847] text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase tracking-wider font-bold">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <ReactMarkdown
                  className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 leading-relaxed"
                >
                  {message.content}
                </ReactMarkdown>
              </div>

              {/* Render Rich Results (Cards) if available */}
              {message.results && (message.results.services.length > 0 || message.results.software.length > 0) && (
                <div className="w-full pl-4 border-l-2 border-brand-orange/20 space-y-6">

                  {message.results.software.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        Recommended Software
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {message.results.software.map((sw: any) => (
                          <SoftwareCard key={sw.id} software={sw} compact />
                        ))}
                      </div>
                    </div>
                  )}

                  {message.results.services.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        Recommended Services
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {message.results.services.map((s: any) => (
                          <ServiceCard key={s.id} service={s} compact />
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-3 shadow-sm">
                <div className="relative">
                  <div className="w-3 h-3 bg-brand-orange rounded-full animate-ping absolute opacity-75"></div>
                  <Bot className="w-4 h-4 text-brand-orange relative z-10" />
                </div>
                <span className="text-sm text-gray-500 font-medium">Analyzing your request...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Describe what you're looking for (e.g., 'Looking for a CRM for a sole trader mortgage broker')..."
              className="flex-1 py-6 pl-6 pr-14 rounded-full border-gray-200 focus:ring-2 focus:ring-brand-blue/20 bg-gray-50 focus:bg-white transition-all shadow-inner"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1.5 bottom-1.5 h-auto aspect-square rounded-full bg-[#132847] hover:bg-[#1a3a5f] transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-center mt-2 text-[10px] text-gray-400 font-medium">
            AI can make mistakes. Please verify important information.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
