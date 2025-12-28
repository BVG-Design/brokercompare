'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApplicationsManagement from '@/components/admin/ApplicationsManagement';
import DirectoryManagement from '@/components/admin/DirectoryManagement';
import ReviewsManagement from '@/components/admin/ReviewsManagement';
import LeadsManagement from '@/components/admin/LeadsManagement';
import BlogManagement from '@/components/admin/BlogsManagement';
import AnalyticsManagement from '@/components/admin/AnalyticsManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AccessDeniedCard } from '@/components/shared/AccessDeniedCard';
import {
  Users,
  Briefcase,
  Star,
  Mail,
  FileText,
  BarChart3,
  BadgeDollarSign,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { getAdminStats } from '@/lib/dashboard-data';

export const dynamic = 'force-dynamic';

function UpgradeRequestsPlaceholder() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upgrade requests will appear here once connected to Supabase.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="font-semibold text-primary">Premium listing requests</p>
            <p className="text-sm text-muted-foreground">Track upgrade submissions and status.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="font-semibold text-primary">Featured placement</p>
            <p className="text-sm text-muted-foreground">Prioritise vendors that need review.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userLoading, setUserLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
  const noData = !loading && Object.values(stats).every((v) => v === 0);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const gate = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserEmail(user.email);

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_type, user_access, admin_dashboard, first_name, full_name')
        .eq('id', user.id)
        .maybeSingle();

      const profileFirst = profile?.first_name || profile?.full_name?.split(' ')?.[0] || user.user_metadata?.first_name || null;
      setFirstName(profileFirst);

      const canAccess =
        Boolean(profile?.admin_dashboard) ||
        profile?.user_access === 'admin' ||
        profile?.user_type === 'admin' ||
        (!profile && !profileError); // trust server-side gate if profile is missing but no error

      setAuthorized(canAccess);
      setUserLoading(false);
    };

    gate();
  }, [router]);

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
    {
      value: 'upgrades',
      label: 'Upgrades',
      icon: BadgeDollarSign,
      component: <UpgradeRequestsPlaceholder />,
    },
  ];

  return (
    <>
      {userLoading && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      )}
      {!userLoading && !authorized && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <AccessDeniedCard
            firstName={firstName}
            email={userEmail}
            page="/admin"
            backHref="/dashboard/broker"
          />
        </div>
      )}
      {!userLoading && authorized && (
        <div className="min-h-screen bg-gray-50">
          <div className="bg-gradient-to-r from-[#132847] to-[#0f1b30] text-white py-12 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-200 mt-2 text-lg">
                Manage directory listings, applications, leads, reviews, and content
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Card key={card.title} className="shadow-sm border border-gray-200/80">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="rounded-xl p-3 bg-gray-50 border border-gray-100">
                      <card.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#132847]">{card.title}</p>
                      {loading ? (
                        <Skeleton className="h-7 w-16 my-1" />
                      ) : (
                        <p className="text-3xl font-bold text-[#132847] leading-tight">{card.value}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {noData && (
              <Card className="mb-8 border-dashed">
                <CardContent className="p-6 space-y-2">
                  <p className="text-lg font-semibold text-primary">No admin data yet</p>
                  <p className="text-sm text-muted-foreground">
                    Connect Supabase tables for vendors, applications, leads, and reviews to populate this dashboard.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="mb-8">
              <CardContent className="p-6 space-y-3">
                <p className="text-lg font-semibold text-primary">Dashboard access</p>
                <p className="text-sm text-muted-foreground">Jump to another dashboard without leaving settings.</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Broker Dashboard', href: '/dashboard/broker' },
                    { label: 'Vendor Dashboard', href: '/dashboard/vendor' },
                    { label: 'Admin Dashboard', href: '/admin' },
                  ].map((item) => (
                    <Button key={item.href} variant="outline" asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </Button>
                  ))}
                </div>
                <div className="pt-4 border-t mt-4">
                  <Button variant="outline" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-6 bg-white shadow-sm rounded-lg p-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-[#132847]">{tab.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      {tab.value === 'directory' && (
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <Input placeholder="Search vendors..." className="w-full" />
                          </div>
                          <div className="w-full md:w-56">
                            <Select defaultValue="all">
                              <SelectTrigger>
                                <SelectValue placeholder="All status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <div className="rounded-lg border border-dashed text-sm text-muted-foreground p-6 bg-gray-50">
                        {loading ? 'Loading...' : 'No data yet - connect Supabase to populate this section.'}
                      </div>
                      <div className="pt-2">{tab.component}</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}




