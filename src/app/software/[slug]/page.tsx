import React from 'react';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/product-page/HeroSection';
import MainCard from '@/components/product-page/MainCard';
import InfoGrid from '@/components/product-page/InfoGrid';
import StillNotSure from '@/components/product-page/StillNotSure';
import ReviewsSection from '@/components/product-page/ReviewsSection'; // Placeholder for now
import { SoftwareListing } from '@/components/product-page/types';
// import { getSoftwareFromSanity } from '@/sanity/lib/software'; // We'll keep this valid import

// MOCK DATA for MBJ Tech
const MOCK_MBJ_TECH: SoftwareListing = {
  name: "MBJ Tech",
  slug: "mbj-tech",
  tagline: "IT support you can count on",
  description: "MBJ Technologies is an Australian-based technology services company specialising in managed IT, cybersecurity, cloud solutions, and business systems support. They help growing businesses stay secure, connected, and productive with tailored IT strategies, proactive monitoring, and responsive support. From networking and data protection to Microsoft 365 and cloud infrastructure, MBJ Technologies partners with organisations to streamline technology, reduce risk, and support scalable growth with reliable, people-first service.",
  category: "IT Support & Cybersecurity",
  websiteUrl: "https://www.mbjtech.com.au/",
  location: "Sydney, Melbourne, Remote",
  logoUrl: "https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public,%20Product%20and%20Software%20Logos/mbj%20tech%20logo.png",
  badges: ["Recommended Partner"],
  serviceArea: ["Managed IT", "Cybersecurity", "Microsoft 365", "Cloud Infrastructure", "Helpdesk Support", "Network Management"],
  brokerType: ["Mortgage", "Asset", "Commercial"],
  features: ["Packaged Services", "CyberSecurity Focussed", "Microsoft 365 Expert"],
  pricing: {
    model: undefined, // Empty in provided data
    min: undefined,
    max: undefined,
    notes: undefined
  },
  worksWith: [
    { name: "Microsoft Azure" },
    { name: "Microsoft 365" },
    { name: "Endpoint Security (EDR)" },
    { name: "Network Firewalls" }
  ],
  editor: {
    notes: "One of the most prompt and reliable IT Support teams I've worked with. We love how passionate Mitch is about ensuring Brokers don't pay for extra tools especially as Microsoft has but of inbuilt tools to manage most of your business.",
    author: "Katey S - Broker Tools"
  },
  rating: {
    average: 0,
    count: 0
  },
};

const MOCK_BLOGS = [
  {
    _id: '1',
    title: 'Top 5 Broker Tools for 2025',
    slug: 'top-5-broker-tools-2025',
    imageUrl: 'https://picsum.photos/300/200?random=10',
    summary: 'A look at the best software to streamline your brokerage.'
  },
  {
    _id: '2',
    title: 'Cybersecurity 101 for Brokers',
    slug: 'cybersecurity-101',
    imageUrl: 'https://picsum.photos/300/200?random=11',
    summary: 'Protecting your client data is more important than ever.'
  },
  {
    _id: '3',
    title: 'Maximising Efficiency with AI',
    slug: 'efficiency-with-ai',
    imageUrl: 'https://picsum.photos/300/200?random=12',
    summary: 'How to use AI tools like ChatGPT in your daily workflow.'
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SoftwarePage(props: PageProps) {
  const params = await props.params;
  const { slug } = params;

  // 1. Check Mock Data First
  let listing: SoftwareListing | null = null;
  if (slug === 'mbj-tech') {
    listing = MOCK_MBJ_TECH;
    // } else {
    // 2. Fallback to Sanity (DISABLED FOR NOW)
    // const allSoftware = await getSoftwareFromSanity();
    // }

    if (!listing) {
      // return notFound();
      // For demo purposes, if not found, just show MBJ tech so user sees SOMETHING on any slug? 
      // No, better to be correct.
      return notFound();
    }

    return (
      <div className="min-h-screen flex flex-col bg-gray-50/50">
        <HeroSection tagline={listing.tagline} />

        <main className="flex-grow">
          <MainCard listing={listing} />
          <InfoGrid listing={listing} blogs={MOCK_BLOGS} />
          <ReviewsSection />
          <div className="max-w-6xl mx-auto px-4">
            <StillNotSure />
          </div>
        </main>
      </div>
    );
  }

  return notFound();
}
