"use server";

import { z } from "zod";
import { client } from "@/../sanity/lib/client";
import { groq as sanityGroq } from "next-sanity";
import OpenAI from "openai";
import type { Service, Software } from "@/lib/types";

// Schema for the existing form-based recommendations
const recommendationSchema = z.object({
  businessGoal: z.string(),
  businessSize: z.string(),
  customNeeds: z.string(),
});

// Schema for the AI-generated search intent (from user's system prompt)
const aiSearchIntentSchema = z.object({
  query: z.string(),
  listingType: z.array(z.string()).optional(),
  brokerType: z.array(z.string()).optional(),
  pricingType: z.array(z.string()).optional(),
  journeyAssociations: z.array(z.string()).optional(),
  mustKeywords: z.array(z.string()).optional(),
  niceKeywords: z.array(z.string()).optional(),
  limit: z.number().optional().default(8),
});

type AISearchIntent = z.infer<typeof aiSearchIntentSchema>;

// --- Existing functionality for the full page form ---
const RECOMMENDATION_QUERY = sanityGroq`
  *[_type == "directoryListing" && (
    title match $keywords || 
    description match $keywords || 
    tagline match $keywords ||
    category->title match $keywords
  )] | order(isFeatured desc, rating desc)[0...6] {
    _id,
    _type,
    "name": title,
    description,
    tagline,
    "logoUrl": logo.asset->url,
    "category": category->title,
    "slug": slug.current,
    "listingType": coalesce(listingType->value, listingType),
    location,
    websiteURL,
    features,
    "reviews": []
  }
`;

async function fetchSanityRecommendations(criteria: z.infer<typeof recommendationSchema>) {
  const keywords = criteria.customNeeds
    .split(/\s+/)
    .filter(word => word.length > 3)
    .map(word => `${word}*`)
    .join(' ');

  try {
    const results = await client.fetch(RECOMMENDATION_QUERY, { keywords });
    return mapResultsToResponse(results, `Based on your goal to '${criteria.businessGoal}'...`);
  } catch (error) {
    console.error("Sanity recommendation fetch error:", error);
    return { services: [], software: [], reasoning: "Error fetching results." };
  }
}

export async function getRecommendations(criteria: unknown) {
  const parsedCriteria = recommendationSchema.parse(criteria);
  return await fetchSanityRecommendations(parsedCriteria);
}


// --- NEW AI Chat functionality (xAI / Grok) ---

const SYSTEM_PROMPT = `You are an assistant that converts a user's natural language request into a STRICT search intent for a Sanity CMS dataset.

Dataset:
- Document type: directoryListing
- The system will search listings using keywords against:
  - title
  - tagline
  - description
  - category.title
  - synonyms[]

Rules:
- Output JSON ONLY. No markdown. No explanation.
- Do NOT invent filters that are not explicitly listed below.
- Do NOT invent vendor names or listings.
- Prefer keyword-based intent over hard filters unless clearly stated.
- If the request is vague or ambiguous, still return a usable intent.

Allowed fields and values:

listingType:
- "software"
- "service"

brokerType:
- "Mortgage"
- "Asset Finance"
- "Commercial"

pricingType:
- "free"
- "subscription"
- "one_time"
- "quote"

journeyAssociations:
- "people"
- "tools"
- "processes"

Return this JSON shape EXACTLY:

{
  "query": string,
  "listingType": string[],
  "brokerType": string[],
  "pricingType": string[],
  "journeyAssociations": string[],
  "mustKeywords": string[],
  "niceKeywords": string[],
  "limit": number
}

Guidelines:
- "query" should be a short natural-language summary of the user's intent.
- "listingType" should be inferred if possible (e.g. tools/software vs implementation/services).
- "mustKeywords" should be 2–6 strong terms suitable for wildcard text matching.
- "niceKeywords" may include broader or secondary terms.
- Avoid stop words and generic filler (e.g. "help", "need", "looking").
- If unsure about a field, return an empty array for that field.
- limit default: 8`;

