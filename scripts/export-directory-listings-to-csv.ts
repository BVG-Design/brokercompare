import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const projectId = 'vrf26tjl';
const dataset = 'production';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-10-01',
  useCdn: false,
});

// Helper function to flatten nested values for CSV
function flattenValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') {
    // Escape quotes and newlines for CSV
    return value.replace(/"/g, '""').replace(/\n/g, ' ').replace(/\r/g, '');
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    // Handle array of objects (like similarTo, features)
    if (typeof value[0] === 'object' && value[0] !== null) {
      return value.map((item: any) => {
        if (item.listing && item.priority !== undefined) {
          return `${item.listing} (Priority: ${item.priority})`;
        }
        if (item.feature && item.value !== undefined) {
          const parts = [item.feature, item.value];
          if (item.notes) parts.push(`Notes: ${item.notes}`);
          return parts.join(' - ');
        }
        return JSON.stringify(item);
      }).join(' | ');
    }
    return value.join(' | ');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

// Get all directory listings with expanded references
async function getAllDirectoryListings() {
  const query = `*[_type == "directoryListing"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    supabaseId,
    "listingType": listingType->title,
    "listingTypeValue": listingType->value,
    tagline,
    description,
    "category": category->title,
    "logo": logo.asset->url,
    websiteURL,
    brokerType,
    "features": features[] {
      "feature": feature->title,
      "value": value,
      "notes": notes
    },
    "pricingType": pricing.type,
    "pricingStartingFrom": pricing.startingFrom,
    "pricingNotes": pricing.notes,
    "serviceAreas": serviceAreas[]->title,
    "worksWith": worksWith[]->title,
    "similarTo": similarTo[] {
      "listing": listing->title,
      priority
    },
    "serviceProviders": serviceProviders[]->title,
    "author": author->name,
    editorNotes,
    metaDescription,
    synonyms,
    isFeatured,
    "badges": badges[]->title,
    "ratingAverage": rating.average,
    "ratingReviewCount": rating.reviewCount,
    "trustMetricsResponseTimeHours": trustMetrics.responseTimeHours,
    "trustMetricsVerifiedRatio": trustMetrics.verifiedRatio,
    "trustMetricsReviewRecencyDays": trustMetrics.reviewRecencyDays,
    viewCount,
    "journeyStage": journeyStage->title,
    journeyAssociations
  }`;

  const documents = await client.fetch(query);
  return documents;
}

// Convert array of objects to CSV
function arrayToCSV(data: any[]): string {
  if (data.length === 0) return '';

  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });

  const headers = Array.from(allKeys).sort();
  const rows: string[] = [];

  // Header row
  rows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  // Data rows
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header];
      const flattened = flattenValue(value);
      return `"${flattened}"`;
    });
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

async function main() {
  try {
    console.log('Fetching directory listings from Sanity...');
    const listings = await getAllDirectoryListings();
    console.log(`Found ${listings.length} directory listings`);

    console.log('Converting to CSV...');
    const csv = arrayToCSV(listings);

    const outputPath = path.join(process.cwd(), 'sanity', 'csv-export', 'directoryListing.csv');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, csv, 'utf-8');

    console.log(`\n✅ CSV exported successfully!`);
    console.log(`📁 Location: ${outputPath}`);
    console.log(`📊 Total records: ${listings.length}`);
    console.log(`📋 Columns: ${Object.keys(listings[0] || {}).length}`);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
