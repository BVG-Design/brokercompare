"use server";

import { z } from "zod";
import { client } from "@/../sanity/lib/client";
import { groq } from "next-sanity";
import type { Service, Software } from "@/lib/types";

const recommendationSchema = z.object({
  businessGoal: z.string(),
  businessSize: z.string(),
  customNeeds: z.string(),
});

// Query to find relevant directory listings based on keywords
const RECOMMENDATION_QUERY = groq`
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
    "reviews": [] // Placeholder as we don't fetch all reviews here
  }
`;

async function fetchSanityRecommendations(criteria: z.infer<typeof recommendationSchema>) {
  // Simple keyword extraction from customNeeds
  const keywords = criteria.customNeeds
    .split(/\s+/)
    .filter(word => word.length > 3)
    .map(word => `${word}*`)
    .join(' ');

  try {
    const results = await client.fetch(RECOMMENDATION_QUERY, { keywords });

    const services: Service[] = [];
    const software: Software[] = [];

    results.forEach((item: any) => {
      const mappedItem = {
        id: item._id,
        name: item.name,
        tagline: item.tagline || "",
        description: item.description || "",
        logoUrl: item.logoUrl || "",
        category: item.category || "Uncategorized",
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
          pricing: "Contact for pricing", // Default as we'd need more logic for pricing tiers
          compatibility: [],
        } as unknown as Software);
      } else {
        services.push(mappedItem as unknown as Service);
      }
    });

    const reasoning = `Based on your goal to '${criteria.businessGoal}' and your business size of '${criteria.businessSize}', we've identified solutions that align with your needs. Your request for help with '${criteria.customNeeds}' matches the following providers in our directory.`;

    return {
      services,
      software,
      reasoning,
    };
  } catch (error) {
    console.error("Sanity recommendation fetch error:", error);
    return {
      services: [],
      software: [],
      reasoning: "We encountered an error while searching for recommendations. Please try again later.",
    };
  }
}

export async function getRecommendations(criteria: unknown) {
  const parsedCriteria = recommendationSchema.parse(criteria);
  return await fetchSanityRecommendations(parsedCriteria);
}
