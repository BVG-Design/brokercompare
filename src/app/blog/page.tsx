
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { BlogSearchForm } from '../../components/blog/BlogSearchForm';
import { BlogFilters } from '@/components/blog/BlogFilters';
import { Calendar, Eye, Sparkles, MessageCircle, FileQuestion, ArrowRight, Search } from 'lucide-react';
import { format } from 'date-fns';
import { client, sanityConfigured } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Button } from '@/components/ui/button';
import { QuizWaitlistModal } from '@/components/quiz/quiz-waitlist-modal';
import Script from 'next/script';
import { Badge } from '@/components/ui/badge';

export const revalidate = 60;


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

async function getFilteredPosts(searchTerm?: string, category?: string, brokerType?: string, blogType?: string, authorId?: string): Promise<BlogPost[]> {
  if (!sanityConfigured) return [];

  const searchPattern = searchTerm ? `${searchTerm}*` : '';
  const isAll = !category || category === 'all' || category === 'getting-started' || category.endsWith('-all');
  const isBrokerTypeAll = !brokerType || brokerType === 'all';
  const isBlogTypeAll = !blogType || blogType === 'all';

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
      ${!isBlogTypeAll ? '&& blogType == $blogType' : ''}
      ${authorId ? '&& (author._ref == $authorId || $authorId in authors[]._ref)' : ''}
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
      blogType,
      "listingType": coalesce(listingType->value, listingType),
      logo,
      author->{ _id, name, image },
      authors[]->{ _id, name, image }
    }
  `;

  return await client.fetch<BlogPost[]>(query, {
    search: searchPattern,
    category: category?.replace(/_/g, ' '),
    brokerType: brokerType,
    blogType: blogType,
    authorId: authorId
  });
}

type BlogPageProps = {
  searchParams?: {
    q?: string;
    category?: string;
    brokerType?: string;
    blogType?: string;
    author?: string;
  };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const searchTerm = searchParams?.q?.trim() ?? '';
  const categoryParam = searchParams?.category?.trim();
  const categoryFilter = categoryParam || 'all';
  const brokerTypeFilter = searchParams?.brokerType?.trim() || 'all';
  const blogTypeFilter = searchParams?.blogType?.trim() || 'all';
  const authorFilter = searchParams?.author?.trim();

  const isBrowsingAll = !searchTerm && categoryFilter === 'all' && brokerTypeFilter === 'all' && blogTypeFilter === 'all' && !authorFilter;

  const dashboardData = isBrowsingAll ? await getBlogDashboardData() : null;
  const filteredPosts = !isBrowsingAll ? await getFilteredPosts(searchTerm, categoryFilter, brokerTypeFilter, blogTypeFilter, authorFilter) : [];

  // If we are browsing all, we still need authors for the filters
  const authors = isBrowsingAll ? dashboardData?.authors : (await client.fetch<Author[]>(`*[_type == "author"] { _id, name, picture }`));

  const renderGridCard = (post: BlogPost) => (
    <Card
      key={post._id}
      className="group overflow-hidden border-2 border-brand-orange shadow-sm hover:shadow-2xl hover:shadow-brand-green/20 hover:border-brand-green transition-all duration-500 bg-white rounded-2xl"
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
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {post.categories && post.categories[0] && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold shadow-sm backdrop-blur-md bg-white/90 text-primary uppercase tracking-wider`}
            >
              {post.categories[0].title}
            </span>
          )}
        </div>

        <CardContent className="flex flex-col flex-1 p-6">
          <h2 className="text-lg font-bold text-primary mb-3 group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h2>
          {post.summary && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
              {post.summary}
            </p>
          )}

          <div className="flex items-center text-[10px] font-bold text-muted-foreground mt-auto pt-4 border-t border-border/50 uppercase tracking-widest">
            <span className="text-primary mr-auto">
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

  const renderListCard = (post: BlogPost) => (
    <Link
      key={post._id}
      href={post.slug ? `/blog/${post.slug}` : '#'}
      className="group flex flex-col md:flex-row gap-6 p-4 rounded-2xl hover:bg-white transition-all border border-brand-orange hover:border-brand-green hover:shadow-2xl hover:shadow-brand-green/20"
    >
      <div className="relative w-full md:w-64 aspect-[16/9] md:aspect-square rounded-xl overflow-hidden flex-shrink-0">
        {post.heroImage ? (
          <Image
            src={urlFor(post.heroImage).width(400).height(400).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">No image</div>
        )}
      </div>
      <div className="flex flex-col flex-1 py-2">
        <div className="flex items-center gap-2 mb-3">
          {post.categories?.[0] && (
            <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest">{post.categories[0].title}</span>
          )}
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">• {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-brand-orange transition-colors line-clamp-2">{post.title}</h3>
        {post.summary && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.summary}</p>
        )}
        <div className="mt-auto flex items-center gap-2 text-primary font-bold text-xs">
          Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-brand-cream font-body">
      {/* Main Content Area */}
      <div className="w-full">
        {isBrowsingAll && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6 tracking-tight">
                The Broker Tools <span className="text-secondary"><br />Resource Centre</span>
              </h1>
              <p className="text-lg text-primary/70 max-w-3xl mx-auto leading-relaxed">
                The Broker Tools blog is your go-to resource for all things related to Broker optimisation. <br />From building automated CRM workflows, to dialing in your marketing and client retention plan, learn from experts who've done it before.
              </p>
            </div>

            {/* Hero Section - Solo Subscribe */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="bg-primary rounded-3xl p-10 lg:p-12 text-white flex flex-col justify-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                <h2 className="text-3xl md:text-4xl font-black mb-6 text-center">Optimise the way you work...</h2>
                <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto text-center font-medium">
                  Subscribe to get the latest automation hacks, tech reviews and tips for Brokers delivered to your inbox.
                </p>

                <div className="bg-white rounded-2xl overflow-hidden p-1 shadow-2xl relative z-10 mx-auto w-full max-w-2xl min-h-[400px]">
                  <iframe
                    src="https://link.hubboss.io/widget/form/La2mpDKaSorBUETyReae"
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: '3px' }}
                    id="inline-La2mpDKaSorBUETyReae"
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="Broker Tools"
                    data-height="400"
                    data-layout-iframe-id="inline-La2mpDKaSorBUETyReae"
                    data-form-id="La2mpDKaSorBUETyReae"
                    title="Broker Tools Subscribe"
                  ></iframe>
                  <Script
                    src="https://link.hubboss.io/js/form_embed.js"
                    strategy="afterInteractive"
                  />
                </div>
              </div>
            </div>

            {/* Next Three Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              <Link href="/blog?blogType=podcast" className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 bg-gray-100 flex items-center justify-center">
                <Image src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Podcast.png" alt="Podcasts" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
              <Link href="/blog?blogType=guide" className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 bg-gray-100 flex items-center justify-center">
                <Image src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Workflow%20Guides.png" alt="Guides" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
              <Link href="/blog?blogType=review" className="group relative aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 bg-gray-100 flex items-center justify-center">
                <Image src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Read%20Tech%20Reviews.png" alt="Tech Reviews" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </Link>
            </div>
          </div>
        )}

        {/* Filters and List/Grid Area */}
        <div className="px-8 lg:px-12 pb-24 max-w-7xl mx-auto space-y-24">
          {/* Dashboard Categorized Sections */}
          {isBrowsingAll && dashboardData && (
            <>
              {/* Featured */}
              <section id="featured">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-primary flex items-center gap-3 decoration-secondary/30 decoration-8 underline-offset-4">
                    Featured Articles
                  </h2>
                  <div className="w-12 h-1 bg-secondary/20 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dashboardData.featured.map(renderGridCard)}
                </div>
              </section>

              {/* How To */}
              <section id="how-to">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-primary">How To Guides</h2>
                  <Link href="/blog?blogType=guide" className="text-secondary font-bold text-sm hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dashboardData.guides.map(renderGridCard)}
                </div>
              </section>

              {/* Reviews */}
              <section id="reviews">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-primary">Reviews</h2>
                  <Link href="/blog?blogType=review" className="text-secondary font-bold text-sm hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dashboardData.reviews.map(renderGridCard)}
                </div>
              </section>

              {/* Podcasts */}
              <section id="podcasts">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-primary">Podcasts</h2>
                  <Link href="/blog?blogType=podcast" className="text-secondary font-bold text-sm hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dashboardData.podcasts.map(renderGridCard)}
                </div>
              </section>
            </>
          )}

          {/* Search and Filters Bar */}
          <div className="sticky top-4 z-40 space-y-4">
            <div className="bg-brand-green rounded-3xl p-6 shadow-2xl shadow-primary/5">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="w-full lg:flex-1">
                  <BlogSearchForm initialValue={searchTerm} />
                </div>
                <div className="w-full lg:w-auto overflow-x-auto">
                  <BlogFilters authors={authors} />
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <section className="space-y-12">
            {!isBrowsingAll && (
              <div className="mb-8">
                <h2 className="text-4xl font-black text-primary mb-2">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'Resource Library'}
                </h2>
                <p className="text-primary/60 font-medium">Found {filteredPosts.length} matching resources</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8">
              {(isBrowsingAll ? dashboardData?.latest || [] : filteredPosts || []).map(renderListCard)}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center items-center gap-4 pt-12">
              <Button variant="outline" className="rounded-xl border-2 border-brand-orange text-brand-orange font-bold hover:bg-brand-orange hover:text-white transition-all">Previous</Button>
              <div className="flex gap-2">
                <Button className="w-10 h-10 rounded-xl bg-brand-orange text-white font-bold p-0 border-brand-orange">1</Button>
                <Button variant="outline" className="w-10 h-10 rounded-xl border-brand-orange text-brand-orange font-bold hover:bg-brand-orange hover:text-white p-0 transition-all">2</Button>
                <Button variant="outline" className="w-10 h-10 rounded-xl border-brand-orange text-brand-orange font-bold hover:bg-brand-orange hover:text-white p-0 transition-all">3</Button>
              </div>
              <Button variant="outline" className="rounded-xl border-2 border-brand-orange text-brand-orange font-bold hover:bg-brand-orange hover:text-white transition-all">Next</Button>
            </div>
          </section>

          {/* Footer Features Section */}
          <section className="pt-24 border-t border-primary/10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl font-black text-primary mb-4">Still not sure?</h2>
              <p className="text-lg text-primary/70 font-medium leading-relaxed">
                Talk to AI, our team or take the quiz and we'll help you find the perfect solution for your brokerage
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* AI Recommendation */}
              <Link href="/recommendations" className="group block h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-secondary text-white border-none rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">AI Recommendation</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-8 flex-1">
                      Our advanced AI matches your specific brokerage needs with the perfect tech stack in seconds.
                    </p>
                    <div className="flex items-center text-white text-sm font-black group/btn">
                      Get Matched <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Schedule a Chat */}
              <Link href="/workflow-optimisation" className="group block h-full">
                <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-primary text-white border-none rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">Schedule a Chat</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1">
                      Talk to our software experts for one-on-one advice and tailored implementation support.
                    </p>
                    <div className="flex items-center text-white text-sm font-black group/btn">
                      Book a Session <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Take the Quiz */}
              <QuizWaitlistModal>
                <div className="group block h-full cursor-pointer">
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-accent text-primary border-none rounded-3xl overflow-hidden relative">
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mb-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <CardContent className="p-8 flex flex-col h-full relative z-10">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <FileQuestion className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-2xl font-black mb-4">Take the Quiz</h3>
                      <p className="text-primary/70 text-sm leading-relaxed mb-8 flex-1">
                        Identify your biggest bottlenecks and discover the right solutions with our quick 2-minute diagnostic tool.
                      </p>
                      <div className="flex items-center text-primary text-sm font-black group/btn">
                        Start Now <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </QuizWaitlistModal>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
