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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Settings,
  Inbox,
  LayoutDashboard,
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
  const [activeSection, setActiveSection] = useState('dashboard');
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
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Users },
    { id: 'directory', label: 'Directory', icon: Briefcase },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'leads', label: 'Leads', icon: Mail },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'upgrades', label: 'Upgrades', icon: BadgeDollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const renderManagementSection = (
    id: string,
    label: string,
    component: React.ReactNode,
  ) => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-[#132847]">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {id === 'directory' && (
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
        {id !== 'applications' && (
          <div className="pt-2">{component}</div>
        )}
      </CardContent>
    </Card>
  );

  const renderActivitiesCard = () => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-[#132847]">Activities</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2">
          {[
            { title: 'Pending Applications', hint: `${stats.applicationsPending || '0'} awaiting review` },
            { title: 'Check new leads', hint: `${stats.leadsNew || '0'} new leads to triage` },
            { title: 'Assess Reviews', hint: `${stats.reviewsPending || '0'} awaiting moderation` },
            { title: 'Read Feedback', hint: 'New feedback and support submissions' },
            { title: 'Review FAQs', hint: 'New FAQ submissions and updates' },
          ].map((activity) => (
            <div
              key={activity.title}
              className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-[#132847]">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.hint}</p>
              </div>
              <span className="text-xs font-semibold text-primary">View</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyListState = (label: string) => (
    <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground bg-gray-50">
      No {label} have been generated yet.
    </div>
  );

  const renderInbox = () => (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-[#132847]">Inbox</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All enquiries</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">
              All new contact support, feedback, and submitted forms appear here.
            </p>
            {renderEmptyListState('enquiries')}
          </TabsContent>
          <TabsContent value="faqs" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">Incoming FAQ submissions and edits.</p>
            {renderEmptyListState('FAQs')}
          </TabsContent>
          <TabsContent value="reviews" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">New reviews awaiting moderation.</p>
            {renderEmptyListState('reviews')}
          </TabsContent>
          <TabsContent value="feedback" className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground">Product and support feedback.</p>
            {renderEmptyListState('feedback items')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderSettingsSection = () => (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-[#132847]">Settings & Access</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg font-semibold text-primary">Dashboard access</p>
          <p className="text-sm text-muted-foreground">
            Jump to another dashboard without leaving settings.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
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
        </div>
        <div className="pt-4 border-t mt-4">
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
        .select('user_type, user_access, admin_dashboard, first_name')
        .eq('id', user.id)
        .maybeSingle();

      const profileFirst = profile?.first_name || user.user_metadata?.first_name || null;
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
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card className="shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm font-semibold text-[#132847]">Admin sections</p>
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            activeSection === item.id
                              ? 'bg-[#132847] text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3 space-y-6">
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

                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                      <div className="flex-shrink-0 mb-4 md:mb-0">
                        <img
                          src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/Simba%20Side%20Profile.png"
                          alt="Simba the support dog"
                          className="w-28 h-28 rounded-xl object-contain border border-gray-200 bg-white"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-lg font-semibold text-[#132847]">
                          Hi {firstName || 'there'}, welcome to Broker Tools. <em>I am Simba your Support Dog.</em>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          If you need help with anything our{' '}
                          <Link href="/faq" className="text-primary underline underline-offset-4">FAQs</Link> and{' '}
                          <Link href="/blog" className="text-primary underline underline-offset-4">Getting Started resources</Link>{' '}
                          can help you out. Otherwise, feel free to reach out to our human support team.
                        </p>
                        <Button className="w-fit bg-[#132847] text-white hover:bg-[#1a3a5f]">
                          Contact support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {activeSection === 'settings' &&
                  renderSettingsSection()}
                {activeSection !== 'settings' &&
                  (activeSection === 'dashboard'
                    ? renderActivitiesCard()
                    : activeSection === 'applications'
                      ? renderManagementSection(
                        'applications',
                        'Applications',
                        <div className="space-y-3">
                          <div className="rounded-lg border bg-white p-4">
                            <p className="text-sm text-muted-foreground">
                              Kanban or list view of applications will appear here.
                            </p>
                          </div>
                          {renderEmptyListState('applications')}
                        </div>
                      )
                      : activeSection === 'directory'
                        ? renderManagementSection(
                          'directory',
                          'Directory',
                          <div className="space-y-3">
                            <div className="rounded-lg border bg-white p-4">
                              <p className="text-sm text-muted-foreground">
                                Kanban or list view of directory listings will appear here.
                              </p>
                            </div>
                            {renderEmptyListState('directory listings')}
                          </div>
                        )
                        : activeSection === 'reviews'
                          ? renderManagementSection(
                            'reviews',
                            'Reviews',
                            <div className="space-y-3">
                              <div className="rounded-lg border bg-white p-4">
                                <p className="text-sm text-muted-foreground">
                                  Kanban or list view of reviews will appear here.
                                </p>
                              </div>
                              {renderEmptyListState('reviews')}
                            </div>
                          )
                          : activeSection === 'leads'
                            ? renderManagementSection(
                              'leads',
                              'Leads',
                              <div className="space-y-3">
                                <div className="rounded-lg border bg-white p-4">
                                  <p className="text-sm text-muted-foreground">
                                    Kanban or list view of leads will appear here.
                                  </p>
                                </div>
                                {renderEmptyListState('leads')}
                              </div>
                            )
                            : activeSection === 'inbox'
                              ? renderInbox()
                              : activeSection === 'blog'
                                ? renderManagementSection('blog', 'Blog', <BlogManagement />)
                                : activeSection === 'analytics'
                                  ? renderManagementSection('analytics', 'Analytics', <AnalyticsManagement />)
                                  : renderManagementSection('upgrades', 'Upgrades', <UpgradeRequestsPlaceholder />))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


