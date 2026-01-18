import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Facebook, Linkedin, Link as LinkIcon, Twitter } from 'lucide-react';
import { client, sanityConfigured } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import StillNotSure from '@/components/product-page/StillNotSure';
import BlogCard from '@/components/blog-search/BlogCard';
import PartnerCard from '@/components/partners/PartnerCard';

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
  readTime?: number | null;
  author?: {
    _id: string;
    name: string;
    image?: any;
  };
  defaultAuthor?: {
    _id: string;
    name: string;
    image?: any;
  };
  authors?: {
    _id: string;
    name: string;
    image?: any;
  }[];
  seo?: {
    title?: string;
    description?: string;
    canonicalUrl?: string;
  };
  related?: any[];
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
        author->{ _id, name, "image": picture },
        "defaultAuthor": *[_type == "author" && _id == "88b22405-77ad-414f-853f-393cfa0df47b"][0]{ _id, name, "image": picture },
        authors[]->{ _id, name, "image": picture },
        seo,
        related[]->{
          _id,
          _type,
          title,
          "slug": slug.current,
          "summary": coalesce(summary, description),
          heroImage,
          blogType,
          "listingType": coalesce(listingType->value, listingType),
          logo,
          tagline,
          publishedAt,
          // List Specific
          "company_name": title,
          "logo_url": logo.asset->url,
          "listing_tier": listingTier,
          badges[]->{title, description},
          "websiteUrl": websiteURL,
          readTime,
          categories[]->{title}
        }
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
    title: `${post.title} | Broker Tools Blog`,
    description: post.summary ?? 'Broker Tools blog article',
  };
}

// Helper to extract dimensions from Sanity asset ID
const decodeAssetId = (id: string) => {
  const pattern = /^image-([a-f\d]+)-(\d+)x(\d+)-(\w+)$/;
  const match = pattern.exec(id);
  if (!match) {
    return null;
  }
  const [, assetId, width, height, format] = match;
  return {
    assetId,
    width: parseInt(width, 10),
    height: parseInt(height, 10),
    format,
  };
};

