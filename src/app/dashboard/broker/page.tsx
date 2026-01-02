'use client';


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  LayoutDashboard,
  Inbox,
  Package,
  Briefcase,
  BookOpen,
  Handshake,
  TrendingUp,
  Settings,
  MessageSquare,
  Award,
  ThumbsUp,
  Star,
  Bell,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Upload,
  Share,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AIChatDialog from '@/components/partners/AIChatDialog';
import { ServiceCard } from '@/app/services/service-card';
import { SoftwareCard } from '@/app/software/software-card';
import { supabase } from '@/lib/supabase/client';
import {
  getProfile,
  getBrokerLeads,
  getBrokerShortlist,
  type UserProfile,
  type LeadRecord,
  type ShortlistRecord,
} from '@/lib/dashboard-data';

// Temporary placeholders until real data wiring is added
const services: any[] = [];
const software: any[] = [];

const aggregators = [
  'AMAG',
  'Astute Financial Management',
  'Buyers Choice Home Loan Advisory Service',
  'Auspak Financial Services',
  'Aussie',
  'Australian Finance Group',
  'Balmain NB Commercial Mortgages',
  'Bernie Lewis Home Loans',
  'Centrepoint Alliance Lending',
  'Choice Aggregation Services',
  'Connective Group',
  'eChoice Home Loans',
  'Elders Home Loans',
  'Fasttrack Finance Group',
  'Finance & Systems Technology',
  'Finance King',
  'Finconnect',
  'Finsure Finance & Insurance',
  'First Chartered Capital Operations',
  'GMS Group (Sample and Partners)',
  'LJ Hooker Home Loans',
  'Loan Market (LMG)',
  'Loankit',
  'Loans Today',
  'Mortgage Choice',
  'Mortgage House',
  'Mortgage Loans Australia',
  'Mortgage Point',
  'My Local Aggregation',
  'My Local Broker',
  'National Mortgage Brokers (nMB)',
  'NewCo Financial Services',
  'Our Broker',
  'Pennley',
  'PLAN Australia',
  'Purple Circle Financial Services',
  'Real Estate .com .au',
  'Smartline Personal Mortgage Advisers',
  'Specialist Finance Group',
  'Sure Harvest Pty Ltd',
  'Vow Financial',
  'MoneyQuest',
  'Nectar Mortgages',
  'National Lending Group',
  'Finance and Mortgage Solutions',
  'Outsource Financial Pty Ltd',
  'Yellow Brick Road',
  'Other',
];

const priorities = [
  'Task Management',
  'Workflow Automations',
  'Lead Generation',
  'Marketing',
  'Manual Entry',
  'Retention/Referral Marketing / Amplification',
  'Reporting',
  'Team Development',
  'Systems Training',
  'Mindset & Strategic Growth',
  'AI Enablement',
];

const serviceProviders = [
  { id: 'has_it_support', label: 'IT Support' },
  { id: 'has_accountant', label: 'Accountant' },
  { id: 'has_marketing_agency', label: 'Marketing Agency' },
  { id: 'has_mindset_coach', label: 'Mindset Coach or Growth Strategist' },
  { id: 'has_lawyer', label: 'Lawyer' },
  { id: 'has_insurance_broker', label: 'Insurance Broker' },
  { id: 'has_ai_specialist', label: 'AI & Automations Specialist' },
] as const;

const brokerServices = [
  { value: 'mortgage_broker', label: 'Mortgage Broker' },
  { value: 'asset_finance_broker', label: 'Asset Finance Broker' },
  { value: 'commercial_finance_broker', label: 'Commercial Finance Broker' },
  { value: 'all_brokers', label: 'All Broker Types' },
  { value: 'other', label: 'Other' },
];

const commercialFinanceAreas = [
  { value: 'commercial_mortgage', label: 'Commercial Mortgage' },
  { value: 'bridging_loans', label: 'Bridging Loans' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'invoicing', label: 'Invoicing' },
  { value: 'trade_finance', label: 'Trade Finance' },
  { value: 'other', label: 'Other' },
];

