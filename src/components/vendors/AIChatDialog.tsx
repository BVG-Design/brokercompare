'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { recommendServiceProviders } from '@/ai/ai-service-provider-recommendation';
import { recommendSoftware } from '@/ai/ai-software-recommendation';

export default function AIChatDialog({ open, onOpenChange }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your AI assistant. Tell me about your brokerage needs and I'll recommend the perfect vendors and solutions for you. What type of broker are you (mortgage, asset finance, or commercial finance)?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a mock profile/input for the AI flows
      const mockProfile = {
        businessType: 'commercial', // default
        yearsInBusiness: 5,
        location: 'Australia',
        specialization: 'various',
        needs: input.trim(),
        budget: 'flexible',
      };

      // Call both AI flows
      const [serviceRecs, softwareRecs] = await Promise.all([
        recommendServiceProviders(mockProfile),
        recommendSoftware({
          brokerProfile: input.trim(),
          softwareList: 'All available software',
        }),
      ]);

      let assistantResponse =
        "Based on your needs, here are some recommendations:\n\n";

      if (serviceRecs && serviceRecs.recommendations.length > 0) {
        assistantResponse += '**Recommended Services:**\n';
        serviceRecs.recommendations.forEach((rec) => {
          assistantResponse += `- **${rec.providerName}** (${rec.serviceType}): ${rec.rationale}\n`;
        });
      }

      if (softwareRecs && softwareRecs.recommendations) {
        assistantResponse += '\n**Recommended Software:**\n';
        assistantResponse += softwareRecs.recommendations;
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantResponse },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I encountered an error. Please try again or browse our vendors directly.",
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#132847]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#05d8b5] to-[#ef4e23] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            AI Vendor Recommendations
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                    ? 'bg-[#132847] text-white'
                    : 'bg-gray-100 text-gray-900'
                  }`}
              >
                <ReactMarkdown
                  className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-2 ml-4 list-disc">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 ml-4 list-decimal">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#132847]" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe what you're looking for..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-[#132847] hover:bg-[#1a3a5f]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