// Custom PortableText components (tweak as you like)
const portableComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;

      const dims = decodeAssetId(value.asset._ref);
      const width = dims?.width || 1200;
      const height = dims?.height || 600;

      // Calculate height for 1200px width based on aspect ratio
      const aspectRatio = width / height;
      const displayWidth = 1200;
      const displayHeight = Math.round(displayWidth / aspectRatio);

      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(displayWidth).url()}
            alt={value.alt || 'Blog image'}
            width={displayWidth}
            height={displayHeight}
            className="w-full rounded-xl border border-gray-200"
            style={{ objectFit: 'contain' }}
          />
          {value.caption && (
            <p className="mt-2 text-center text-sm text-gray-500">{value.caption}</p>
          )}
        </div>
      );
    },
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

  const primaryAuthor = post.author || post.defaultAuthor;
  const allAuthors = [primaryAuthor, ...(post.authors || [])].filter(Boolean);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* BREADCRUMBS */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/blog" className="hover:text-brand-blue transition-colors">Posts</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-md">
            {post.title}
          </span>
        </nav>

        {/* TITLE + SUMMARY */}
        <section className="mb-8 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-blue leading-tight mb-4">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {post.summary}
            </p>
          )}
        </section>

        {/* AUTHOR + SOCIAL ROW */}
        <section className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">

          {/* Left: Authors */}
          <div className="flex items-center gap-4">
            {/* Avatar Group */}
            <div className="flex -space-x-4">
              {allAuthors.length > 0 ? (
                allAuthors.map((author: any) => (
                  author.image ? (
                    <Image
                      key={author._id}
                      src={urlFor(author.image).width(100).height(100).url()}
                      alt={author.name}
                      width={48}
                      height={48}
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                    />
                  ) : (
                    <div key={author._id} className="inline-block h-12 w-12 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-bold text-gray-600">
                      {author.name.charAt(0).toUpperCase()}
                    </div>
                  )
                ))
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-bold text-gray-600">
                  B
                </div>
              )}
            </div>

            {/* Author Names & Date */}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-1 text-sm font-semibold text-gray-900">
                {allAuthors.length > 0 ? (
                  allAuthors.map((author: any, index: number) => (
                    <span key={author._id}>
                      <Link
                        href={`/blog?author=${encodeURIComponent(author.name)}`}
                        className="underline decoration-gray-300 hover:decoration-brand-blue cursor-pointer transition-all hover:text-brand-blue"
                      >
                        {author.name}
                      </Link>
                      {index < allAuthors.length - 2 && <span>, </span>}
                      {index === allAuthors.length - 2 && <span> & </span>}
                    </span>
                  ))
                ) : (
                  <span>Broker Tools</span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                {post.publishedAt
                  ? format(new Date(post.publishedAt), 'MMMM d, yyyy')
                  : 'Draft'}
              </div>
            </div>
          </div>

          {/* Right: Social Sharing */}
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#1877F2] hover:text-white transition-colors">
              <Facebook size={18} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-black hover:text-white transition-colors">
              <Twitter size={18} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-colors">
              <Linkedin size={18} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-600 hover:text-white transition-colors">
              <LinkIcon size={18} />
            </button>
          </div>

        </section>

        {/* HERO IMAGE */}
        {post.heroImage && (
          <div className="mb-12 relative w-full overflow-hidden rounded-2xl bg-gray-100 aspect-video md:aspect-[2/1]">
            <Image
              src={urlFor(post.heroImage).width(1600).height(800).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* CONTENT WRAPPER */}
        <div className="max-w-3xl mx-auto">

          {/* BODY */}
          <section className="mb-12">
            {post.body ? (
              <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-blue prose-a:text-brand-orange prose-img:rounded-xl">
                <PortableText value={post.body} components={portableComponents} />
              </article>
            ) : (
              <p className="text-gray-500">
                This article doesn&apos;t have any content yet.
              </p>
            )}
          </section>

          {/* TAGS */}
          {post.tags && post.tags.length > 0 && (
            <section className="mt-8 flex flex-wrap items-center gap-2 mb-16 border-t border-gray-100 pt-8">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-50 px-3 py-1 text-xs text-brand-blue border border-gray-100"
                >
                  #{tag}
                </span>
              ))}
            </section>
          )}

          {/* RELATED CONTENT SECTION */}
          {post.related && post.related.length > 0 && (
            <section className="mt-16 pt-10 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-brand-blue mb-8">Related</h2>

              <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
                {post.related.map((item: any) => {
                  const isBlog = item._type === 'blog';

                  if (isBlog) {
                    const blogProps = {
                      slug: item.slug,
                      title: item.title,
                      heroImageUrl: item.heroImage ? urlFor(item.heroImage).url() : null,
                      blogType: item.blogType,
                      publishedAt: item.publishedAt,
                      description: item.summary,
                      category: item.categories?.[0]?.title,
                      readTime: item.readTime
                    };
                    return (
                      <div key={item._id} className="min-w-[320px] w-[320px] h-[350px] snap-start">
                        <BlogCard post={blogProps} viewMode="grid" aspectRatio="aspect-[2.4/1]" />
                      </div>
                    );
                  } else {
                    // Partner/Listing
                    const partnerProps = {
                      id: item._id, // PartnerCard might typically use this for compare toggle, but we are just linking
                      slug: item.slug,
                      company_name: item.company_name,
                      logo_url: item.logo_url,
                      tagline: item.tagline,
                      description: item.summary,
                      listing_tier: item.listing_tier,
                      badges: item.badges,
                      websiteUrl: item.websiteUrl
                    };
                    return (
                      <div key={item._id} className="min-w-[320px] w-[320px] h-[350px] snap-start">
                        <PartnerCard partner={partnerProps} viewMode="grid" maxDescriptionLines={5} />
                      </div>
                    );
                  }
                })}
              </div>
            </section>
          )}
        </div>

        {/* FOOTER CTA */}
        <section className="mt-12 max-w-5xl mx-auto">
          <StillNotSure />
        </section>

      </div>
    </main>
  );
}
