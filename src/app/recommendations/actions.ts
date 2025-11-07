"use server";

import { z } from "zod";
import { services, software } from "@/lib/data";

const recommendationSchema = z.object({
  businessGoal: z.string(),
  businessSize: z.string(),
  customNeeds: z.string(),
});

// This is a mock GenAI function. In a real scenario, this would import from `@/ai/flows`
// and call the actual GenAI flow.
// e.g. import { recommend } from '@/ai/flows/recommend';
async function mockAiCall(criteria: z.infer<typeof recommendationSchema>) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock logic: return one service and one software based on keywords
  const recommendedService = services.find(s => criteria.customNeeds.toLowerCase().includes('va')) || services[1];
  const recommendedSoftware = software.find(s => criteria.customNeeds.toLowerCase().includes('marketing')) || software[0];
  
  const reasoning = `Based on your goal to '${criteria.businessGoal}' and your business size of '${criteria.businessSize}', we've identified solutions that align with your needs. Your request for help with CRM and social media points towards specific providers.`;

  return {
    services: [recommendedService],
    software: [recommendedSoftware],
    reasoning: reasoning,
  };
}

export async function getRecommendations(criteria: unknown) {
  const parsedCriteria = recommendationSchema.parse(criteria);
  
  // Here you would call the actual GenAI flow.
  // const result = await recommend(parsedCriteria);
  const result = await mockAiCall(parsedCriteria);
  
  return result;
}
