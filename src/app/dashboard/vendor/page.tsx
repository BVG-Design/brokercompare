'use client';


import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccessDeniedCard } from '@/components/shared/AccessDeniedCard';
import {
  LayoutDashboard,
  Inbox,
  Edit,
  BarChart3,
  Crown,
  Settings,
  Eye,
  Mail,
  Star,
  TrendingUp,
  Upload,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  X,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import {
  getProfile,
  getVendorForUser,
  getVendorLeads,
  getVendorReviews,
  type LeadRecord,
  type ReviewRecord,
  type VendorRecord,
  type UserProfile,
} from '@/lib/dashboard-data';

export const dynamic = "force-dynamic";

const dashboardOptions = [
  {
    id: 'broker',
    label: 'Broker Dashboard',
    description: 'Manage broker profile, leads, and shortlist.',
    path: '/dashboard/broker',
  },
  {
    id: 'vendor',
    label: 'Vendor Dashboard',
    description: 'Update your vendor listing, track leads, and reviews.',
    path: '/dashboard/vendor',
  },
  {
    id: 'admin',
    label: 'Admin Dashboard',
    description: 'Oversee listings, users, and approvals.',
    path: '/admin',
  },
] as const;

type DashboardKey = (typeof dashboardOptions)[number]['id'];

const fieldBoxClass = 'bg-white border border-gray-700';
function VendorDashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [uploading, setUploading] = useState(false);
  const [editedVendor, setEditedVendor] = useState<VendorRecord | null>(null);
  const [vendor, setVendor] = useState<VendorRecord | null>(null);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [availableDashboards, setAvailableDashboards] = useState<
    { id: DashboardKey; label: string; description: string; path: string }[]
  >([]);
  const [defaultDashboard, setDefaultDashboard] = useState<DashboardKey | null>(null);
  const [savingDefaultDashboard, setSavingDefaultDashboard] = useState(false);

  const firstNameDisplay =
    profile?.first_name ||
    profile?.full_name?.split(' ')?.[0] ||
    (user?.full_name ? user.full_name.split(' ')[0] : null) ||
    user?.user_metadata?.first_name ||
    null;

  // Auth + profile + vendor bootstrap
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      const profile = await getProfile(supabase, user.id);
      setProfile(profile);

      const hasVendorAccess = Boolean(profile?.vendor_dashboard) || profile?.user_type === 'vendor';
      if (!hasVendorAccess) {
        setAccessDenied(true);
        setVendorLoading(false);
        return;
      }

      const vendorRecord = profile
        ? await getVendorForUser(supabase, profile)
        : null;

      setVendor(vendorRecord);
      setEditedVendor(
        vendorRecord
          ? {
              ...vendorRecord,
              categories: vendorRecord.categories || [],
            }
          : null
      );

      if (vendorRecord?.id) {
        const [leadRows, reviewRows] = await Promise.all([
          getVendorLeads(supabase, vendorRecord.id),
          getVendorReviews(supabase, vendorRecord.id),
        ]);
        setLeads(leadRows || []);
        setReviews(reviewRows || []);
      }

      setVendorLoading(false);
    };

    init();
  }, [router]);

  useEffect(() => {
    const accessible = dashboardOptions.filter((option) => {
      if (!profile) return option.id === 'vendor';
      if (option.id === 'admin') return Boolean(profile.admin_dashboard);
      if (option.id === 'broker') return Boolean(profile.broker_dashboard);
      return Boolean(profile.vendor_dashboard) || profile.user_type === 'vendor';
    });
    setAvailableDashboards(accessible);
    if (accessible.length > 0) {
      const preferred =
        (profile?.default_profile as DashboardKey | null) &&
        accessible.some((d) => d.id === profile?.default_profile)
          ? (profile?.default_profile as DashboardKey)
          : accessible[0].id;
      setDefaultDashboard(preferred);
    }
  }, [profile]);

  const categories = [
    { value: 'mortgage_software', label: 'Mortgage Software' },
    { value: 'asset_finance_tools', label: 'Asset Finance Tools' },
    { value: 'commercial_finance', label: 'Commercial Finance' },
    { value: 'crm_systems', label: 'CRM Systems' },
    { value: 'lead_generation', label: 'Lead Generation' },
    { value: 'compliance_tools', label: 'Compliance Tools' },
    { value: 'document_management', label: 'Document Management' },
    { value: 'loan_origination', label: 'Loan Origination' },
    { value: 'broker_tools', label: 'Broker Tools' },
    { value: 'marketing_services', label: 'Marketing Services' },
    { value: 'va_services', label: 'VA Services' },
    { value: 'ai_automations', label: 'AI Automations' },
    { value: 'other', label: 'Other' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Inquiries', icon: Inbox, badge: leads.filter(l => l.status === 'new').length },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'upgrade', label: 'Upgrade Plan', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSaveProfile = () => {
    if (!editedVendor) return;
    // TODO: Implement Supabase mutation
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Implement file upload to Supabase Storage
      toast({
        title: 'Logo uploaded',
        description: 'Your logo has been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload logo. Please try again.',
        variant: 'destructive',
      });
    }
    setUploading(false);
  };

  const goToDashboard = (path: string) => {
    router.push(path);
  };

  const handleSaveDefaultDashboard = async () => {
    if (!user || !defaultDashboard) return;
    setSavingDefaultDashboard(true);
    await supabase
      .from('user_profiles')
      .update({
        default_profile: defaultDashboard,
        updated_by: user.id,
        last_login_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    setSavingDefaultDashboard(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) {
    return (
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          </div>
        </main>
    );
  }

  if (vendorLoading) {
    return (
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          </div>
        </main>
    );
  }

  if (accessDenied) {
    return (
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12 flex justify-center">
          <AccessDeniedCard
            firstName={firstNameDisplay}
            email={user?.email || null}
            page="/dashboard/vendor"
            backHref="/dashboard/broker"
          />
        </div>
      </main>
    );
  }

  const vendorDisplay = vendor || {
    company_name: profile?.company || 'Your business',
    listing_tier: 'unlisted',
    status: 'draft',
    logo_url: '',
  };
  const isPending = vendor?.status === 'pending';
  const applicationNotice = !vendor
    ? {
        title: 'Complete your vendor application',
        body: 'We could not find a vendor profile for this account. Start your application to unlock the vendor dashboard.',
        cta: { href: '/apply', label: 'Start application' },
      }
    : isPending
      ? {
          title: 'Application pending review',
          body: 'Your vendor application is under review. We will notify you when it is approved.',
          cta: { href: '/', label: 'Return home' },
        }
      : null;

  const newLeadsCount = vendor ? leads.filter(l => l.status === 'new').length : 0;
  const approvedReviews = vendor ? reviews.filter(r => r.status === 'approved') : [];
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
    : 0;

  const renderAccessCard = (headline: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500" />
          {headline}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          {!vendor
            ? 'Complete your vendor application to access this area.'
            : 'Your application is pending approval. Access will unlock once approved.'}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button asChild className="bg-[#132847] hover:bg-[#1a3a5f]">
            <Link href={vendor ? '/' : '/apply'}>{vendor ? 'Return home' : 'Start application'}</Link>
          </Button>
          {!vendor && (
            <Button variant="outline" asChild>
              <Link href="/contact">Get support</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          {applicationNotice && (
            <Card className="mb-6 border-amber-200 bg-amber-50">
              <CardContent className="pt-4 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#132847]">{applicationNotice.title}</p>
                  <p className="text-sm text-gray-700 mt-1">{applicationNotice.body}</p>
                </div>
                {applicationNotice.cta && (
                  <Button asChild className="bg-[#132847] hover:bg-[#1a3a5f]">
                    <Link href={applicationNotice.cta.href}>{applicationNotice.cta.label}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>{vendorDisplay.company_name?.[0] || 'V'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-primary">{vendorDisplay.company_name}</h3>
                      <Badge variant={vendorDisplay.listing_tier === 'featured' ? 'default' : 'secondary'}>
                        {vendorDisplay.listing_tier || 'free'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    {menuItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                          activeSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive">{item.badge}</Badge>
                        )}
                      </button>
                    ))}
                  </nav>
                  <div className="pt-6 mt-6 border-t">
                    <Button
                      variant="outline"
                      className="w-full justify-center bg-[#fffaf2] text-[#132847] hover:bg-[#fff0dc]"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                      Welcome back, {vendorDisplay.company_name}
                    </p>
                  </div>

                  {!vendor ? (
                    <Card>
                      <CardContent className="pt-6 space-y-3">
                        <p className="font-semibold text-primary">Vendor profile missing</p>
                        <p className="text-sm text-muted-foreground">
                          Start or resume your vendor application to unlock performance insights, leads, and profile editing tools.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Button asChild className="bg-[#132847] hover:bg-[#1a3a5f]">
                            <Link href="/apply">Start application</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href="/contact">Talk to our team</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : isPending ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-primary flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          Application pending
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-muted-foreground">
                        <p>Your vendor application is under review. You will see metrics and lead activity here after approval.</p>
                        <Button variant="outline" asChild className="w-fit">
                          <Link href="/">Return home</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-primary">{vendor.view_count || 0}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-primary">{leads.length}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">Reviews</CardTitle>
                          </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{reviews.length}</div>
                      </CardContent>
                    </Card>
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
                                Hi {firstNameDisplay || 'there'}, welcome to Broker Tools. <em>I am Simba your Support Dog.</em>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                If you need help with anything our{' '}
                                <Link href="/faq" className="text-primary underline underline-offset-4">FAQs</Link> and{' '}
                                <Link href="/blog" className="text-primary underline underline-offset-4">Getting Started resources</Link>{' '}
                                can help you out. Otherwise, feel free to reach out to our human support team.
                              </p>
                              <Button
                                className="w-fit bg-[#132847] text-white hover:bg-[#1a3a5f]"
                                onClick={() => router.push('/faq?ask=1')}
                              >
                                Contact support
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-[#132847] flex items-center gap-2">
                              <Inbox className="w-5 h-5" />
                              Recent Leads
                            </CardTitle>
                            {newLeadsCount > 0 && (
                              <Badge className="bg-[#ef4e23]">{newLeadsCount} New</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {leads.length === 0 ? (
                            <div className="text-center py-8">
                              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-600">No leads yet</p>
                              <p className="text-sm text-gray-500">Your inquiries will appear here</p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {leads.slice(0, 5).map(lead => (
                                <div key={lead.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-semibold text-[#132847]">{lead.broker_name}</p>
                                      {lead.status === 'new' && (
                                        <Badge className="bg-green-500 text-xs">New</Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">{lead.broker_email}</p>
                                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{lead.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(lead.created_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {leads.length > 5 && (
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => setActiveSection('leads')}
                                >
                                  View All Leads ({leads.length})
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-[#132847]">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-4">
                            <Button
                              variant="outline"
                              className="h-auto py-6 flex flex-col items-center gap-2"
                              onClick={() => setActiveSection('edit-profile')}
                            >
                              <Edit className="w-8 h-8 text-[#132847]" />
                              <span>Edit Profile</span>
                            </Button>
                            <Button
                              variant="outline"
                              className="h-auto py-6 flex flex-col items-center gap-2"
                              onClick={() => setActiveSection('analytics')}
                            >
                              <BarChart3 className="w-8 h-8 text-[#05d8b5]" />
                              <span>View Analytics</span>
                            </Button>
                            <Button
                              variant="outline"
                              className="h-auto py-6 flex flex-col items-center gap-2"
                              onClick={() => setActiveSection('upgrade')}
                            >
                              <Crown className="w-8 h-8 text-[#ef4e23]" />
                              <span>Upgrade Plan</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              )}

              {activeSection === 'leads' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Leads & Inquiries</h1>
                    <p className="text-muted-foreground">Manage your incoming leads</p>
                  </div>
                  {(!vendor || isPending) ? (
                    renderAccessCard('Leads are locked')
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        {leads.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">No leads yet</p>
                        ) : (
                          <div className="space-y-4">
                            {leads.map((lead) => (
                              <div key={lead.id} className="p-4 border rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-semibold">{lead.broker_name}</p>
                                    <p className="text-sm text-muted-foreground">{lead.broker_email}</p>
                                    <p className="text-sm text-muted-foreground">{lead.broker_phone}</p>
                                  </div>
                                  <Badge>{lead.status}</Badge>
                                </div>
                                {lead.message && (
                                  <p className="text-sm text-foreground mt-2">{lead.message}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeSection === 'edit-profile' && (
                (!vendor || isPending) ? (
                  renderAccessCard('Profile editing is locked')
                ) : editedVendor ? (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-2">Edit Profile</h1>
                      <p className="text-muted-foreground">Update your vendor profile information</p>
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Company Logo</label>
                          <div className="flex items-center gap-4">
                            {editedVendor.logo_url && (
                              <img src={editedVendor.logo_url} alt="Logo" className="w-20 h-20 rounded-lg object-contain border" />
                            )}
                            <div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                                className="w-full"
                              />
                              {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Company Name</label>
                          <Input
                            value={editedVendor.company_name || ''}
                            onChange={(e) => setEditedVendor({ ...editedVendor, company_name: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Tagline</label>
                          <Input
                            value={editedVendor.tagline || ''}
                            onChange={(e) => setEditedVendor({ ...editedVendor, tagline: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <Textarea
                            value={editedVendor.description || ''}
                            onChange={(e) => setEditedVendor({ ...editedVendor, description: e.target.value })}
                            rows={5}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Website</label>
                          <Input
                            value={editedVendor.website || ''}
                            onChange={(e) => setEditedVendor({ ...editedVendor, website: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Categories</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {categories.map(cat => (
                              <div key={cat.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={cat.value}
                                  checked={editedVendor.categories?.includes(cat.value) || false}
                                  onCheckedChange={(checked) => {
                                    const currentCategories = editedVendor.categories || [];
                                    if (checked) {
                                      setEditedVendor({ ...editedVendor, categories: [...currentCategories, cat.value] });
                                    } else {
                                      setEditedVendor({ ...editedVendor, categories: currentCategories.filter(c => c !== cat.value) });
                                    }
                                  }}
                                />
                                <label htmlFor={cat.value} className="text-sm cursor-pointer">
                                  {cat.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setActiveSection('dashboard')}>
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card><CardContent className="pt-6 text-sm text-muted-foreground">Loading profile...</CardContent></Card>
                )
              )}

              {activeSection === 'analytics' && (
                (!vendor || isPending) ? renderAccessCard('Analytics locked') : (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
                      <p className="text-muted-foreground">View your vendor performance metrics</p>
                    </div>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center py-8">Analytics will be available once Supabase tables are set up.</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              )}

              {activeSection === 'upgrade' && (
                (!vendor || isPending) ? renderAccessCard('Upgrade options locked') : (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-primary mb-2">Upgrade Plan</h1>
                      <p className="text-muted-foreground">Upgrade your listing to get more visibility</p>
                    </div>
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center py-8">Upgrade options will be available soon.</p>
                      </CardContent>
                    </Card>
                  </div>
                )
              )}

              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and dashboard access.</p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#132847] flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Profile Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className={`grid w-full md:w-3/4 grid-cols-3 ${fieldBoxClass}`}>
                          <TabsTrigger value="profile" className="data-[state=active]:bg-gray-200">
                            Profile
                          </TabsTrigger>
                          <TabsTrigger value="biz-info" className="data-[state=active]:bg-gray-200">
                            Biz Info
                          </TabsTrigger>
                          <TabsTrigger value="dashboard-access" className="data-[state=active]:bg-gray-200">
                            Dashboard
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Company Name</label>
                              <Input value={vendorDisplay.company_name || ''} disabled className={fieldBoxClass} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <Input value={user?.email || ''} disabled className={fieldBoxClass} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Website</label>
                              <Input value={vendor?.website || ''} disabled className={fieldBoxClass} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Phone</label>
                              <Input value={vendor?.phone || ''} disabled className={fieldBoxClass} />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="biz-info" className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg ${fieldBoxClass}`}>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge className="mt-1">{vendorDisplay.status || 'draft'}</Badge>
                            </div>
                            <div className={`p-4 rounded-lg ${fieldBoxClass}`}>
                              <p className="text-sm text-muted-foreground">Listing tier</p>
                              <Badge variant="secondary" className="mt-1">{vendorDisplay.listing_tier || 'unlisted'}</Badge>
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg ${fieldBoxClass}`}>
                            <p className="text-sm text-muted-foreground">More business settings will appear once Supabase wiring is connected.</p>
                          </div>
                        </TabsContent>

                        <TabsContent value="dashboard-access" className="space-y-6">
                          <div className="space-y-1">
                            <p className="text-lg font-semibold text-[#132847]">Dashboard access</p>
                            <p className="text-sm text-gray-600">
                              Set your default view and jump to another dashboard when you need to.
                            </p>
                            <p className="text-xs text-gray-500">
                              {availableDashboards.length > 0
                                ? `Access: ${availableDashboards.map((d) => d.label).join(', ')}`
                                : 'Access information not available for this profile yet.'}
                            </p>
                          </div>

                          {availableDashboards.length === 0 ? (
                            <div className={`p-4 rounded-lg ${fieldBoxClass}`}>
                              <p className="text-sm text-gray-700">
                                We could not detect additional dashboards on your profile yet.
                              </p>
                            </div>
                          ) : (
                            <>
                              <Tabs defaultValue={defaultDashboard || availableDashboards[0].id}>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {availableDashboards.map((dashboard) => (
                                    <div
                                      key={dashboard.id}
                                      className={`p-4 rounded-lg ${fieldBoxClass} ${defaultDashboard === dashboard.id ? 'ring-2 ring-[#132847]' : ''}`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <input
                                          type="radio"
                                          id={`dash-${dashboard.id}`}
                                          name="default-dashboard"
                                          checked={defaultDashboard === dashboard.id}
                                          onChange={() => setDefaultDashboard(dashboard.id)}
                                          className="mt-1"
                                        />
                                        <div className="flex-1">
                                          <label htmlFor={`dash-${dashboard.id}`} className="font-semibold cursor-pointer text-[#132847]">
                                            {dashboard.label}
                                          </label>
                                          <p className="text-sm text-gray-600 mt-1">{dashboard.description}</p>
                                        </div>
                                      </div>
                                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                                        <Button
                                          variant="outline"
                                          className="border border-gray-700 text-[#132847]"
                                          onClick={() => goToDashboard(dashboard.path)}
                                        >
                                          Switch now
                                        </Button>
                                        {defaultDashboard === dashboard.id && <Badge variant="secondary">Selected</Badge>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Tabs>

                              <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-gray-600">
                                  Pick a default dashboard and switch with one click.
                                </p>
                                <Button
                                  onClick={handleSaveDefaultDashboard}
                                  disabled={!defaultDashboard || savingDefaultDashboard}
                                  className="bg-[#132847] hover:bg-[#1a3a5f]"
                                >
                                  {savingDefaultDashboard ? 'Saving...' : 'Save default view'}
                                </Button>
                              </div>
                            </>
                          )}
                          <div className="pt-4 border-t">
                            <Button variant="outline" onClick={handleSignOut}>
                              Sign Out
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
  );
}

export default function VendorDashboardPage() {
  return (
    <Suspense fallback={
      <>
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
      </>
    }>
      <VendorDashboardContent />
    </Suspense>
  );
}

