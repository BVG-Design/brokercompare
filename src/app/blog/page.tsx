
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { BlogSearchForm } from '../../components/blog/BlogSearchForm';
import { BlogFilters } from '@/components/blog/BlogFilters';
import { BlogSidebar } from '@/components/blog/BlogSidebar';
import { Calendar, Eye, Menu } from 'lucide-react';
import { format } from 'date-fns';
import { client, sanityConfigured } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { QuizWaitlistModal } from '@/components/quiz/quiz-waitlist-modal';

export const revalidate = 60;


// Update type definition to match what we need
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
  author?: {
    _id: string;
    name: string;
    image?: any;
  };
};

type DashboardData = {
  featured: BlogPost[];
  guides: BlogPost[];
};

async function getPosts(searchTerm?: string, category?: string, brokerType?: string, listingType?: string): Promise<BlogPost[] | DashboardData> {
  if (!sanityConfigured) return [];

  const searchPattern = searchTerm ? `${searchTerm}*` : '';
  const isAll = !category || category === 'all' || category === 'getting-started' || category.endsWith('-all');
  const isBrokerTypeAll = !brokerType || brokerType === 'all';
  const isListingTypeAll = !listingType || listingType === 'all';

  // If we are in "Dashboard" mode (getting-started/all and no search/filters), fetch specific sections
  // Only show dashboard if NO specific search or secondary filters are active
  if (isAll && !searchTerm && isBrokerTypeAll && isListingTypeAll) {
    const dashboardQuery = `{
        "featured": *[_type == "blog"] | order(publishedAt desc)[0...3] {
            _id, title, "slug": slug.current, summary, publishedAt, heroImage, 
            categories[]->{ _id, title }, tags, viewCount, readTime
        },
        "guides": *[_type == "blog" && (count(tags[@ match "Guide"]) > 0 || count(categories[@->title match "Guide"]) > 0)] | order(publishedAt desc)[0...3] {
            _id, title, "slug": slug.current, summary, publishedAt, heroImage, 
            categories[]->{ _id, title }, tags, viewCount, readTime
        }
      }`;
    const data = await client.fetch<DashboardData>(dashboardQuery);
    return data;
  }

  // Standard List Query
  const query = `
    *[
      _type == "blog" &&
      (
        $search == "" ||
        title match $search ||
        summary match $search ||
        count(tags[@ match $search]) > 0 ||
        count(categories[@->title match $search]) > 0
      )
      ${!isAll ? '&& count(categories[@->title match $category]) > 0' : ''}
      ${!isBrokerTypeAll ? '&& count(tags[@ match $brokerType]) > 0' : ''}
      ${!isListingTypeAll ? '&& count(tags[@ match $listingType]) > 0' : ''}
    ] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      summary,
      publishedAt,
      heroImage,
      categories[]->{ _id, title },
      tags,
      viewCount,
      readTime,
      author->{ _id, name, image }
    }
  `;

  const data = await client.fetch<BlogPost[] | null>(
    query,
    {
      search: searchPattern,
      category: category?.replace(/_/g, ' '),
      brokerType: brokerType,
      listingType: listingType
    }
  );

  return Array.isArray(data) ? data : [];
}

const categoryColors: Record<string, string> = {
  Marketing: 'bg-accent/20 text-accent',
  'Virtual Assistant': 'bg-accent/20 text-accent',
  'Commercial Finance': 'bg-secondary/20 text-secondary-foreground',
  CRM: 'bg-secondary/20 text-secondary-foreground',
  'Loan Processing': 'bg-primary/20 text-primary',
  Compliance: 'bg-accent/20 text-accent',
  'Marketing Automation': 'bg-secondary/20 text-secondary-foreground',
};

type BlogPageProps = {
  searchParams?: {
    q?: string;
    category?: string;
    brokerType?: string;
    listingType?: string;
  };
};

