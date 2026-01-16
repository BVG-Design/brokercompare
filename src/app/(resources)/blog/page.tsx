
import { client, sanityConfigured } from '@/sanity/lib/client';
import BlogClientPage from '@/components/blog-search/BlogClientPage';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Broker Resource Centre | Guides, Reviews & Podcasts',
  description: 'The ultimate resource hub for mortgage and finance brokers. improve your workflow with our guides, tech reviews and expert podcasts.',
};

type BlogPost = {
  _id: string;
  title: string;
  slug?: string;
  summary?: string;
  heroImage?: any;
  publishedAt?: string;
  categories?: { _id: string; title: string }[];
  tags?: string[];
  viewCount?: number;
  readTime?: number | null;
  blogType?: string;
  listingType?: string;
  author?: {
    _id: string;
    name: string;
    image?: any;
  };
  authors?: {
    _id: string;
    name: string;
    image?: any;
  }[];
};

type Author = {
  _id: string;
  name: string;
  picture?: any;
};

type DashboardData = {
  featured: BlogPost[];
  guides: BlogPost[];
  reviews: BlogPost[];
  podcasts: BlogPost[];
  latest: BlogPost[];
  authors: Author[];
};

async function getBlogDashboardData(): Promise<DashboardData | null> {
  if (!sanityConfigured) return null;

  const query = `{
    "featured": *[_type == "blog" && isFeatured == true] | order(publishedAt desc)[0...3] {
      _id, title, "slug": slug.current, summary, publishedAt, heroImage, 
      categories[]->{ _id, title }, tags, viewCount, readTime, blogType, "listingType": coalesce(listingType->value, listingType)
    },
    "guides": *[_type == "blog" && blogType == "guide"] | order(publishedAt desc)[0...3] {
      _id, title, "slug": slug.current, summary, publishedAt, heroImage, 
      categories[]->{ _id, title }, tags, viewCount, readTime, blogType, "listingType": coalesce(listingType->value, listingType)
    },
    "reviews": *[_type == "blog" && blogType == "review"] | order(publishedAt desc)[0...3] {
      _id, title, "slug": slug.current, summary, publishedAt, heroImage, 
      categories[]->{ _id, title }, tags, viewCount, readTime, blogType, "listingType": coalesce(listingType->value, listingType)
    },
    "podcasts": *[_type == "blog" && blogType == "podcast"] | order(publishedAt desc)[0...3] {
      _id, title, "slug": slug.current, summary, publishedAt, heroImage, 
      categories[]->{ _id, title }, tags, viewCount, readTime, blogType, "listingType": coalesce(listingType->value, listingType)
    },
    "latest": *[_type == "blog"] | order(publishedAt desc)[0...7] {
      _id, title, "slug": slug.current, summary, publishedAt, heroImage, 
      categories[]->{ _id, title }, tags, viewCount, readTime, blogType, listingType,
      author->{ _id, name, image },
      authors[]->{ _id, name, image }
    },
    "authors": *[_type == "author"] { _id, name, picture }
  }`;

  return await client.fetch<DashboardData>(query);
}

async function getCategories() {
  if (!sanityConfigured) return [];
  return await client.fetch<{ title: string, value: string }[]>(`*[_type == "category"] { "title": title, "value": slug.current }`);
}

export default async function BlogPage() {
  const [dashboardData, categories] = await Promise.all([
    getBlogDashboardData(),
    getCategories()
  ]);

  return (
    <BlogClientPage
      initialDashboardData={dashboardData}
      categories={categories || []}
    />
  );
}
