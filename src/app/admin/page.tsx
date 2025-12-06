'use client';
import React from 'react';
import ApplicationsManagement from '@/components/admin/ApplicationsManagement';
import DirectoryManagement from '@/components/admin/DirectoryManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import LeadsManagement from '@/components/admin/LeadsManagement';
import BlogManagement from '@/components/admin/BlogsManagement';
import AnalyticsManagement from '@/components/admin/AnalyticsManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Briefcase,
  Star,
  Mail,
  FileText,
  BarChart3,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getAdminStats } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    vendorsTotal: 0,
    vendorsApproved: 0,
    applicationsTotal: 0,
    applicationsPending: 0,
    leadsTotal: 0,
    leadsNew: 0,
    reviewsTotal: 0,
    reviewsPending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await getAdminStats(supabase);
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  const tabs = [
    {
      value: 'applications',
      label: 'Applications',
      icon: Users,
      component: <ApplicationsManagement />,
    },
    {
      value: 'directory',
      label: 'Directory',
      icon: Briefcase,
      component: <DirectoryManagement />,
    },
    {
      value: 'reviews',
      label: 'Reviews',
      icon: Star,
      component: <ReviewsManagement />,
    },
    {
      value: 'leads',
      label: 'Leads',
      icon: Mail,
      component: <LeadsManagement />,
    },
    {
      value: 'blog',
      label: 'Blog',
      icon: FileText,
      component: <BlogManagement />,
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      component: <AnalyticsManagement />,
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 mt-1">
            Manage your platform content and users
          </p>
        </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                title: 'Directory Listings',
                value: stats.vendorsTotal,
                subtitle: `${stats.vendorsApproved} approved`,
                icon: Briefcase,
              },
              {
                title: 'Applications',
                value: stats.applicationsTotal,
                subtitle: `${stats.applicationsPending} pending`,
                icon: FileText,
              },
              {
                title: 'Leads',
                value: stats.leadsTotal,
                subtitle: `${stats.leadsNew} new`,
                icon: Mail,
              },
              {
                title: 'Reviews',
                value: stats.reviewsTotal,
                subtitle: `${stats.reviewsPending} pending`,
                icon: Star,
              },
            ].map((card) => (
              <Card key={card.title}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="rounded-md bg-primary/10 p-2">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold text-primary">
                      {loading ? '—' : card.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="applications" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <Card>
                  <CardContent className="pt-6">{tab.component}</CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
