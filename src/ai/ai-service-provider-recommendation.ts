'use server';

/**
 * @fileOverview AI-powered service provider recommendation flow for brokers.
 *
 * - recommendServiceProviders - A function that provides service provider recommendations.
 * - BrokerProfile - The input type for the recommendServiceProviders function.
 * - RecommendationOutput - The return type for the recommendServiceProviders function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BrokerProfileSchema = z.object({
  businessType: z.string().describe('The type of brokerage business (e.g., residential, commercial).'),
  yearsInBusiness: z.number().describe('The number of years the broker has been in business.'),
  location: z.string().describe('The location of the brokerage.'),
  specialization: z.string().describe('The broker’s specialization (e.g., first home buyers, investment properties).'),
  needs: z.string().describe('Description of the brokers specific needs or pain points related to marketing, virtual assistance, or commercial finance.'),
  budget: z.string().describe('The budget the broker has available for these services.'),
});
export type BrokerProfile = z.infer<typeof BrokerProfileSchema>;

const RecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      providerName: z.string().describe('The name of the service provider.'),
      serviceType: z.string().describe('The type of service provided (marketing, virtual assistant, commercial finance).'),
      suitabilityScore: z.number().describe('A score indicating how well the provider matches the broker’s needs (0-100).'),
      rationale: z.string().describe('Explanation of why the provider is a good match for the broker.'),
    })
  ).describe('A list of recommended service providers and their suitability scores.'),
});
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

export async function recommendServiceProviders(profile: BrokerProfile): Promise<RecommendationOutput> {
  return recommendServiceProvidersFlow(profile);
}

const prompt = ai.definePrompt({
  name: 'recommendServiceProvidersPrompt',
  input: { schema: BrokerProfileSchema },
  output: { schema: RecommendationOutputSchema },
  prompt: `You are an AI assistant specializing in recommending service providers (marketing, virtual assistants, and commercial finance providers) to brokers in Australia.

  Based on the following broker profile, provide a list of service provider recommendations, including a suitability score and a rationale for each recommendation.

  Broker Profile:
  Business Type: {{{businessType}}}
  Years in Business: {{{yearsInBusiness}}}
  Location: {{{location}}}
  Specialization: {{{specialization}}}
  Needs: {{{needs}}}
  Budget: {{{budget}}}

  Format your output as a JSON object with a \"recommendations\" array. Each object in the array should include the providerName, serviceType, suitabilityScore, and rationale.

  Follow the RecommendationOutputSchema definition when generating the JSON. Ensure that suitabilityScore is a number between 0 and 100.

  Ensure the output can be parsed by JSON.parse().
  `,
});

const recommendServiceProvidersFlow = ai.defineFlow(
  {
    name: 'recommendServiceProvidersFlow',
    inputSchema: BrokerProfileSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
