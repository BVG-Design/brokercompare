"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getRecommendations } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Loader2 } from "lucide-react";
import type { Service, Software } from "@/lib/types";
import { ServiceCard } from "../services/service-card";
import { SoftwareCard } from "../software/software-card";
import { useToast } from "@/hooks/use-toast";


const recommendationSchema = z.object({
  businessGoal: z.string().min(1, "Please select a business goal."),
  businessSize: z.string().min(1, "Please select your business size."),
  customNeeds: z.string().min(10, "Please describe your needs in at least 10 characters."),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;

type RecommendationResult = {
  services: Service[];
  software: Software[];
  reasoning: string;
};

export function RecommendationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      businessGoal: "",
      businessSize: "",
      customNeeds: "",
    },
  });

  async function onSubmit(data: RecommendationFormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const recommendations = await getRecommendations(data);
      setResult(recommendations);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader className="text-center">
        <Bot className="mx-auto h-12 w-12 text-primary mb-2" />
        <CardTitle className="text-3xl font-headline">AI Recommendation Engine</CardTitle>
        <CardDescription>
          Tell us about your needs, and our AI will find the perfect services and software for your brokerage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!result && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="businessGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Business Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="e.g., Increase Leads" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Increase Leads">Increase Leads</SelectItem>
                          <SelectItem value="Improve Efficiency">Improve Efficiency</SelectItem>
                          <SelectItem value="Enhance Client Retention">Enhance Client Retention</SelectItem>
                          <SelectItem value="Streamline Compliance">Streamline Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="e.g., Sole Trader" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sole Trader">Sole Trader</SelectItem>
                          <SelectItem value="2-5 Staff">2-5 Staff</SelectItem>
                          <SelectItem value="6-10 Staff">6-10 Staff</SelectItem>
                          <SelectItem value="10+ Staff">10+ Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="customNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your specific needs</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I need a VA who is experienced with MyCRM and can handle social media posting. For software, I'm looking for a simple marketing tool.'"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Get My Recommendations"
                )}
              </Button>
            </form>
          </Form>
        )}
        {result && (
          <div className="space-y-8 animate-in fade-in-50">
             <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Bot className="h-5 w-5"/> AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.reasoning}</p>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-2xl font-bold mb-4 font-headline text-primary">Recommended Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.services.map(service => <ServiceCard key={service.id} service={service} />)}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 font-headline text-primary">Recommended Software</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.software.map(sw => <SoftwareCard key={sw.id} software={sw} />)}
              </div>
            </div>
            
            <Button onClick={() => setResult(null)} className="w-full" variant="outline">
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