export async function getAIRecommendations(userMessage: string) {
  try {
    // 1. Initialize OpenAI client for xAI
    const apiKey = process.env.XAI_API_KEY;
    console.log("Starting AI Recommendation (xAI) for:", userMessage);

    if (!apiKey) {
      console.error("XAI_API_KEY is missing");
      return {
        services: [],
        software: [],
        reasoning: "System Error: XAI_API_KEY is missing. Please add it to your .env file and restart the server."
      };
    }

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.x.ai/v1",
    });

    // 2. Get structured intent from xAI
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      model: "grok-4-fast-non-reasoning",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("No content received from xAI");

    console.log("xAI Intent:", content);
    let intent;
    try {
      intent = aiSearchIntentSchema.parse(JSON.parse(content));
    } catch (parseError) {
      console.error("Failed to parse xAI response:", content);
      throw new Error("AI returned invalid JSON format.");
    }

    // 2. Build Sanity Query from Intent
    const filters = ['_type == "directoryListing"'];

    // RELAXED FILTERING: Include items where the field is null/undefined to handle sparse data
    if (intent.listingType && intent.listingType.length > 0) {
      filters.push(`(listingType->value in ${JSON.stringify(intent.listingType)} || !defined(listingType))`);
    }

    if (intent.brokerType && intent.brokerType.length > 0) {
      const types = JSON.stringify(intent.brokerType);
      filters.push(`(count((brokerTypes[])[@ in ${types}]) > 0 || !defined(brokerTypes))`);
    }

    if (intent.pricingType && intent.pricingType.length > 0) {
      filters.push(`(pricingType in ${JSON.stringify(intent.pricingType)} || !defined(pricingType))`);
    }

    const allKeywords = [...(intent.mustKeywords || []), ...(intent.niceKeywords || [])];
    if (allKeywords.length > 0) {
      const keywordFilterPart = allKeywords.map(k => `(
        title match "${k}*" || 
        tagline match "${k}*" || 
        description match "${k}*" ||
        category->title match "${k}*"
      )`).join(' || ');
      filters.push(`(${keywordFilterPart})`);
    }

    const filterString = filters.join(' && ');
    const limit = intent.limit || 8;

    const query = sanityGroq`
      *[${filterString}] | order(isFeatured desc, _score desc)[0...${limit}] {
        _id,
        _type,
        "name": title,
        "listingType": coalesce(listingType->value, listingType),
        category->{title},
        tagline,
        description,
        "logoUrl": logo.asset->url,
        "slug": slug.current,
        websiteURL,
        location,
        features,
        isFeatured
      }
    `;

    console.log("Sanity Query:", query);

    // 3. Execute Search
    const results = await client.fetch(query);
    console.log("Sanity Results Count:", results.length);

    let finalReasoning = `I understand you're looking for ${intent.query}. Here are some partners that can help with that:`;

    if (results.length === 0) {
      finalReasoning = `I understand you're looking for ${intent.query}. While I don't have exact matches right now, try exploring our broader categories or creating a custom request.`;
    }

    return mapResultsToResponse(results, finalReasoning);

  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return {
      services: [],
      software: [],
      reasoning: `I'm having trouble connecting to my brain right now. Debug Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

// Helper to format results into { services, software, reasoning }
function mapResultsToResponse(results: any[], reasoning: string) {
  const services: Service[] = [];
  const software: Software[] = [];

  results.forEach((item: any) => {
    const mappedItem = {
      id: item._id,
      name: item.name,
      tagline: item.tagline || "",
      description: item.description || "",
      logoUrl: item.logoUrl || "",
      category: item.category?.title || "Uncategorized",
      location: item.location || "Online",
      website: item.websiteURL || "",
      features: item.features || [],
      reviews: [],
      slug: item.slug,
    };

    if (item.listingType === 'software') {
      software.push({
        ...mappedItem,
        slug: item.slug,
        pricing: "Contact for pricing",
        compatibility: [],
        isFeatured: item.isFeatured || false,
      } as unknown as Software);
    } else {
      services.push(mappedItem as unknown as Service);
    }
  });

  return { services, software, reasoning };
}
