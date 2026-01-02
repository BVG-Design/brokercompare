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
  BarChart3 as BarChart,
  Crown,
  Settings,
  Eye,
  Mail,
  Star,
  TrendingUp,
  CreditCard,
  Plus,
  Trash2,
  Trash,
  Upload,
  ExternalLink,
  MessageSquare,
  CheckCircle,
  X,
  AlertCircle,
  Users,
  Video,
  Target,
  FileText,
  Link as LinkIcon,
  DollarSign,
  Check,
  Phone,
  Puzzle,
  User as UserIcon,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import {
  getProfile,
  getPartnerForUser,
  getPartnerLeads,
  getPartnerReviews,
  type LeadRecord,
  type ReviewRecord,
  type PartnerRecord,
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
    id: 'partner',
    label: 'Partner Dashboard',
    description: 'Update your partner listing, track leads, and reviews.',
    path: '/dashboard/partner',
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

type PartnerMaterial = { title: string; type: 'video' | 'pdf' | 'link'; link: string };
type PartnerForm = PartnerRecord & {
  pricing?: string | null;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  features?: string[];
  integrations?: string[];
  teamSize?: string[];
  revenue?: string[];
  budgetAmount?: string;
  budgetPeriod?: 'monthly' | 'yearly' | 'project';
  lookingTo?: string[];
  lookingToOther?: string;
  notFitFor?: string;
  materials?: PartnerMaterial[];
  newFeature?: string;
  newIntegration?: string;
  newMaterial?: PartnerMaterial;
  isTrainingPublic?: boolean;
};
function PartnerDashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [uploading, setUploading] = useState(false);
  const [editedPartner, setEditedPartner] = useState<PartnerForm | null>(null);
  const [partner, setPartner] = useState<PartnerForm | null>(null);
  const [partnerProfiles, setPartnerProfiles] = useState<PartnerForm[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [partnerLoading, setPartnerLoading] = useState(true);
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

  // Auth + profile + partner bootstrap
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

      const hasPartnerAccess = Boolean(profile?.partner_dashboard) || profile?.user_type === 'partner';
      if (!hasPartnerAccess) {
        setAccessDenied(true);
        setPartnerLoading(false);
        return;
      }

      const partnerRecord = profile
        ? await getPartnerForUser(supabase, profile)
        : null;

      const withDefaults: PartnerForm | null = partnerRecord
        ? {
          ...partnerRecord,
          categories: partnerRecord.categories || [],
          features: partnerRecord.features || [],
          integrations: partnerRecord.integrations || [],
          teamSize: partnerRecord.teamSize || [],
          revenue: partnerRecord.revenue || [],
          budgetAmount: partnerRecord.budgetAmount || '500',
          budgetPeriod: (partnerRecord.budgetPeriod as PartnerForm['budgetPeriod']) || 'monthly',
          lookingTo: partnerRecord.lookingTo || [],
          lookingToOther: partnerRecord.lookingToOther || '',
          notFitFor: partnerRecord.notFitFor || '',
          materials:
            partnerRecord.materials ||
            [
              { title: 'Dashboard Tutorial', type: 'video', link: 'https://youtube.com/...' },
              { title: 'Feature Guide', type: 'pdf', link: 'https://clickup.com/guide.pdf' },
            ],
          newFeature: '',
          newIntegration: '',
          newMaterial: { title: '', type: 'video', link: '' },
          isTrainingPublic: true,
        }
        : null;

      setPartner(withDefaults);
      setEditedPartner(withDefaults);

      if (partnerRecord?.id) {
        const [leadRows, reviewRows] = await Promise.all([
          getPartnerLeads(supabase, partnerRecord.id),
          getPartnerReviews(supabase, partnerRecord.id),
        ]);
        setLeads(leadRows || []);
        setReviews(reviewRows || []);
      }

      setPartnerLoading(false);
    };

    init();
  }, [router]);

  useEffect(() => {
    const accessible = dashboardOptions.filter((option) => {
      if (!profile) return option.id === 'partner';
      if (option.id === 'admin') return Boolean(profile.admin_dashboard);
      if (option.id === 'broker') return Boolean(profile.broker_dashboard);
      return Boolean(profile.partner_dashboard) || profile.user_type === 'partner';
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

  useEffect(() => {
    if (partner) {
      setPartnerProfiles((prev) => (prev.length > 0 ? prev : [partner]));
      setActivePartnerId((prev) => prev || partner.id);
    }
  }, [partner]);

  useEffect(() => {
    const activeProfile =
      partnerProfiles.find((p) => p.id === activePartnerId) || partnerProfiles[0];
    if (activeProfile) {
      setEditedPartner({
        ...activeProfile,
        categories: activeProfile.categories || [],
        features: activeProfile.features || [],
        integrations: activeProfile.integrations || [],
        teamSize: activeProfile.teamSize || [],
        revenue: activeProfile.revenue || [],
        budgetAmount: activeProfile.budgetAmount || '500',
        budgetPeriod: activeProfile.budgetPeriod || 'monthly',
        lookingTo: activeProfile.lookingTo || [],
        lookingToOther: activeProfile.lookingToOther || '',
        notFitFor: activeProfile.notFitFor || '',
        materials:
          activeProfile.materials && activeProfile.materials.length > 0
            ? activeProfile.materials
            : [
              { title: 'Dashboard Tutorial', type: 'video', link: 'https://youtube.com/...' },
              { title: 'Feature Guide', type: 'pdf', link: 'https://clickup.com/guide.pdf' },
            ],
        newFeature: '',
        newIntegration: '',
        newMaterial: { title: '', type: 'video', link: '' },
        isTrainingPublic: activeProfile.isTrainingPublic ?? true,
      });
    }
  }, [activePartnerId, partnerProfiles]);

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

  const handleSaveProfile = () => {
    if (!editedPartner) return;
    setPartnerProfiles((prev) =>
      prev.map((p) => (p.id === editedPartner.id ? { ...p, ...editedPartner } : p))
    );
    if (partner && partner.id === editedPartner.id) {
      setPartner({ ...partner, ...editedPartner });
    }
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

  const handleAddProfile = () => {
    const newProfile: PartnerForm = {
      id: `draft-${Date.now()}`,
      company_name: `Profile ${partnerProfiles.length + 1}`,
      listing_tier: 'draft',
      status: 'draft',
      categories: [],
      logo_url: '',
      website: '',
      description: '',
      tagline: '',
      view_count: 0,
      pricing: '',
      phone: '',
      first_name: '',
      last_name: '',
      email: '',
      features: [],
      integrations: [],
      teamSize: [],
      revenue: [],
      budgetAmount: '',
      budgetPeriod: 'monthly',
      lookingTo: [],
      lookingToOther: '',
      notFitFor: '',
      materials: [],
      newFeature: '',
      newIntegration: '',
      newMaterial: { title: '', type: 'video', link: '' },
      isTrainingPublic: true,
    };

    setPartnerProfiles((prev) => [...prev, newProfile]);
    setActivePartnerId(newProfile.id);
    setEditedPartner({ ...newProfile, categories: [] });
    toast({
      title: 'New partner profile started',
      description: 'Fill in the details and submit for approval once ready.',
    });
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

  if (partnerLoading) {
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
            page="/dashboard/partner"
            backHref="/dashboard/broker"
          />
        </div>
      </main>
    );
  }

  const activePartner =
    partnerProfiles.find((p) => p.id === activePartnerId) ||
    partnerProfiles[0] ||
    partner;

  const partnerDisplay = activePartner || {
    company_name: profile?.company || 'Your business',
    listing_tier: 'unlisted',
    status: 'draft',
    logo_url: '',
  };
  const isPending = partnerDisplay?.status === 'pending';
  const applicationNotice = !activePartner
    ? {
      title: 'Complete your partner application',
      body: 'We could not find a partner profile for this account. Start your application to unlock the partner dashboard.',
      cta: { href: '/apply', label: 'Start application' },
    }
    : isPending
      ? {
        title: 'Application pending review',
        body: 'Your partner application is under review. We will notify you when it is approved.',
        cta: { href: '/', label: 'Return home' },
      }
      : null;

  const hasPrimaryPartner = Boolean(partner);
  const newLeadsCount = activePartner && hasPrimaryPartner && activePartner.id === partner?.id
    ? leads.filter(l => l.status === 'new').length
    : 0;
  const approvedReviews = activePartner && hasPrimaryPartner && activePartner.id === partner?.id
    ? reviews.filter(r => r.status === 'approved')
    : [];
  const visibleLeads = activePartner && hasPrimaryPartner && activePartner.id === partner?.id ? leads : [];
  const visibleReviews = activePartner && hasPrimaryPartner && activePartner.id === partner?.id ? reviews : [];
  const avgRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / approvedReviews.length
    : 0;
  const pmfSnapshot = {
    team: activePartner?.categories && activePartner.categories.length > 0
      ? activePartner.categories.slice(0, 3).map((cat) => cat.replace(/_/g, ' '))
      : ['Small (3-6)', 'Med (7-10)'],
    revenue: ['$30k - $60k / mo'],
    goals: ['Reduce admin', 'Better reporting'],
    budget: partnerDisplay.listing_tier === 'featured' ? '$750 / monthly' : '$500 / monthly',
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Inquiries', icon: Inbox, badge: newLeadsCount },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'upgrade', label: 'Upgrade Plan', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

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
          {!activePartner
            ? 'Complete your partner application to access this area.'
            : 'Your application is pending approval. Access will unlock once approved.'}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button asChild className="bg-[#132847] hover:bg-[#1a3a5f]">
            <Link href={activePartner ? '/' : '/apply'}>{activePartner ? 'Return home' : 'Start application'}</Link>
          </Button>
          {!activePartner && (
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
        <Card className="mb-8 border-gray-200">
          <CardContent className="pt-5 pb-6 space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="text-primary w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold text-[#132847]">Partner profiles</p>
                  <p className="text-xs text-gray-600">Switch between profiles or start a new one.</p>
                </div>
              </div>
              <Button variant="outline" className="border-dashed" onClick={handleAddProfile}>
                <Plus className="w-4 h-4 mr-2" />
                Add profile
              </Button>
            </div>
            <div className="flex gap-3 flex-wrap">
              {partnerProfiles.length === 0 && (
                <span className="text-sm text-gray-500">No profiles yet. Create one to get started.</span>
              )}
              {partnerProfiles.map((profileCard) => (
                <button
                  key={profileCard.id}
                  onClick={() => setActivePartnerId(profileCard.id)}
                  className={`px-4 py-3 rounded-xl border transition-all text-left ${activePartnerId === profileCard.id
                    ? 'bg-[#132847] text-white border-[#132847] shadow-lg shadow-gray-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-white'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {profileCard.company_name || 'Untitled profile'}
                    </span>
                    <Badge variant={profileCard.status === 'approved' ? 'default' : 'secondary'}>
                      {profileCard.status || 'draft'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {profileCard.listing_tier || 'unlisted'} tier | {profileCard.view_count || 0} views
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback>{partnerDisplay.company_name?.[0] || 'V'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-primary">{partnerDisplay.company_name}</h3>
                    <Badge variant={partnerDisplay.listing_tier === 'featured' ? 'default' : 'secondary'}>
                      {partnerDisplay.listing_tier || 'free'}
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
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${activeSection === item.id
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
                    Welcome back, {partnerDisplay.company_name}
                  </p>
                </div>

                {!activePartner ? (
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <p className="font-semibold text-primary">Partner profile missing</p>
                      <p className="text-sm text-muted-foreground">
                        Start or resume your partner application to unlock performance insights, leads, and profile editing tools.
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
                      <p>Your partner application is under review. You will see metrics and lead activity here after approval.</p>
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
                          <div className="text-3xl font-bold text-primary">{partnerDisplay.view_count || 0}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{visibleLeads.length}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-muted-foreground">Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-primary">{visibleReviews.length}</div>
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

                    <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target size={20} className="text-blue-600" />
                          <h2 className="font-bold text-gray-900">Product Market Fit</h2>
                        </div>
                        <button onClick={() => setActiveSection('edit-profile')} className="text-blue-600 text-xs font-bold hover:underline">
                          Manage PMF
                        </button>
                      </div>
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Ideal Team Size</h4>
                            <div className="flex flex-wrap gap-2">
                              {pmfSnapshot.team.map((s) => (
                                <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Target Customer Revenue</h4>
                            <div className="flex flex-wrap gap-2">
                              {pmfSnapshot.revenue.map((s) => (
                                <span key={s} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Key Customer Goals</h4>
                            <div className="flex flex-wrap gap-2">
                              {pmfSnapshot.goals.map((s) => (
                                <span key={s} className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Target Budget</h4>
                            <p className="text-sm font-bold text-gray-900">{pmfSnapshot.budget}</p>
                          </div>
                        </div>
                      </div>
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
                        {visibleLeads.length === 0 ? (
                          <div className="text-center py-8">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600">No leads yet</p>
                            <p className="text-sm text-gray-500">Your inquiries will appear here</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {visibleLeads.slice(0, 5).map(lead => (
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
                                    {lead.created_at || (lead as any).created_date
                                      ? new Date((lead.created_at || (lead as any).created_date) as string).toLocaleDateString()
                                      : 'Pending'}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {visibleLeads.length > 5 && (
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setActiveSection('leads')}
                              >
                                View All Leads ({visibleLeads.length})
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
                            <BarChart className="w-4 h-4 text-green-600" />
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
                {(!activePartner || isPending) ? (
                  renderAccessCard('Leads are locked')
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      {visibleLeads.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No leads yet</p>
                      ) : (
                        <div className="space-y-4">
                          {visibleLeads.map((lead) => (
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
              (!activePartner || isPending) ? (
                renderAccessCard('Profile editing is locked')
              ) : editedPartner ? (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Edit Profile</h1>
                    <p className="text-muted-foreground">Update your partner profile information</p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-4">
                        {editedPartner.logo_url && (
                          <img src={editedPartner.logo_url} alt="Logo" className="w-20 h-20 rounded-lg object-contain border" />
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

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Company Name</label>
                          <Input
                            value={editedPartner.company_name || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, company_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Pricing</label>
                          <Input
                            value={editedPartner.pricing || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, pricing: e.target.value })}
                            placeholder="$0 - $29 /mo"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Tagline</label>
                          <Input
                            value={editedPartner.tagline || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, tagline: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Website</label>
                          <Input
                            value={editedPartner.website || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, website: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={editedPartner.description || ''}
                          onChange={(e) => setEditedPartner({ ...editedPartner, description: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <UserIcon size={16} className="text-gray-500" /> First Name
                          </label>
                          <Input
                            value={editedPartner.first_name || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, first_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <UserIcon size={16} className="text-gray-500" /> Last Name
                          </label>
                          <Input
                            value={editedPartner.last_name || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, last_name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <Mail size={16} className="text-gray-500" /> Email
                          </label>
                          <Input
                            value={editedPartner.email || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                            <Phone size={16} className="text-gray-500" /> Phone
                          </label>
                          <Input
                            value={editedPartner.phone || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Categories</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {categories.map(cat => (
                            <div key={cat.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={cat.value}
                                checked={editedPartner.categories?.includes(cat.value) || false}
                                onCheckedChange={(checked) => {
                                  const currentCategories = editedPartner.categories || [];
                                  if (checked) {
                                    setEditedPartner({ ...editedPartner, categories: [...currentCategories, cat.value] });
                                  } else {
                                    setEditedPartner({ ...editedPartner, categories: currentCategories.filter(c => c !== cat.value) });
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
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Highlights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Check size={16} className="text-green-500" />
                            <p className="font-semibold text-sm">Key Features</p>
                          </div>
                          <div className="space-y-2 mb-3">
                            {(editedPartner.features || []).map((feature, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                <span className="text-sm text-gray-700">{feature}</span>
                                <button
                                  onClick={() =>
                                    setEditedPartner({
                                      ...editedPartner,
                                      features: (editedPartner.features || []).filter((_, i) => i !== idx),
                                    })
                                  }
                                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add feature..."
                              value={editedPartner.newFeature || ''}
                              onChange={(e) => setEditedPartner({ ...editedPartner, newFeature: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && editedPartner.newFeature?.trim()) {
                                  setEditedPartner({
                                    ...editedPartner,
                                    features: [...(editedPartner.features || []), editedPartner.newFeature.trim()],
                                    newFeature: '',
                                  });
                                }
                              }}
                            />
                            <Button
                              onClick={() => {
                                if (editedPartner.newFeature?.trim()) {
                                  setEditedPartner({
                                    ...editedPartner,
                                    features: [...(editedPartner.features || []), editedPartner.newFeature.trim()],
                                    newFeature: '',
                                  });
                                }
                              }}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Puzzle size={16} className="text-blue-500" />
                            <p className="font-semibold text-sm">Integrations</p>
                          </div>
                          <div className="space-y-2 mb-3">
                            {(editedPartner.integrations || []).map((integration, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                                <span className="text-sm text-gray-700">{integration}</span>
                                <button
                                  onClick={() =>
                                    setEditedPartner({
                                      ...editedPartner,
                                      integrations: (editedPartner.integrations || []).filter((_, i) => i !== idx),
                                    })
                                  }
                                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add integration..."
                              value={editedPartner.newIntegration || ''}
                              onChange={(e) => setEditedPartner({ ...editedPartner, newIntegration: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && editedPartner.newIntegration?.trim()) {
                                  setEditedPartner({
                                    ...editedPartner,
                                    integrations: [...(editedPartner.integrations || []), editedPartner.newIntegration.trim()],
                                    newIntegration: '',
                                  });
                                }
                              }}
                            />
                            <Button
                              onClick={() => {
                                if (editedPartner.newIntegration?.trim()) {
                                  setEditedPartner({
                                    ...editedPartner,
                                    integrations: [...(editedPartner.integrations || []), editedPartner.newIntegration.trim()],
                                    newIntegration: '',
                                  });
                                }
                              }}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Market Fit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                            <Users size={12} /> Team Size
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {['independent', 'small', 'med', 'large'].map((val) => {
                              const labels: Record<string, string> = {
                                independent: 'independent (1-2)',
                                small: 'small (3-6)',
                                med: 'med (7-10)',
                                large: 'large (10+)',
                              };
                              const selected = (editedPartner.teamSize || []).includes(val);
                              return (
                                <button
                                  key={val}
                                  onClick={() =>
                                    setEditedPartner({
                                      ...editedPartner,
                                      teamSize: selected
                                        ? (editedPartner.teamSize || []).filter((v) => v !== val)
                                        : [...(editedPartner.teamSize || []), val],
                                    })
                                  }
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selected
                                    ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                  {labels[val]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
                            <DollarSign size={12} /> Ideal Customer Revenue
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { value: 'under_15k', label: 'Under $15k / month' },
                              { value: '15k_30k', label: '$15k - $30k / month' },
                              { value: '30k_60k', label: '$30k - $60k / month' },
                              { value: '60k_100k', label: '$60k - $100k / month' },
                              { value: '100k_plus', label: '$100k+ / month' },
                            ].map((opt) => {
                              const selected = (editedPartner.revenue || []).includes(opt.value);
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() =>
                                    setEditedPartner({
                                      ...editedPartner,
                                      revenue: selected
                                        ? (editedPartner.revenue || []).filter((v) => v !== opt.value)
                                        : [...(editedPartner.revenue || []), opt.value],
                                    })
                                  }
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${selected
                                    ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Ideal Budget</p>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <DollarSign size={14} />
                              </div>
                              <Input
                                type="number"
                                value={editedPartner.budgetAmount || ''}
                                onChange={(e) => setEditedPartner({ ...editedPartner, budgetAmount: e.target.value })}
                                className="pl-8"
                              />
                            </div>
                            <select
                              value={editedPartner.budgetPeriod || 'monthly'}
                              onChange={(e) =>
                                setEditedPartner({ ...editedPartner, budgetPeriod: e.target.value as PartnerForm['budgetPeriod'] })
                              }
                              className="border rounded-md px-3 py-2 text-sm"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="yearly">Yearly</option>
                              <option value="project">Project</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Looking to:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            { value: 'reduce_admin', label: 'Reduce admin and manual work' },
                            { value: 'improve_client', label: 'Improve client experience' },
                            { value: 'scale_no_hire', label: 'Scale without hiring' },
                            { value: 'better_reporting', label: 'Get better reporting or visibility' },
                            { value: 'compliance_confidence', label: 'Improve compliance confidence' },
                            { value: 'replace_spreadsheets', label: 'Replace spreadsheets or legacy tools' },
                            { value: 'consolidate_systems', label: 'Consolidate multiple systems' },
                            { value: 'other', label: 'Other' },
                          ].map((opt) => {
                            const selected = (editedPartner.lookingTo || []).includes(opt.value);
                            return (
                              <button
                                key={opt.value}
                                onClick={() =>
                                  setEditedPartner({
                                    ...editedPartner,
                                    lookingTo: selected
                                      ? (editedPartner.lookingTo || []).filter((v) => v !== opt.value)
                                      : [...(editedPartner.lookingTo || []), opt.value],
                                  })
                                }
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all ${selected
                                  ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <div
                                  className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${selected ? 'bg-white border-white' : 'bg-white border-gray-200'
                                    }`}
                                >
                                  {selected && <Check size={10} className="text-blue-900" />}
                                </div>
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {(editedPartner.lookingTo || []).includes('other') && (
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Other goals</label>
                          <Textarea
                            rows={2}
                            value={editedPartner.lookingToOther || ''}
                            onChange={(e) => setEditedPartner({ ...editedPartner, lookingToOther: e.target.value })}
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Not the right fit for:</label>
                        <Textarea
                          rows={2}
                          value={editedPartner.notFitFor || ''}
                          onChange={(e) => setEditedPartner({ ...editedPartner, notFitFor: e.target.value })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Training Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold">
                          Upload Media <span className="text-xs text-gray-500 ml-2">({(editedPartner.materials || []).length}/5)</span>
                        </p>
                        {!editedPartner.isTrainingPublic && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg border border-orange-100 text-[10px] font-bold">
                            <AlertCircle size={10} /> Private Mode
                          </div>
                        )}
                      </div>
                      {editedPartner.isTrainingPublic ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {(editedPartner.materials || []).map((m, i) => (
                              <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl relative group">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="p-2 bg-white rounded-lg shadow-sm">
                                    {m.type === 'video' ? (
                                      <Video size={14} className="text-purple-500" />
                                    ) : m.type === 'pdf' ? (
                                      <FileText size={14} className="text-red-500" />
                                    ) : (
                                      <LinkIcon size={14} className="text-blue-500" />
                                    )}
                                  </div>
                                  <button
                                    onClick={() =>
                                      setEditedPartner({
                                        ...editedPartner,
                                        materials: (editedPartner.materials || []).filter((_, idx) => idx !== i),
                                      })
                                    }
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                <p className="text-sm font-bold text-gray-900 truncate">{m.title}</p>
                                <p className="text-[10px] text-gray-500 truncate mt-1">{m.link}</p>
                              </div>
                            ))}
                            {(editedPartner.materials || []).length < 5 && (
                              <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
                                <Plus size={24} className="mb-1" />
                                <span className="text-xs font-medium">Add new item below</span>
                              </div>
                            )}
                          </div>
                          {(editedPartner.materials || []).length < 5 && (
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
                              <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title</label>
                                <Input
                                  placeholder="e.g. Intro Video"
                                  value={editedPartner.newMaterial?.title || ''}
                                  onChange={(e) =>
                                    setEditedPartner({
                                      ...editedPartner,
                                      newMaterial: { ...(editedPartner.newMaterial || { type: 'video', link: '' }), title: e.target.value },
                                    })
                                  }
                                />
                              </div>
                              <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
                                <select
                                  value={editedPartner.newMaterial?.type || 'video'}
                                  onChange={(e) =>
                                    setEditedPartner({
                                      ...editedPartner,
                                      newMaterial: { ...(editedPartner.newMaterial || { title: '', link: '' }), type: e.target.value as PartnerMaterial['type'] },
                                    })
                                  }
                                  className="border rounded-md px-3 py-2 text-sm"
                                >
                                  <option value="video">Video</option>
                                  <option value="pdf">PDF</option>
                                  <option value="link">Weblink</option>
                                </select>
                              </div>
                              <div className="md:col-span-1">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Link URL</label>
                                <Input
                                  placeholder="https://..."
                                  value={editedPartner.newMaterial?.link || ''}
                                  onChange={(e) =>
                                    setEditedPartner({
                                      ...editedPartner,
                                      newMaterial: { ...(editedPartner.newMaterial || { title: '', type: 'video' }), link: e.target.value },
                                    })
                                  }
                                />
                              </div>
                              <Button
                                onClick={() => {
                                  if (
                                    editedPartner.newMaterial?.title &&
                                    editedPartner.newMaterial.link &&
                                    (editedPartner.materials || []).length < 5
                                  ) {
                                    setEditedPartner({
                                      ...editedPartner,
                                      materials: [...(editedPartner.materials || []), editedPartner.newMaterial as PartnerMaterial],
                                      newMaterial: { title: '', type: 'video', link: '' },
                                    });
                                  }
                                }}
                              >
                                Add Material
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-center text-sm text-gray-600">
                          Training Materials are hidden. Contact admin to enable public visibility.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setActiveSection('dashboard')}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Card><CardContent className="pt-6 text-sm text-muted-foreground">Loading profile...</CardContent></Card>
              )
            )}

            {activeSection === 'analytics' && (
              (!activePartner || isPending) ? renderAccessCard('Analytics locked') : (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
                    <p className="text-muted-foreground">View your partner performance metrics</p>
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
              (!activePartner || isPending) ? renderAccessCard('Upgrade options locked') : (
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
                            <Input value={partnerDisplay.company_name || ''} disabled className={fieldBoxClass} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <Input value={user?.email || ''} disabled className={fieldBoxClass} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Website</label>
                            <Input value={partner?.website || ''} disabled className={fieldBoxClass} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <Input value={partner?.phone || ''} disabled className={fieldBoxClass} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="biz-info" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className={`p-4 rounded-lg ${fieldBoxClass}`}>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className="mt-1">{partnerDisplay.status || 'draft'}</Badge>
                          </div>
                          <div className={`p-4 rounded-lg ${fieldBoxClass}`}>
                            <p className="text-sm text-muted-foreground">Listing tier</p>
                            <Badge variant="secondary" className="mt-1">{partnerDisplay.listing_tier || 'unlisted'}</Badge>
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

export default function PartnerDashboardPage() {
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
      <PartnerDashboardContent />
    </Suspense>
  );
}

