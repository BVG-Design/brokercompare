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

export default function AdminDashboard() {
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
