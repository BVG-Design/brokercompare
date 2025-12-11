'use client';

import React, { useEffect, useState } from 'react';
import { Search, Sparkles, ArrowRight, Users, MessageSquare, FileText, Megaphone, Target, Home as HomeIcon, BarChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrmSystemIcon, DocumentCollectionIcon, VaServicesIcon, AiSoftwareIcon, TroubleshootIcon, AiAutomationsIcon, MarketingLeadGenIcon, BusinessStrategyIcon, LoanStructureIcon, WorkflowOpsIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { FEATURED_BLOGS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { fetchResourcePosts } from '@/services/sanity';
import { ResourcePost } from '@/types';
import Link from 'next/link';
import { QuizWaitlistModal } from '@/components/quiz/quiz-waitlist-modal';
import BetaConsentModal from "@/components/shared/BetaConsentModal";

const Home: React.FC = () => {

  const categories = [
    { name: 'CRM Systems', icon: Users, slug: 'crm', bg: 'bg-white' },
    { name: 'Document Collection', icon: FileText, slug: 'docs', bg: 'bg-white' },
    { name: 'VA Services', icon: MessageSquare, slug: 'va', bg: 'bg-white' },
    { name: 'AI Software and Services', icon: Sparkles, slug: 'ai', bg: 'bg-white' },
    { name: 'Marketing & Lead Generation', icon: Megaphone, slug: 'marketing', bg: 'bg-brand-grey' },
    { name: 'Business Strategy & Coaching', icon: Target, slug: 'strategy', bg: 'bg-brand-grey' },
    { name: 'Loan Structure & Application Processing', icon: HomeIcon, slug: 'loan-structure', bg: 'bg-brand-grey' },
    { name: 'Workflow, Reporting & Operations', icon: BarChart, slug: 'workflow', bg: 'bg-brand-grey' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<ResourcePost[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<any[]>([]);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality as needed
    console.log('Search query:', searchQuery);
  };

  useEffect(() => {
    fetchResourcePosts().then(setPosts);
  }, []);

  useEffect(() => {
    client.fetch(FEATURED_BLOGS_QUERY).then(setFeaturedBlogs);
  }, []);


  const blogPosts = (featuredBlogs ?? []).map((blog) => ({
    category: blog.category || "Blog",
    title: blog.title,
    description: blog.description,
    imageUrl: blog.imageUrl || "https://picsum.photos/seed/blog/600/400",
    imageHint: blog.title,
    linkText: "Read Article",
    link: `/blog/${blog.slug}`,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <BetaConsentModal />
      {/* Hero Section */}
      <section className="bg-brand-blue relative overflow-hidden pt-24 pb-32 px-4">
        {/* Abstract Background Shapes (CSS/SVG) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-green rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-brand-green text-sm font-medium mb-8 border border-white/10">
            <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
            <span>Automate</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find the Perfect <span className="text-brand-green">Solutions</span> for<br />
            Your Brokerage
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Discover vetted products, software, and services tailored for Mortgage, Asset, and Commercial Finance brokers.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2 transition-all focus-within:ring-4 focus-within:ring-brand-green/20">
              <Search className="text-gray-400 ml-4" size={20} />
              <input
                type="text"
                placeholder="Search for vendors, products, or services..."
                className="w-full px-4 py-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-brand-orange hover:bg-orange-600 text-white p-3 rounded-lg transition-colors">
                <Search size={20} />
              </button>
            </div>
          </form>

          <button className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors">
            <Sparkles size={16} className="text-brand-green" />
            <span>Or ask AI for personalized recommendations</span>
            <ArrowRight size={16} />
          </button>

          <div className="mt-12 flex justify-center gap-4">
            <button onClick={() => router.push('/directory')} className="px-6 py-3 bg-brand-orange text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20">
              Browse All
            </button>
            <button className="px-6 py-3 bg-white text-brand-blue font-bold rounded-lg hover:bg-gray-100 transition-colors">
              List Your Business
            </button>
          </div>
        </div>

        {/* Arch / Curved Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg
            className="relative block w-full h-[60px] md:h-[100px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 L0,100 Q600,0 1200,100 L1200,120 Z"
              fill="#FFFFF0"
            />
          </svg>
        </div>
      </section>

      {/* Resources Section (Sanity Data) */}
      <section className="py-24 bg-brand-cream">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2 block">Discover</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Services that amplify broker success</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vetted services that generate leads and support your broker business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              // Skeleton loader
              [1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl"></div>)
            ) : (
              posts.map((post, idx) => (
                <div
                  key={post.id}
                  className={`group relative rounded-2xl p-8 flex flex-col justify-between min-h-[420px] transition-all hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-brand-green/20 ${idx === 0 ? 'bg-white' : 'bg-gray-100'}`}
                >
                  <div>
                    <span className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-6 block">{post.category}</span>
                    <h3 className="text-2xl font-bold text-brand-blue mb-4 group-hover:text-brand-orange transition-colors">{post.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-8">
                      {post.description}
                    </p>
                  </div>

                  {/* Placeholder Icon Area */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-200/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <FileText className="text-gray-400" size={48} />
                  </div>

                  <button className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:gap-3 transition-all">
                    {post.ctaText} <ArrowRight size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => router.push('/blog')} className="inline-flex items-center gap-2 text-brand-blue font-semibold border-b-2 border-brand-green/30 hover:border-brand-green transition-all pb-1">
              More resources <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-brand-cream">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2 block">Featured</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Latest Blog Posts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Insights and updates from our team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <Card key={idx} className={idx === 0 ? 'bg-white' : 'bg-gray-100'}>
                <CardHeader className="p-0">
                  <Image src={post.imageUrl} alt={post.imageHint} width={600} height={400} className="w-full h-48 object-cover rounded-t-2xl" />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-brand-blue mb-2">{post.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <Button asChild variant="link" className="text-brand-blue hover:text-brand-orange">
                    <Link href={post.link}>{post.linkText} <ArrowRight size={16} /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Promo Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Dark Card */}
            <div className="bg-brand-blue rounded-3xl p-12 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-xs font-bold tracking-widest text-white/50 uppercase mb-4 block">Accelerate</span>
                <h3 className="text-4xl font-bold mb-6">Streamline your<br />workflow with<br />personalised support</h3>
                <p className="text-white/70 mb-8 max-w-sm mx-auto">Talk with one of our team</p>
                <button onClick={() => router.push('/optimise-workflow')} className="bg-[#2a4069] border border-white/20 hover:bg-[#355082] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors">
                  Schedule a Chat <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="flex flex-col gap-8">
              <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-10 flex flex-col items-center text-center shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full border-2 border-brand-blue/10 flex items-center justify-center mb-6 text-brand-blue">
                  <div className="font-bold text-2xl">?</div>
                </div>
                <h4 className="text-xl font-bold text-brand-blue mb-3">Troubleshoot & VA Support</h4>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  A directory of guides helping you or your VA to trouble shoot common integration and website issues
                </p>
                <button onClick={() => router.push('/directory?cat=support')} className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center gap-2">
                  Explore <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-10 flex flex-col items-center text-center shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full border-2 border-brand-blue/10 flex items-center justify-center mb-6 text-brand-blue">
                  <Sparkles size={24} />
                </div>
                <h4 className="text-xl font-bold text-brand-blue mb-3">AI Automations</h4>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Access cutting-edge analytics and insights to make data-driven decisions and improve your brokerage strategies
                </p>
                <button onClick={() => router.push('/directory?cat=ai')} className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center gap-2">
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-brand-cream">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Explore by Category</h2>
            <p className="text-gray-600">Browse vendors by the type of solution you need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className={`${cat.bg} p-8 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg group border border-gray-100/50`}
              >
                <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center mb-6 text-brand-blue group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                  <cat.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-brand-blue mb-8 min-h-[3rem] flex items-center justify-center">{cat.name}</h3>
                <button
                  onClick={() => router.push(`/directory?category=${cat.slug}`)}
                  className="text-brand-orange font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Explore <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="bg-brand-blue py-20 text-center px-4 relative overflow-hidden">
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Find Your Perfect Match?</h2>
          <p className="text-white/70 mb-10 text-lg">Take the quiz to match with the right software, services and providers</p>
          <QuizWaitlistModal>
            <button className="bg-brand-green text-brand-blue font-bold px-8 py-4 rounded-lg hover:bg-[#04c2a3] transition-colors inline-flex items-center gap-2">
              Take the Quiz <ArrowRight size={20} />
            </button>
          </QuizWaitlistModal>
        </div>
      </section>
    </div>
  );
};

export default Home;