const dashboardOptions = [
  {
    id: 'broker',
    label: 'Broker Dashboard',
    description: 'Manage your broker profile, leads, and shortlist.',
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

export const dynamic = 'force-dynamic';

export default function BrokerDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showReviewsDialog, setShowReviewsDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: '',
    website: '',
    company: '',
    notification_frequency: 'daily',
    display_name: 'full_name',
    profile_image: '',
    broker_services: [] as string[],
    broker_service_other: '',
    commercial_finance_areas: [] as string[],
    commercial_finance_other: '',
    what_brought_you_here: '',
    aggregator: '',
    aggregator_other: '',
    team_size: '',
    team_location: '',
    top_priorities: [] as string[],
    lead_capture_crm: '',
    fact_find_software: '',
    email_system: '',
    phone_system: '',
    has_it_support: false,
    has_accountant: false,
    has_marketing_agency: false,
    has_mindset_coach: false,
    has_lawyer: false,
    has_insurance_broker: false,
    has_ai_specialist: false,
    considering_change: false,
    change_details: '',
  });

  const [myShortlist, setMyShortlist] = useState<(ShortlistRecord | any)[]>([]);
  const [myLeads, setMyLeads] = useState<LeadRecord[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [recommendationOpen, setRecommendationOpen] = useState(false);
  const [recommendationProvider, setRecommendationProvider] = useState<string | null>(null);
  const [recommendationSubmitted, setRecommendationSubmitted] = useState(false);
  const [recommendationForm, setRecommendationForm] = useState({
    name: '',
    business: '',
    email: '',
    website: '',
  });
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [availableDashboards, setAvailableDashboards] = useState<
    { id: DashboardKey; label: string; description: string; path: string }[]
  >([]);
  const [defaultDashboard, setDefaultDashboard] = useState<DashboardKey | null>(null);
  const [savingDefaultDashboard, setSavingDefaultDashboard] = useState(false);
  const [welcomeAnswered, setWelcomeAnswered] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user || null);

      const prof = await getProfile(supabase, user.id);
      setProfile(prof);
      const mergedFullName = [prof?.first_name, prof?.last_name].filter(Boolean).join(' ').trim();
      if (mergedFullName) {
        setUser({ ...user, full_name: mergedFullName });
      }
      setProfileData({
        full_name: mergedFullName || prof?.full_name || '',
        website: prof?.website || '',
        company: prof?.company || '',
        notification_frequency: (prof?.notification_frequency as string) || 'daily',
        display_name: prof?.display_name || 'full_name',
        profile_image: prof?.profile_image || '',
        broker_services: (prof?.broker_services as string[]) || [],
        broker_service_other: prof?.broker_service_other || '',
        commercial_finance_areas: (prof?.commercial_finance_areas as string[]) || [],
        commercial_finance_other: prof?.commercial_finance_other || '',
        what_brought_you_here: '',
        aggregator: prof?.aggregator || '',
        aggregator_other: prof?.aggregator_other || '',
        team_size: prof?.team_size || '',
        team_location: prof?.team_location || '',
        top_priorities: (prof?.top_priorities as string[]) || [],
        lead_capture_crm: prof?.lead_capture_crm || '',
        fact_find_software: prof?.fact_find_software || '',
        email_system: prof?.email_system || '',
        phone_system: prof?.phone_system || '',
        has_it_support: prof?.has_it_support || false,
        has_accountant: prof?.has_accountant || false,
        has_marketing_agency: prof?.has_marketing_agency || false,
        has_mindset_coach: prof?.has_mindset_coach || false,
        has_lawyer: prof?.has_lawyer || false,
        has_insurance_broker: prof?.has_insurance_broker || false,
        has_ai_specialist: prof?.has_ai_specialist || false,
        considering_change: prof?.considering_change || false,
        change_details: prof?.change_details || '',
      });

      const [shortlist, leads] = await Promise.all([
        getBrokerShortlist(supabase, user.id),
        getBrokerLeads(supabase, user.id, user.email),
      ]);

      setMyShortlist(shortlist && shortlist.length > 0 ? shortlist : []);
      setMyLeads(leads || []);

      const { data: welcomeAnswer } = await supabase
        .from('what_brought_you_here')
        .select('answer')
        .eq('created_by', user.id)
        .maybeSingle();

      if (welcomeAnswer) {
        setWelcomeAnswered(true);
      }
      if (welcomeAnswer?.answer) {
        setProfileData((prev) => ({ ...prev, what_brought_you_here: welcomeAnswer.answer as string }));
      }
    };

    init();
  }, [router]);

  useEffect(() => {
    const hasAccess = (optionId: DashboardKey) => {
      if (!profile) {
        return optionId === 'broker';
      }

      if (optionId === 'admin') return Boolean(profile.admin_dashboard ?? profile.user_type === 'admin');
      if (optionId === 'partner') return Boolean(profile.partner_dashboard ?? profile.user_type === 'partner');
      return Boolean(profile.broker_dashboard ?? profile.user_type === 'broker');
    };

    const accessible = dashboardOptions.filter((option) => hasAccess(option.id)).map((option) => ({ ...option }));
    setAvailableDashboards(accessible);

    const preferredFromProfile =
      (profile?.default_profile as DashboardKey | null) &&
        accessible.some((option) => option.id === profile?.default_profile)
        ? (profile?.default_profile as DashboardKey)
        : null;

    setDefaultDashboard(preferredFromProfile || accessible[0]?.id || null);
  }, [profile, user]);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    // TODO: Swap for Supabase Storage upload
    await new Promise((res) => setTimeout(res, 1500));
    const file_url = URL.createObjectURL(file);
    setProfileData({ ...profileData, profile_image: file_url });
    toast({ title: 'Profile image updated!' });
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);

    try {
      const answer = profileData.what_brought_you_here?.trim() || null;
      const inferredFirstName = profile?.first_name || profileData.full_name.split(' ')[0] || null;
      const inferredLastName =
        profile?.last_name ||
        (profileData.full_name.includes(' ')
          ? profileData.full_name.split(' ').slice(1).join(' ')
          : null);

      await supabase.from('what_brought_you_here').upsert(
        [
          {
            answer,
            first_name: inferredFirstName,
            last_name: inferredLastName,
            email: user.email,
            created_by: user.id,
            updated_at: new Date().toISOString(),
            updated_by: user.id,
          },
        ],
        { onConflict: 'created_by' }
      );

      setWelcomeAnswered(true);

      setUser((prevUser: any) => ({ ...prevUser, ...profileData }));
      toast({ title: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to save profile', error);
      toast({ title: 'Failed to save profile', variant: 'destructive' });
    } finally {
      setSavingProfile(false);
    }
  };

  const togglePriority = (priority: string) => {
    if (profileData.top_priorities.includes(priority)) {
      setProfileData({
        ...profileData,
        top_priorities: profileData.top_priorities.filter((p) => p !== priority),
      });
      return;
    }

    if (profileData.top_priorities.length >= 3) {
      toast({
        title: 'Select only 3 priorities',
        description: 'Remove one before adding another.',
        variant: 'destructive',
      });
      return;
    }

    setProfileData({
      ...profileData,
      top_priorities: [...profileData.top_priorities, priority],
    });
  };

  const toggleBrokerService = (service: string) => {
    setProfileData((prev) => ({
      ...prev,
      broker_services: prev.broker_services.includes(service)
        ? prev.broker_services.filter((s) => s !== service)
        : [...prev.broker_services, service],
    }));
  };

  const toggleCommercialFinanceArea = (area: string) => {
    setProfileData((prev) => ({
      ...prev,
      commercial_finance_areas: prev.commercial_finance_areas.includes(area)
        ? prev.commercial_finance_areas.filter((a) => a !== area)
        : [...prev.commercial_finance_areas, area],
    }));
  };

  const handleSwitchDashboard = (dashboard: DashboardKey) => {
    const target = availableDashboards.find((option) => option.id === dashboard);
    if (!target) return;
    router.push(target.path);
  };

  const handleSaveDefaultDashboard = async () => {
    if (!user || !defaultDashboard) return;
    setSavingDefaultDashboard(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({
        default_profile: defaultDashboard,
        updated_by: user.id,
        last_login_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: 'Could not save default dashboard',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({ title: 'Default dashboard updated' });
      setProfile((prev) => (prev ? { ...prev, default_profile: defaultDashboard } : prev));
    }
    setSavingDefaultDashboard(false);
  };

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''
    }/?ref=${user?.id}`;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: 'Referral link copied!' });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join O Broker Tools',
        text: 'Check out O Broker Tools - the best directory for broker solutions!',
        url: referralLink,
      });
    } else {
      copyReferralLink();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: myLeads.length },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'partnerships', label: 'Partnerships', icon: Handshake },
    { id: 'growth-tracker', label: 'Growth Tracker', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const greetName =
    profile?.first_name ||
    profileData.full_name.split(' ')[0] ||
    (user?.full_name ? user.full_name.split(' ')[0] : '') ||
    'there';

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#132847]">
                  Welcome back, {user.full_name}!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "Reviews Written", value: 0, icon: MessageSquare, onClick: () => setShowReviewsDialog(true) },
                    { title: "Badges Earned", value: 1, icon: Award, onClick: () => setShowBadgesDialog(true) },
                    { title: "Questions Answered", value: 0, icon: ThumbsUp, onClick: () => setShowQuestionsDialog(true) },
                    { title: "Referrals Made", value: 0, icon: Star, onClick: () => setShowReferralDialog(true) },
                  ].map(stat => (
                    <button key={stat.title} onClick={stat.onClick} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex justify-center mb-2"><stat.icon className="w-8 h-8 text-[#132847]" /></div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#132847]">{stat.value}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                      Hi {greetName}, welcome to Broker Tools. <em>I am Simba your Support Dog.</em>
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
                <CardTitle>My Shortlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {myShortlist.map(item => 'pricing' in item ?
                    <SoftwareCard key={item.id} software={item} /> :
                    <ServiceCard key={item.id} service={item} />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'inbox':
        return (
          <Card>
            <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
            <CardContent>
              {myLeads.map(lead => (
                <div key={lead.id} className="border-b last:border-b-0 py-4">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{lead.partner_name}</p>
                    <Badge variant={lead.status === 'new' ? 'default' : 'outline'}>{lead.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{lead.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(lead.created_at || Date.now()).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      case 'products':
        return (
          <Card>
            <CardHeader><CardTitle>My Products</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {software.slice(0, 3).map(item => <SoftwareCard key={item.id} software={item} />)}
              </div>
            </CardContent>
          </Card>
        );
      case 'services':
        return (
          <Card>
            <CardHeader><CardTitle>My Services</CardTitle></CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.slice(0, 3).map(item => <ServiceCard key={item.id} service={item} />)}
              </div>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
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
                      <Label>Full Name</Label>
                      <Input
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className={fieldBoxClass}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user.email} disabled className={fieldBoxClass} />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className={fieldBoxClass}
                      />
                    </div>
                    <div>
                      <Label>Business Name</Label>
                      <Input
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        className={fieldBoxClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>What Brought You Here?</Label>
                      <Input
                        value={profileData.what_brought_you_here}
                        onChange={(e) =>
                          setProfileData({ ...profileData, what_brought_you_here: e.target.value })
                        }
                        placeholder="Tell us what led you to BrokerTools"
                        className={fieldBoxClass}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Update your answer anytime. The welcome prompt only appears on first login.
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-base">Broker Services</Label>
                    <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {brokerServices.map((service) => (
                        <div key={service.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={service.value}
                            checked={profileData.broker_services.includes(service.value)}
                            onCheckedChange={() => toggleBrokerService(service.value)}
                          />
                          <label htmlFor={service.value} className="text-sm cursor-pointer">
                            {service.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {profileData.broker_services.includes('other') && (
                      <div className="mt-3">
                        <Label>Other Broker Service</Label>
                        <Input
                          value={profileData.broker_service_other}
                          onChange={(e) =>
                            setProfileData({ ...profileData, broker_service_other: e.target.value })
                          }
                          placeholder="Describe your service"
                          className={fieldBoxClass}
                        />
                      </div>
                    )}

                    {profileData.broker_services.includes('commercial_finance_broker') && (
                      <div className="mt-4 border-l-4 border-[#05d8b5] pl-4">
                        <Label className="text-sm font-semibold text-[#132847]">
                          Commercial Finance Areas
                        </Label>
                        <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
                        <div className="grid md:grid-cols-2 gap-3">
                          {commercialFinanceAreas.map((area) => (
                            <div key={area.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`cf_${area.value}`}
                                checked={profileData.commercial_finance_areas.includes(area.value)}
                                onCheckedChange={() => toggleCommercialFinanceArea(area.value)}
                              />
                              <label htmlFor={`cf_${area.value}`} className="text-sm cursor-pointer">
                                {area.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {profileData.commercial_finance_areas.includes('other') && (
                          <div className="mt-3">
                            <Label>Other Commercial Finance Area</Label>
                            <Input
                              value={profileData.commercial_finance_other}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  commercial_finance_other: e.target.value,
                                })
                              }
                              placeholder="Describe the area"
                              className={fieldBoxClass}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-4">
                      {!welcomeAnswered ? (
                        <>
                          <Label>What Brought You Here?</Label>
                          <Input
                            value={profileData.what_brought_you_here}
                            onChange={(e) =>
                              setProfileData({ ...profileData, what_brought_you_here: e.target.value })
                            }
                            placeholder="Tell us what led you to BrokerTools"
                            className={fieldBoxClass}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Asked only on your first login. You can edit it later in Settings.
                          </p>
                        </>
                      ) : (
                        <div className={`p-3 rounded-lg border text-sm text-gray-600 ${fieldBoxClass}`}>
                          Thanks for sharing what brought you here. You can update this answer anytime in Settings.
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="biz-info" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Who is your Aggregator? *</Label>
                      <Select
                        value={profileData.aggregator}
                        onValueChange={(value) => setProfileData({ ...profileData, aggregator: value })}
                      >
                        <SelectTrigger className={`mt-2 ${fieldBoxClass}`}>
                          <SelectValue placeholder="Select your aggregator" />
                        </SelectTrigger>
                        <SelectContent>
                          {aggregators.map((agg) => (
                            <SelectItem key={agg} value={agg}>
                              {agg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {profileData.aggregator === 'Other' && (
                      <div>
                        <Label>Please specify</Label>
                        <Input
                          value={profileData.aggregator_other}
                          onChange={(e) =>
                            setProfileData({ ...profileData, aggregator_other: e.target.value })
                          }
                          placeholder="Enter your aggregator name"
                          className={`mt-2 ${fieldBoxClass}`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-lg font-semibold">Team Size *</Label>
                      <RadioGroup
                        value={profileData.team_size}
                        onValueChange={(value) => setProfileData({ ...profileData, team_size: value })}
                        className="mt-2 space-y-3"
                      >
                        {[
                          { value: 'just_me', label: 'Just Me' },
                          { value: '2-3', label: '2-3' },
                          { value: '4-10', label: '4-10' },
                          { value: '10+', label: '10+' },
                        ].map((team) => (
                          <div key={team.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={team.value} id={team.value} />
                            <label htmlFor={team.value} className="cursor-pointer">
                              {team.label}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {profileData.team_size && profileData.team_size !== 'just_me' && (
                      <div>
                        <Label className="text-lg font-semibold">Are all your team onshore or offshore?</Label>
                        <RadioGroup
                          value={profileData.team_location}
                          onValueChange={(value) => setProfileData({ ...profileData, team_location: value })}
                          className="mt-2 space-y-3"
                        >
                          {[
                            { value: 'onshore', label: 'All Onshore' },
                            { value: 'offshore', label: 'All Offshore (e.g., Philippines, India, Fiji)' },
                            { value: 'mixed', label: 'Mix of Both' },
                          ].map((location) => (
                            <div key={location.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={location.value} id={location.value} />
                              <label htmlFor={location.value} className="cursor-pointer">
                                {location.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-lg font-semibold">What are your top 3 priorities right now? *</Label>
                    <p className="text-sm text-gray-600 mt-1 mb-4">Select up to 3 priorities</p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {priorities.map((priority) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Checkbox
                            id={priority}
                            checked={profileData.top_priorities.includes(priority)}
                            onCheckedChange={() => togglePriority(priority)}
                            className="data-[state=checked]:bg-green-600"
                            disabled={
                              !profileData.top_priorities.includes(priority) &&
                              profileData.top_priorities.length >= 3
                            }
                          />
                          <label htmlFor={priority} className="text-sm cursor-pointer">
                            {priority}
                          </label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Selected: {profileData.top_priorities.length}/3
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Lead Capture/CRM</Label>
                      <Input
                        value={profileData.lead_capture_crm}
                        onChange={(e) =>
                          setProfileData({ ...profileData, lead_capture_crm: e.target.value })
                        }
                        placeholder="e.g., Aggregator Software, HubSpot"
                        className={`mt-2 ${fieldBoxClass}`}
                      />
                    </div>
                    <div>
                      <Label>Fact Find Document Collection</Label>
                      <Input
                        value={profileData.fact_find_software}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fact_find_software: e.target.value })
                        }
                        placeholder="e.g., Aggregator Software, Saletrekker"
                        className={`mt-2 ${fieldBoxClass}`}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={profileData.email_system}
                        onChange={(e) => setProfileData({ ...profileData, email_system: e.target.value })}
                        placeholder="e.g., Google Suite, Microsoft Office"
                        className={`mt-2 ${fieldBoxClass}`}
                      />
                    </div>
                    <div>
                      <Label>Phone System</Label>
                      <Input
                        value={profileData.phone_system}
                        onChange={(e) => setProfileData({ ...profileData, phone_system: e.target.value })}
                        placeholder="e.g., Mobile, Landline, VoIP (AirCall)"
                        className={`mt-2 ${fieldBoxClass}`}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold">Do you use or have a:</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-3 items-stretch">
                      {serviceProviders.map((item) => {
                        const hasProvider = Boolean(profileData[item.id]);
                        return (
                          <div key={item.id} className={`p-3 rounded-lg ${fieldBoxClass}`}>
                            <div className="flex items-center justify-between gap-2">
                              <label htmlFor={item.id} className="cursor-pointer font-medium">
                                {item.label}
                              </label>
                              <Switch
                                id={item.id}
                                checked={hasProvider}
                                onCheckedChange={(checked) =>
                                  setProfileData({ ...profileData, [item.id]: Boolean(checked) })
                                }
                              />
                            </div>
                            {hasProvider && (
                              <div className="mt-3 space-y-2">
                                <p className="text-sm text-gray-700">Are you happy to recommend them?</p>
                                <Button
                                  variant="outline"
                                  className="w-full border border-gray-700 text-[#132847]"
                                  onClick={() => {
                                    setRecommendationProvider(item.label);
                                    setRecommendationForm({ name: '', business: '', email: '', website: '' });
                                    setRecommendationSubmitted(false);
                                    setRecommendationError(null);
                                    setRecommendationOpen(true);
                                  }}
                                >
                                  Make a Recommendation
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div className="md:col-start-2 flex items-center justify-center">
                        <Button
                          variant="outline"
                          className="w-full bg-[#f7f3e8] border border-gray-700 text-[#132847]"
                          onClick={() => {
                            setRecommendationProvider('AI & Automations Specialist');
                            setRecommendationForm({ name: '', business: '', email: '', website: '' });
                            setRecommendationSubmitted(false);
                            setRecommendationError(null);
                            setRecommendationOpen(true);
                          }}
                        >
                          Make a Recommendation
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-semibold">
                      Are you considering adding new software or service to your business?
                    </Label>
                    <RadioGroup
                      value={profileData.considering_change ? 'yes' : 'no'}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, considering_change: value === 'yes' })
                      }
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="considering_yes" />
                        <label htmlFor="considering_yes" className="cursor-pointer">
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="considering_no" />
                        <label htmlFor="considering_no" className="cursor-pointer">
                          No
                        </label>
                      </div>
                    </RadioGroup>

                    {profileData.considering_change && (
                      <div>
                        <Label>If so, which one are you thinking of?</Label>
                        <Textarea
                          value={profileData.change_details}
                          onChange={(e) =>
                            setProfileData({ ...profileData, change_details: e.target.value })
                          }
                          placeholder="Tell us what you're looking to improve..."
                          rows={5}
                          className={`mt-2 ${fieldBoxClass}`}
                        />
                      </div>
                    )}
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
                        We could not detect additional dashboards on your profile yet. You will stay on the broker
                        dashboard for now.
                      </p>
                    </div>
                  ) : (
                    <>
                      <RadioGroup
                        value={defaultDashboard || ''}
                        onValueChange={(value) => setDefaultDashboard(value as DashboardKey)}
                        className="grid md:grid-cols-2 gap-4"
                      >
                        {availableDashboards.map((dashboard) => (
                          <div
                            key={dashboard.id}
                            className={`p-4 rounded-lg ${fieldBoxClass} ${defaultDashboard === dashboard.id ? 'ring-2 ring-[#132847]' : ''
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={dashboard.id} id={`dashboard-${dashboard.id}`} />
                              <div className="flex-1">
                                <label
                                  htmlFor={`dashboard-${dashboard.id}`}
                                  className="font-semibold cursor-pointer text-[#132847]"
                                >
                                  {dashboard.label}
                                </label>
                                <p className="text-sm text-gray-600 mt-1">{dashboard.description}</p>
                                {profile?.default_dashboard === dashboard.id && (
                                  <p className="text-xs text-green-700 mt-1">Currently saved as default</p>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 items-center">
                              <Button
                                variant="outline"
                                className="border border-gray-700 text-[#132847]"
                                onClick={() => handleSwitchDashboard(dashboard.id)}
                              >
                                Switch now
                              </Button>
                              {defaultDashboard === dashboard.id && <Badge variant="secondary">Selected</Badge>}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-gray-600">
                          {availableDashboards.length > 1
                            ? 'Pick a default dashboard and switch with one click.'
                            : 'Save your default view for the next sign-in.'}
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
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="mt-2.5 w-full bg-[#132847] hover:bg-[#1a3a5f]"
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </Button>
              <div className="pt-4 border-t">
                <button className="text-sm text-red-600 hover:text-red-700 underline">
                  Deactivate Account
                </button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return <Card><CardContent className="pt-6 text-center text-muted-foreground">This section is coming soon.</CardContent></Card>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <label className="cursor-pointer group relative block">
                      <Avatar className="w-20 h-20 mx-auto mb-3 ring-2 ring-gray-200 group-hover:ring-[#132847] transition-all">
                        {profileData.profile_image ? (
                          <AvatarImage src={profileData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <AvatarFallback className="bg-[#132847] text-white text-2xl">{user.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                          {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Upload className="w-6 h-6 text-white" />}
                        </div>
                      </Avatar>
                      <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageUpload} disabled={uploading} />
                    </label>
                    <h3 className="font-bold text-lg text-[#132847]">{user.full_name}</h3>
                    <p className="text-sm text-gray-500">Member since {new Date(user.created_at || Date.now()).getFullYear()}</p>
                  </div>
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? 'bg-[#132847] text-white' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex items-center gap-3"><item.icon className="w-5 h-5" /><span>{item.label}</span></div>
                        {(item.badge ?? 0) > 0 && <Badge className="bg-[#ef4e23] text-white">{item.badge}</Badge>}
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
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Refer a Friend</DialogTitle></DialogHeader>
          <p>Share your unique referral link to earn rewards!</p>
          <div className="flex items-center space-x-2">
            <Input value={referralLink} readOnly />
            <Button onClick={copyReferralLink}>Copy</Button>
            <Button onClick={shareReferral}><Share className="mr-2 h-4 w-4" />Share</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={recommendationOpen} onOpenChange={setRecommendationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recommend {recommendationProvider || 'your provider'}</DialogTitle>
          </DialogHeader>
          {!recommendationSubmitted ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Tell us who you recommend and how to reach them.</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={recommendationForm.name}
                    onChange={(e) => setRecommendationForm({ ...recommendationForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Business</Label>
                  <Input
                    value={recommendationForm.business}
                    onChange={(e) =>
                      setRecommendationForm({ ...recommendationForm, business: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={recommendationForm.email}
                    onChange={(e) => setRecommendationForm({ ...recommendationForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    value={recommendationForm.website}
                    onChange={(e) =>
                      setRecommendationForm({ ...recommendationForm, website: e.target.value })
                    }
                    placeholder="https://"
                    required
                  />
                </div>
              </div>
              {recommendationError && <p className="text-sm text-red-600">{recommendationError}</p>}
              <Button
                className="w-full bg-[#132847] hover:bg-[#1a3a5f]"
                onClick={() => {
                  if (!recommendationForm.business.trim() || !recommendationForm.website.trim()) {
                    setRecommendationError('Business name and website are required.');
                    return;
                  }
                  setRecommendationError(null);
                  setRecommendationSubmitted(true);
                }}
              >
                Submit Recommendation
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-700">
                Thanks for the recommendation, we will review and reach out to them.
              </p>
              <p className="text-sm text-gray-700 font-semibold">What would you like to do next:</p>
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  className="w-full bg-[#132847] hover:bg-[#1a3a5f]"
                  onClick={() => {
                    setRecommendationSubmitted(false);
                    setRecommendationProvider('Product, Software or Service');
                    setRecommendationForm({ name: '', business: '', email: '', website: '' });
                  }}
                >
                  Make a Recommendation
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setRecommendationOpen(false);
                    setActiveSection('dashboard');
                  }}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={showReviewsDialog} onOpenChange={setShowReviewsDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Your Reviews</DialogTitle></DialogHeader>
          <p className="text-center text-muted-foreground p-8">You haven't written any reviews yet.</p>
        </DialogContent>
      </Dialog>
      <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Your Badges</DialogTitle></DialogHeader>
          <div className="text-center p-8">
            <Award className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
            <p className="font-semibold">Early Adopter</p>
            <p className="text-sm text-muted-foreground">Thanks for joining us in the beginning!</p>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Your Answers</DialogTitle></DialogHeader>
          <p className="text-center text-muted-foreground p-8">You haven't answered any questions yet.</p>
        </DialogContent>
      </Dialog>

    </>
  );
}
