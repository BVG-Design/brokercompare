
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  FileText, 
  Mail, 
  Users,
  Star,
  MessageSquare
} from "lucide-react";

import DirectoryManagement from "../components/admin/DirectoryManagement";
import ApplicationsManagement from "../components/admin/ApplicationsManagement";
import LeadsManagement from "../components/admin/LeadsManagement";
import ReviewsManagement from "../components/admin/ReviewsManagement";
import AnalyticsReporting from "../components/admin/AnalyticsReporting";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u.role !== 'admin') {
        navigate(createPageUrl('Home'));
      }
      setUser(u);
    }).catch(() => {
      navigate(createPageUrl('Home'));
    });
  }, [navigate]);

  const { data: directories = [] } = useQuery({
    queryKey: ['directories'],
    queryFn: () => base44.entities.Vendor.list(),
    initialData: [],
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.VendorApplication.list(),
    initialData: [],
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
    initialData: [],
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => base44.entities.Review.list('-created_date'),
    initialData: [],
  });

  const stats = [
    {
      title: "Total Directory Listings",
      value: directories.length,
      subtitle: `${directories.filter(v => v.status === 'approved').length} approved`,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pending Applications",
      value: applications.filter(a => a.status === 'pending').length,
      subtitle: `${applications.length} total applications`,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "New Leads",
      value: leads.filter(l => l.status === 'new').length,
      subtitle: `${leads.length} total leads`,
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Pending Reviews",
      value: reviews.filter(r => r.status === 'pending').length,
      subtitle: `${reviews.length} total reviews`,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#132847]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage directory listings, applications, leads, reviews, and content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-[#132847] mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="directories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="directories">Directory Listings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="directories">
            <DirectoryManagement />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsManagement />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsManagement />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsReporting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

