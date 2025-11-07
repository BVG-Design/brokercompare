'use server';

/**
 * @fileOverview Provides AI-powered software recommendations for brokers based on their needs and profile.
 *
 * - recommendSoftware - A function that takes broker profile characteristics and returns a list of recommended software.
 * - AISoftwareRecommendationInput - The input type for the recommendSoftware function.
 * - AISoftwareRecommendationOutput - The return type for the recommendSoftware function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISoftwareRecommendationInputSchema = z.object({
  brokerProfile: z
    .string()
    .describe(
      'Description of the broker profile, including specialization, location, and business needs.'
    ),
  softwareList: z
    .string()
    .describe(
      'A list of available softwares with features, pricing, and compatibility information.'
    ),
});
export type AISoftwareRecommendationInput = z.infer<
  typeof AISoftwareRecommendationInputSchema
>;

const AISoftwareRecommendationOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'A list of recommended software options, with explanations for each recommendation.'
    ),
});
export type AISoftwareRecommendationOutput = z.infer<
  typeof AISoftwareRecommendationOutputSchema
>;

export async function recommendSoftware(
  input: AISoftwareRecommendationInput
): Promise<AISoftwareRecommendationOutput> {
  return recommendSoftwareFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendSoftwarePrompt',
  input: {schema: AISoftwareRecommendationInputSchema},
  output: {schema: AISoftwareRecommendationOutputSchema},
  prompt: `You are an AI assistant that recommends software to brokers based on their profile and needs.

  Given the following broker profile:
  {{brokerProfile}}

  And the following list of available software options:
  {{softwareList}}

  Recommend the best software options for the broker, and explain why each option is a good fit.
  Format the output in a way that is easy to read and understand.
  `,
});

const recommendSoftwareFlow = ai.defineFlow(
  {
    name: 'recommendSoftwareFlow',
    inputSchema: AISoftwareRecommendationInputSchema,
    outputSchema: AISoftwareRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
