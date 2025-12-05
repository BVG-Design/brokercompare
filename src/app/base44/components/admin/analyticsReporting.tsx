import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  Bookmark, 
  Users, 
  TrendingUp,
  Search,
  FileText,
  Star,
  BarChart3
} from "lucide-react";

export default function AnalyticsReporting() {
  const { data: analytics = [] } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: () => base44.entities.Analytics.list('-created_date'),
    initialData: [],
  });

  const { data: vendors = [] } = useQuery({
    queryKey: ['all-vendors'],
    queryFn: () => base44.entities.Vendor.list(),
    initialData: [],
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['all-leads'],
    queryFn: () => base44.entities.Lead.list(),
    initialData: [],
  });

  const { data: shortlists = [] } = useQuery({
    queryKey: ['all-shortlists'],
    queryFn: () => base44.entities.Shortlist.list(),
    initialData: [],
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['all-reviews'],
    queryFn: () => base44.entities.Review.list(),
    initialData: [],
  });

  // Calculate key metrics
  const metrics = useMemo(() => {
    const pageViews = analytics.filter(a => a.event_type === 'page_view').length;
    const vendorViews = analytics.filter(a => a.event_type === 'vendor_view').length;
    const searchPerformed = analytics.filter(a => a.event_type === 'search_performed').length;
    const comparisonsViewed = analytics.filter(a => a.event_type === 'comparison_viewed').length;
    
    const totalShortlists = shortlists.length;
    const uniqueUsersShortlisting = new Set(shortlists.map(s => s.user_email)).size;
    
    const referralsMade = analytics.filter(a => a.event_type === 'referral_made').length;
    
    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 && vendorViews > 0 
      ? ((totalLeads / vendorViews) * 100).toFixed(2) 
      : 0;

    // Top viewed vendors
    const vendorViewCounts = {};
    analytics
      .filter(a => a.event_type === 'vendor_view' && a.vendor_id)
      .forEach(a => {
        vendorViewCounts[a.vendor_id] = (vendorViewCounts[a.vendor_id] || 0) + 1;
      });
    
    const topVendors = Object.entries(vendorViewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([vendorId, count]) => {
        const vendor = vendors.find(v => v.id === vendorId);
        return {
          id: vendorId,
          name: vendor?.company_name || 'Unknown',
          views: count
        };
      });

    // Most shortlisted vendors
    const shortlistCounts = {};
    shortlists.forEach(s => {
      shortlistCounts[s.vendor_id] = (shortlistCounts[s.vendor_id] || 0) + 1;
    });

    const topShortlisted = Object.entries(shortlistCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([vendorId, count]) => {
        const vendor = vendors.find(v => v.id === vendorId);
        return {
          id: vendorId,
          name: vendor?.company_name || 'Unknown',
          shortlists: count
        };
      });

    return {
      pageViews,
      vendorViews,
      searchPerformed,
      comparisonsViewed,
      totalShortlists,
      uniqueUsersShortlisting,
      referralsMade,
      totalLeads,
      conversionRate,
      topVendors,
      topShortlisted
    };
  }, [analytics, vendors, leads, shortlists]);

  const stats = [
    {
      title: "Total Page Views",
      value: metrics.pageViews.toLocaleString(),
      subtitle: "All page visits",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Vendor Profile Views",
      value: metrics.vendorViews.toLocaleString(),
      subtitle: `${metrics.conversionRate}% conversion rate`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Searches Performed",
      value: metrics.searchPerformed.toLocaleString(),
      subtitle: "Search queries",
      icon: Search,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Shortlists",
      value: metrics.totalShortlists.toLocaleString(),
      subtitle: `${metrics.uniqueUsersShortlisting} unique users`,
      icon: Bookmark,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Referrals Made",
      value: metrics.referralsMade.toLocaleString(),
      subtitle: "Referral partnerships",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Comparisons Viewed",
      value: metrics.comparisonsViewed.toLocaleString(),
      subtitle: "Side-by-side views",
      icon: BarChart3,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Top Performing Vendors */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#132847]">Top Viewed Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.topVendors.length > 0 ? (
              <div className="space-y-3">
                {metrics.topVendors.map((vendor, idx) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#132847] text-white flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-[#132847]">{vendor.name}</p>
                        <p className="text-xs text-gray-500">{vendor.views} views</p>
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#132847]">Most Shortlisted</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.topShortlisted.length > 0 ? (
              <div className="space-y-3">
                {metrics.topShortlisted.map((vendor, idx) => (
                  <div key={vendor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#05d8b5] text-white flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-[#132847]">{vendor.name}</p>
                        <p className="text-xs text-gray-500">{vendor.shortlists} shortlists</p>
                      </div>
                    </div>
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Engagement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">User Engagement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#132847] mb-1">{metrics.totalLeads}</p>
              <p className="text-sm text-gray-600">Total Leads Generated</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#132847] mb-1">{reviews.length}</p>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#132847] mb-1">{vendors.length}</p>
              <p className="text-sm text-gray-600">Total Vendors</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-[#132847] mb-1">{metrics.conversionRate}%</p>
              <p className="text-sm text-gray-600">View-to-Lead Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}