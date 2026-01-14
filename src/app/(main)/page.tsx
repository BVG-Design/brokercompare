'use client';

import React, { useEffect, useState } from 'react';
import { Search, Sparkles, ArrowRight, Users, MessageSquare, FileText, Megaphone, Target, Home as HomeIcon, BarChart, Mic, BookOpen, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrmSystemIcon, DocumentCollectionIcon, VaServicesIcon, AiSoftwareIcon, TroubleshootIcon, AiAutomationsIcon, MarketingLeadGenIcon, BusinessStrategyIcon, LoanStructureIcon, WorkflowOpsIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import { FEATURED_BLOGS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { fetchResourcePosts, fetchHomepageResourceCards } from '@/services/sanity';
import { ResourcePost } from '@/types';
import Link from 'next/link';
import { QuizWaitlistModal } from '@/components/quiz/quiz-waitlist-modal';
import BetaConsentModal from "@/components/shared/BetaConsentModal";
import AIChatDialog from "@/components/partners/AIChatDialog";
import { SITE_URLS } from '@/lib/config';

const Home: React.FC = () => {

  const categories = [
    { name: 'CRM & Fact Find', icon: Users, slug: 'crm', bg: 'bg-white' },
    { name: 'Loan Structure & Application Processing', icon: FileText, slug: 'broker-industry-tools', bg: 'bg-white' },
    { name: 'Outsourcing & Staffing', icon: MessageSquare, slug: 'outsourcing-and-staffing', bg: 'bg-white' },
    { name: 'Operations and AI Automations', icon: Sparkles, slug: 'operations-ai-automations', bg: 'bg-white' },
    { name: 'Marketing & Lead Generation', icon: Megaphone, slug: 'marketing', bg: 'bg-brand-grey' },
    { name: 'Business Coaching, Mindset & Client Retention', icon: Target, slug: 'business-coaching-mindset-and-client-retention', bg: 'bg-brand-grey' },
    { name: 'Video, Podcasting and Course Content', icon: HomeIcon, slug: 'video-podcasting-course-content', bg: 'bg-brand-grey' },
    { name: 'Technology & Systems', icon: BarChart, slug: 'technology-systems', bg: 'bg-brand-grey' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<ResourcePost[]>([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`${SITE_URLS.directory}/search/${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    fetchHomepageResourceCards().then(setPosts);
  }, []);


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
            Discover products, software, and services tailored for Mortgage, Asset, and Commercial Finance brokers.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center bg-white rounded-xl shadow-2xl p-2 transition-all focus-within:ring-4 focus-within:ring-brand-green/20">
              <Search className="text-gray-400 ml-4" size={20} />
              <input
                type="text"
                placeholder="Search for partners, products, or services..."
                className="w-full px-4 py-3 outline-none text-gray-700 caret-blue-600 placeholder-gray-400 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-brand-orange hover:bg-orange-600 text-white p-3 rounded-lg transition-colors">
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* <button
            onClick={() => setShowAIChat(true)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            <Sparkles size={16} className="text-brand-green" />
            <span>Or ask AI for personalized recommendations</span>
            <ArrowRight size={16} />
          </button> */}

          <div className="mt-12 flex justify-center gap-4">
            <button onClick={() => window.location.href = `${SITE_URLS.directory}/search`} className="px-6 py-3 bg-brand-orange text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-900/20">
              Browse All
            </button>
            <button onClick={() => router.push('/apply')} className="px-6 py-3 bg-white text-brand-blue font-bold rounded-lg hover:bg-gray-100 transition-colors">
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
              Listen to a podcast, download a guide, or read a tech review!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Podcasts Card */}
            <Link href="/podcast" className="group relative rounded-3xl overflow-hidden aspect-square transition-all hover:-translate-y-2 hover:shadow-2xl bg-gray-100 flex items-center justify-center">
              <Image
                src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Podcast.png"
                alt="Podcasts"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Guides Card */}
            <div className="group relative rounded-3xl overflow-hidden aspect-square transition-all hover:-translate-y-2 hover:shadow-2xl bg-gray-100 flex items-center justify-center">
              <Image
                src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Workflow%20Guides.png"
                alt="DownloadGuides"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>

            {/* Tech Reviews Card */}
            <div className="group relative rounded-3xl overflow-hidden aspect-square transition-all hover:-translate-y-2 hover:shadow-2xl bg-gray-100 flex items-center justify-center">
              <Image
                src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Read%20Tech%20Reviews.png"
                alt="Tech Reviews"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            <button onClick={() => window.location.href = `${SITE_URLS.resources}/blog`} className="inline-flex items-center gap-2 text-brand-blue font-semibold border-b-2 border-brand-green/30 hover:border-brand-green transition-all pb-1">
              More resources <ArrowRight size={16} />
            </button>
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
                <button onClick={() => router.push('/workflow-optimisation')} className="bg-[#2a4069] border border-white/20 hover:bg-[#355082] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors">
                  Schedule a Chat <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Side Cards */}
            <div className="flex flex-col gap-8">
              <div className="flex-1 bg-white rounded-3xl border-gray-300 border-2 p-10 flex flex-col items-center text-center shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full border-2 border-brand-blue/10 flex items-center justify-center mb-6 text-brand-blue">
                  <div className="font-bold text-2xl">?</div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-brand-blue">Troubleshoot & VA Support</h4>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/30">Coming Soon</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  A directory of guides helping you or your VA to trouble shoot common integration and website issues
                </p>
                <button onClick={() => window.location.href = `${SITE_URLS.resources}/blog?category=va_training_development`} className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center gap-2">
                  Explore <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex-1 bg-white rounded-3xl border-gray-300 border-2 p-10 flex flex-col items-center text-center shadow-lg shadow-gray-100/50 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full border-2 border-brand-blue/10 flex items-center justify-center mb-6 text-brand-blue">
                  <Sparkles size={24} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-xl font-bold text-brand-blue">AI Automations</h4>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/30">Coming Soon</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Access cutting-edge analytics and insights to make data-driven decisions and improve your brokerage strategies
                </p>
                <button onClick={() => window.location.href = `${SITE_URLS.resources}/blog?category=workbooks_guides`} className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:border-brand-orange hover:text-brand-orange transition-colors flex items-center gap-2">
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
            <p className="text-gray-600">Browse partners by the type of solution you need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={`${SITE_URLS.directory}/search?category=${cat.slug}`}
                className={`${cat.bg} p-8 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg group border border-gray-100/50 block`}
              >
                <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center mb-6 text-brand-blue group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                  <cat.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-brand-blue mb-8 min-h-[3rem] flex items-center justify-center">{cat.name}</h3>
                <div
                  className="text-brand-orange font-medium text-sm flex items-center justify-center gap-2 group-hover:gap-3 transition-all"
                >
                  Explore <ArrowRight size={16} />
                </div>
              </Link>
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

      <AIChatDialog open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
};

export default Home;
