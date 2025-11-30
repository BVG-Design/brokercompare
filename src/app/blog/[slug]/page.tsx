// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { client, sanityConfigured } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

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
    body?: any;
    readTime?: number | null; // NEW
    author?: {                 // NEW
      _id: string;
      name: string;
      image?: any;
    };
    authors?: {                // if you added extra authors[]
      _id: string;
      name: string;
      image?: any;
    }[];
    seo?: {                    // if you added seo object
      title?: string;
      description?: string;
      canonicalUrl?: string;
    };
  };

const categoryColors: Record<string, string> = {
  Marketing: 'bg-blue-100 text-blue-700',
  'Virtual Assistant': 'bg-green-100 text-green-700',
  'Commercial Finance': 'bg-purple-100 text-purple-700',
  CRM: 'bg-orange-100 text-orange-700',
  'Loan Processing': 'bg-indigo-100 text-indigo-700',
  Compliance: 'bg-pink-100 text-pink-700',
  'Marketing Automation': 'bg-yellow-100 text-yellow-700',
};

// Fetch a single post by slug

async function getPost(slug: string): Promise<BlogPost | null> {
    if (!sanityConfigured) return null;

    const post = await client.fetch<BlogPost | null>(
      `
      *[_type == "blog" && slug.current == $slug][0]{
        _id,
        title,
        "slug": slug.current,
        summary,
        publishedAt,
        heroImage,
        categories[]->{ _id, title },
        tags,
        viewCount,
        body,
        readTime,
        author->{ _id, name, image },
        authors[]->{ _id, name, image },
        seo
      }
    `,
      { slug }
    );

    return post ?? null;
  }

// For static generation of all blog/[slug] pages
export async function generateStaticParams() {
  if (!sanityConfigured) return [];

  const slugs: string[] | null = await client.fetch(
    `*[_type == "blog" && defined(slug.current)][].slug.current`
  );

  return Array.isArray(slugs) ? slugs.map((slug) => ({ slug })) : [];
}

// Optional: SEO metadata per post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | BrokerMatch Blog`,
    description: post.summary ?? 'BrokerMatch blog article',
  };
}

// Custom PortableText components (tweak as you like)
const portableComponents = {
  types: {
    image: ({ value }: any) =>
      value?.asset ? (
        <div className="my-8">
          <Image
            src={urlFor(value).width(1200).height(600).url()}
            alt={value.alt || 'Blog image'}
            width={1200}
            height={600}
            className="w-full rounded-xl border border-gray-200 object-cover"
          />
          {value.caption && (
            <p className="mt-2 text-center text-sm text-gray-500">{value.caption}</p>
          )}
        </div>
      ) : null,
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="mt-10 mb-3 text-2xl font-semibold text-gray-900">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-8 mb-2 text-xl font-semibold text-gray-900">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-4 list-disc pl-6 space-y-1 text-gray-700">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-4 list-decimal pl-6 space-y-1 text-gray-700">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    link: ({ value, children }: any) => (
      <a
        href={value?.href}
        className="text-indigo-600 underline decoration-indigo-300 hover:decoration-indigo-500"
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
};

export default async function BlogPostPage({
    params,
  }: {
    params: { slug: string };
  }) {
    const post = await getPost(params.slug);
  
    if (!post) {
      notFound();
    }
  
    const mainCategory = post.categories?.[0];
  
    return (
      <>
        <Header />
  
        <main className="min-h-screen bg-[#f4f6fb]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* HERO IMAGE – centred and wide like the reference */}
            {post.heroImage && (
              <div className="mb-10 flex justify-center">
                <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={urlFor(post.heroImage).width(1400).height(700).url()}
                    alt={post.title}
                    width={1400}
                    height={700}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
  
            {/* CONTENT WRAPPER (narrower column like Mangoools) */}
            <div className="max-w-3xl mx-auto">
              {/* META ROW */}
              <section className="mb-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  {/* Left: author */}
                  <div className="flex items-center gap-3">
                    {post.author?.image ? (
                      <Image
                        src={urlFor(post.author.image).width(80).height(80).url()}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {post.author?.name
                          ? post.author.name.charAt(0).toUpperCase()
                          : 'B'}
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        {post.author?.name ?? 'BrokerMatch Team'}
                      </p>
                      <p className="text-xs text-gray-500">BrokerMatch Blog</p>
                    </div>
                  </div>
  
                  {/* Right: date / read time / category */}
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
  <span className="inline-flex items-center gap-1">
    <Calendar className="w-4 h-4" />
    {post.publishedAt
      ? format(new Date(post.publishedAt), 'MMM d, yyyy')
      : 'Draft'}
  </span>

  {post.readTime && (
    <>
      <span className="text-gray-300">•</span>
      <span>{post.readTime} min read</span>
    </>
  )}

  {mainCategory && (
    <>
      <span className="text-gray-300">•</span>
      <span className="text-indigo-600 font-medium">
        #{mainCategory.title}
      </span>
    </>
  )}
</div>

                </div>
              </section>
  
              {/* SHARE ICONS ROW – simple version to echo the reference */}
              <section className="mb-4 flex flex-wrap items-center gap-2">
                <button className="inline-flex h-8 w-8 items-center justify-center rounded bg-black text-white text-xs font-semibold">
                  X
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#0A66C2] text-white text-xs font-semibold">
                  in
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#1877F2] text-white text-xs font-semibold">
                  f
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#DB4437] text-white text-xs font-semibold">
                  M
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#FF4500] text-white text-xs font-semibold">
                  R
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded bg-[#2563EB] text-white text-xs font-semibold">
                  +
                </button>
              </section>
  
              {/* TITLE + SUMMARY */}
              <section className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                  {post.title}
                </h1>
                {post.summary && (
                  <p className="text-lg text-gray-600">
                    {post.summary}
                  </p>
                )}
              </section>
  
              {/* BODY – plain prose, no card box */}
              <section className="mb-8">
                {post.body ? (
                  <article className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-indigo-600">
                    <PortableText value={post.body} components={portableComponents} />
                  </article>
                ) : (
                  <p className="text-gray-500">
                    This article doesn&apos;t have any content yet.
                  </p>
                )}
              </section>
  
              {/* TAGS AT BOTTOM */}
              {post.tags && post.tags.length > 0 && (
                <section className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </section>
              )}
            </div>
          </div>
        </main>
  
        <Footer />
      </>
    );
  }
  
  