import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, FileQuestion, ArrowRight } from 'lucide-react';

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const searchTerm = searchParams?.q?.trim() ?? '';
  const categoryParam = searchParams?.category?.trim();
  const categoryFilter = categoryParam || 'getting-started';

  const brokerTypeFilter = searchParams?.brokerType?.trim() || 'all';
  const listingTypeFilter = searchParams?.listingType?.trim() || 'all';

  const postsOrDashboard = await getPosts(searchTerm, categoryFilter, brokerTypeFilter, listingTypeFilter);
  const isDashboard = !Array.isArray(postsOrDashboard);

  // Dashboard Data Extraction
  const dashboardData = isDashboard ? (postsOrDashboard as DashboardData) : null;
  const posts = isDashboard ? [] : (postsOrDashboard as BlogPost[]);

  // Derive title from category
  const categoryTitle = categoryFilter === 'all' || categoryFilter === 'getting-started'
    ? 'Getting Started'
    : categoryFilter.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const renderCard = (post: BlogPost) => (
    <Card
      key={post._id}
      className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-200 bg-white"
    >
      <Link
        href={post.slug ? `/blog/${post.slug}` : '#'}
        className="flex flex-col h-full"
      >
        <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
          {post.heroImage ? (
            <Image
              src={urlFor(post.heroImage).width(600).height(350).url()}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          {post.categories && post.categories[0] && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-md bg-white/90 text-foreground`}
            >
              {post.categories[0].title}
            </span>
          )}
        </div>

        <CardContent className="flex flex-col flex-1 p-6">
          <h2 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h2>
          {post.summary && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
              {post.summary}
            </p>
          )}

          <div className="flex items-center text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50">
            <span className="font-medium text-foreground mr-auto">
              {post.readTime ? `${post.readTime} min read` : '5 min read'}
            </span>
            <span>
              {post.publishedAt
                ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                : 'Draft'}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-background">

      {/* Desktop Sidebar */}
      <BlogSidebar />

      {/* Mobile Sidebar (Drawer) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="rounded-full h-14 w-14 shadow-xl bg-primary text-primary-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 bg-primary border-r-0">
            <BlogSidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Header Section */}
        <div className="bg-primary text-primary-foreground py-10 px-8 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl font-bold font-headline mb-4">
              {categoryTitle.replace(/-/g, ' ')}
            </h1>
            <p className="text-base text-primary-foreground/80 max-w-2xl mx-auto mb-6">
              Discover insights, guides, and strategies for Australian finance brokers.
            </p>
            <div className="max-w-3xl mx-auto mb-4">
              <BlogSearchForm
                initialValue={searchTerm}
                className="w-full"
              />
            </div>
            {/* Filters Section */}
            <div className="relative z-10 w-full text-left">
              <BlogFilters />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-8 lg:p-12 max-w-7xl space-y-16">

          {/* DASHBOARD VIEW */}
          {isDashboard && dashboardData ? (
            <>
              {/* Section 1: Getting Started (Featured) */}
              <section>
                <h2 className="text-2xl font-bold font-headline mb-6 text-foreground flex items-center gap-2">
                  Getting Started
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {dashboardData.featured.length > 0 ? (
                    dashboardData.featured.map(renderCard)
                  ) : (
                    <p className="text-muted-foreground">No featured articles found.</p>
                  )}
                </div>
              </section>

              {/* Section 2: Guides */}
              <section>
                <h2 className="text-2xl font-bold font-headline mb-6 text-foreground flex items-center gap-3">
                  Guides
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">Coming Soon</Badge>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {dashboardData.guides.length > 0 ? (
                    dashboardData.guides.map(renderCard)
                  ) : (
                    // Placeholder if no guides are found, matching "Coming Soon" vibe
                    [1, 2, 3].map((i) => (
                      <Card key={i} className="border-dashed border-2 shadow-none bg-muted/30">
                        <div className="aspect-[16/9] bg-muted/50 flex items-center justify-center">
                          <p className="text-sm text-muted-foreground font-medium">Coming Soon</p>
                        </div>
                        <CardContent className="p-6">
                          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>

              {/* Section 3: Get Matched (Replaced Resources) */}
              <section>
                <h2 className="text-2xl font-bold font-headline mb-6 text-foreground">
                  Get Matched
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* AI Recommendation - Brand Orange (Secondary) */}
                  <Link href="/recommendations" className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-transform hover:-translate-y-1 bg-secondary text-secondary-foreground border-none">
                      <CardContent className="p-6 flex flex-col h-full">
                        <Sparkles className="w-8 h-8 text-white mb-4" />
                        <h3 className="text-lg font-bold mb-2">AI Recommendation</h3>
                        <p className="text-secondary-foreground/90 text-sm flex-1">
                          Use our advanced AI to find the perfect software stack for your specific brokerage needs.
                        </p>
                        <div className="mt-4 flex items-center text-white text-sm font-semibold group">
                          Get started <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Schedule a Chat - Brand Blue (Primary) */}
                  <Link href="#" className="block h-full">
                    <Card className="h-full hover:shadow-lg transition-transform hover:-translate-y-1 bg-primary text-primary-foreground border-none">
                      <CardContent className="p-6 flex flex-col h-full">
                        <MessageCircle className="w-8 h-8 text-white mb-4" />
                        <h3 className="text-lg font-bold mb-2">Schedule a Chat</h3>
                        <p className="text-primary-foreground/80 text-sm flex-1">
                          Talk to one of our software experts to get personalized advice and implementation support.
                        </p>
                        <div className="mt-4 flex items-center text-white text-sm font-semibold group">
                          Book a call <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  {/* Take the Quiz - Brand Accent */}
                  <QuizWaitlistModal>
                    <div className="block h-full cursor-pointer">
                      <Card className="h-full hover:shadow-lg transition-transform hover:-translate-y-1 bg-accent text-accent-foreground border-none">
                        <CardContent className="p-6 flex flex-col h-full">
                          <FileQuestion className="w-8 h-8 text-white mb-4" />
                          <h3 className="text-lg font-bold mb-2">Take the Quiz</h3>
                          <p className="text-accent-foreground/90 text-sm flex-1">
                            Answer a few quick questions to identify your key pain points and opportunities.
                          </p>
                          <div className="mt-4 flex items-center text-white text-sm font-semibold group">
                            Start Quiz <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </QuizWaitlistModal>
                </div>
              </section>
            </>
          ) : (
            // STANDARD LIST VIEW (Search results or Category specific)
            <>
              {searchTerm && (
                <p className="text-sm text-muted-foreground mb-6">
                  Showing {posts.length} {posts.length === 1 ? 'result' : 'results'} for "{searchTerm}"
                </p>
              )}

              {posts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find any articles for this category yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map(renderCard)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

