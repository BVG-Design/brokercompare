import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { BlogSearchForm } from '../../components/blog/BlogSearchForm';
import { Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { client, sanityConfigured } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

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
  author?: {                 
    _id: string;
    name: string;
    image?: any;
  };
};

async function getPosts(searchTerm?: string): Promise<BlogPost[]> {
  if (!sanityConfigured) return [];

  const searchPattern = searchTerm ? `${searchTerm}*` : '';

  const data = await client.fetch<BlogPost[] | null>(
    `
    *[
      _type == "blog" &&
      (
        $search == "" ||
        title match $search ||
        summary match $search ||
        count(tags[@ match $search]) > 0 ||
        count(categories[@->title match $search]) > 0
      )
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
  `,
    { search: searchPattern }
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
  };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const searchTerm = searchParams?.q?.trim() ?? '';
  const posts = await getPosts(searchTerm);

  // Build a simple category count for the sidebar
  const categoryMap = new Map<
    string,
    { title: string; count: number }
  >();

  for (const post of posts) {
    for (const cat of post.categories ?? []) {
      const existing = categoryMap.get(cat._id);
      if (existing) {
        existing.count += 1;
      } else {
        categoryMap.set(cat._id, { title: cat.title, count: 1 });
      }
    }
  }

  const categories = Array.from(categoryMap.values());

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-4 mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover insights, guides, and strategies for Australian finance brokers to grow and optimize your brokerage.
            </p>
            <BlogSearchForm initialValue={searchTerm} />
            {searchTerm && (
              <p className="text-sm text-muted-foreground">
                Showing {posts.length} {posts.length === 1 ? 'result' : 'results'} for "{searchTerm}"
              </p>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              {searchTerm ? (
                <>
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">No matches</h3>
                  <p className="text-muted-foreground">
                    Sorry, nothing matched your search. Try a different keyword or clear the search to browse all posts.
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    We&apos;re working on great content for you. Check back soon!
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)] gap-8">
              {/* MAIN COLUMN – big horizontal blog cards */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <Card
                    key={post._id}
                    className="group overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    <Link
                      href={post.slug ? `/blog/${post.slug}` : '#'}
                      className="flex flex-col md:flex-row h-full"
                    >
                      {/* Left image column */}
                      {post.heroImage ? (
                        <div className="relative md:w-72 w-full shrink-0 bg-muted">
                          <Image
                            src={urlFor(post.heroImage).width(600).height(350).url()}
                            alt={post.title}
                            width={600}
                            height={350}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {post.categories && post.categories[0] && (
                            <span
                              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                                categoryColors[post.categories[0].title] ??
                                'bg-primary text-primary-foreground'
                              }`}
                            >
                              {post.categories[0].title}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="md:w-72 w-full shrink-0 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                          No image
                        </div>
                      )}

                      {/* Right content column */}
                      <CardContent className="flex flex-col justify-between p-6 gap-3 flex-1">
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          {post.summary && (
                            <p className="text-muted-foreground text-sm md:text-base line-clamp-3 mb-3">
                              {post.summary}
                            </p>
                          )}

                          {/* Tags as small inline pills */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                                >
                                  #{tag}
                                </span>
                              ))}
                              {post.tags.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{post.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm text-muted-foreground mt-2">
  <div className="flex items-center gap-2">
    <span className="inline-flex items-center gap-1">
      <Calendar className="w-4 h-4" />
      <span>
        {post.publishedAt
          ? format(new Date(post.publishedAt), 'MMM d, yyyy')
          : 'Draft'}
      </span>
    </span>

    {post.readTime && (
      <>
        <span className="text-muted-foreground/60">•</span>
        <span>{post.readTime} min read</span>
      </>
    )}
  </div>

  <div className="flex items-center gap-3">
    {typeof post.viewCount === 'number' && (
      <span className="inline-flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span>{post.viewCount.toLocaleString()} views</span>
      </span>
    )}
    {post.categories && post.categories.length > 1 && (
      <span className="text-xs text-muted-foreground">
        +{post.categories.length - 1} more categories
      </span>
    )}
  </div>
</div>

                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* SIDEBAR – promo cards, categories */}
              <aside className="space-y-6">
                {/* Promo cards like "Learn SEO" / "Write for us" */}
                <Card className="border-none bg-primary text-primary-foreground">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] mb-2 text-accent">
                      Learn
                    </p>
                    <h3 className="text-lg font-semibold mb-1">Learn broker marketing</h3>
                    <p className="text-xs text-primary-foreground/80">
                      Guides, playbooks, and strategies for Australian finance brokers.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-secondary text-secondary-foreground">
                  <CardContent className="p-5">
                    <p className="text-xs uppercase tracking-[0.18em] mb-2">
                      Contribute
                    </p>
                    <h3 className="text-lg font-semibold mb-1">
                      Write for BrokerMatch
                    </h3>
                    <p className="text-xs text-secondary-foreground/80">
                      Have a story, case study, or framework brokers should know about?
                    </p>
                  </CardContent>
                </Card>

                {/* Category list */}
                {categories.length > 0 && (
                  <Card className="border">
                    <CardContent className="p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        Categories
                      </h3>
                      <div className="space-y-2 text-sm">
                        {categories.map((cat) => (
                          <div
                            key={cat.title}
                            className="flex items-center justify-between text-foreground"
                          >
                            <span>{cat.title}</span>
                            <span className="text-muted-foreground text-xs">
                              {cat.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </aside>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
