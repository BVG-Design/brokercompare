import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Share2, Coffee, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function ThankYou() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#132847] mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your application has been submitted successfully. We&apos;ll review
              it and get back to you within 2-3 business days.
            </p>
          </div>

          {/* What's Next Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#132847] mb-2">
              What would you like to do next?
            </h2>
          </div>

          {/* Options Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search Directory */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#05d8b5] overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Search className="w-20 h-20 text-white" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-[#132847] mb-3">
                  Search Directory
                </h3>
                <p className="text-gray-600 mb-6">
                  Explore our curated directory of vetted vendors and services
                </p>
                <Link href="/services">
                  <Button className="w-full bg-[#132847] hover:bg-[#1a3a5f] text-white">
                    Browse Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Share with Friend */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#05d8b5] overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Share2 className="w-20 h-20 text-white" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-[#132847] mb-3">
                  Share O Broker Tools with a Friend
                </h3>
                <p className="text-gray-600 mb-6">
                  Help your network discover amazing broker solutions
                </p>
                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'O Broker Tools',
                        text: 'Check out O Broker Tools - the best directory for broker solutions!',
                        url: window.location.origin,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.origin);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Share Now
                </Button>
              </CardContent>
            </Card>

            {/* Coffee Break */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#05d8b5] overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Coffee className="w-20 h-20 text-white" />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-[#132847] mb-3">
                  Have a Coffee Break
                </h3>
                <p className="text-gray-600 mb-6">
                  You&apos;ve earned it! Take a moment to relax and recharge
                </p>
                <Link href="/">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
