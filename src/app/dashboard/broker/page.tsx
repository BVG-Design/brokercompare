'use client';
export const dynamic = "force-dynamic";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import AIChatDialog from '@/components/vendors/AIChatDialog';
import { services, software } from '@/lib/data';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ServiceCard } from '@/app/services/service-card';
import { SoftwareCard } from '@/app/software/software-card';

export default function BrokerDashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showReviewsDialog, setShowReviewsDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    company: '',
    broker_type: 'mortgage_broker',
    notification_frequency: 'daily',
    display_name: 'full_name',
    profile_image: '',
  });

  const myShortlist = [services[0], software[1]];
  const myLeads = [
    {
      id: '1',
      vendor_name: 'Marketing Pro AU',
      message: 'Following up on your inquiry about our SEO services...',
      created_date: new Date().toISOString(),
      status: 'new',
      source: 'profile_view',
    },
  ];
  const recentVendors = [...services.slice(0, 3), ...software.slice(0, 3)];

  useEffect(() => {
    const mockUser = {
      id: 'user_123',
      email: 'broker@example.com',
      full_name: 'Alex Broker',
      phone: '0400 123 456',
      company: 'Future Finance',
      broker_type: 'mortgage_broker',
      notification_frequency: 'daily',
      display_name: 'full_name',
      profile_image: 'https://picsum.photos/seed/user-alex/100/100',
      created_date: new Date(2023, 5, 15).toISOString(),
    };
    setUser(mockUser);
    setProfileData({
      full_name: mockUser.full_name,
      phone: mockUser.phone,
      company: mockUser.company,
      broker_type: mockUser.broker_type,
      notification_frequency: mockUser.notification_frequency,
      display_name: mockUser.display_name,
      profile_image: mockUser.profile_image,
    });
  }, []);

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    await new Promise((res) => setTimeout(res, 1500)); // Simulate upload
    const file_url = URL.createObjectURL(file);
    setProfileData({ ...profileData, profile_image: file_url });
    toast({ title: 'Profile image updated!' });
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    await new Promise((res) => setTimeout(res, 1000)); // Simulate API call
    setUser((prevUser) => ({ ...prevUser, ...profileData }));
    toast({ title: 'Profile updated successfully!' });
  };

  const referralLink = `${
    typeof window !== 'undefined' ? window.location.origin : ''
  }/?ref=${user?.id}`;

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
                                <p className="font-semibold">{lead.vendor_name}</p>
                                <Badge variant={lead.status === 'new' ? 'default' : 'outline'}>{lead.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{lead.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{new Date(lead.created_date).toLocaleString()}</p>
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
                {software.slice(0,3).map(item => <SoftwareCard key={item.id} software={item} />)}
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
                {services.slice(0,3).map(item => <ServiceCard key={item.id} service={item} />)}
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
              <div className="space-y-6">
                <div>
                  <Label>Full Name</Label>
                  <Input value={profileData.full_name} onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input value={profileData.company} onChange={(e) => setProfileData({ ...profileData, company: e.target.value })} />
                </div>
                <div>
                  <Label>Broker Type</Label>
                  <Select value={profileData.broker_type} onValueChange={(value) => setProfileData({ ...profileData, broker_type: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mortgage_broker">Mortgage Broker</SelectItem>
                      <SelectItem value="asset_finance_broker">Asset Finance Broker</SelectItem>
                      <SelectItem value="commercial_finance_broker">Commercial Finance Broker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveProfile} className="w-full bg-[#132847] hover:bg-[#1a3a5f]">Save Changes</Button>
                <div className="pt-4 border-t">
                  <button className="text-sm text-red-600 hover:text-red-700 underline">Deactivate Account</button>
                </div>
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
      <Header />
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
                    <p className="text-sm text-gray-500">Member since {new Date(user.created_date).getFullYear()}</p>
                  </div>
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          activeSection === item.id ? 'bg-[#132847] text-white' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3"><item.icon className="w-5 h-5" /><span>{item.label}</span></div>
                        {item.badge > 0 && <Badge className="bg-[#ef4e23] text-white">{item.badge}</Badge>}
                      </button>
                    ))}
                  </nav>
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
                <Button onClick={shareReferral}><Share className="mr-2 h-4 w-4"/>Share</Button>
              </div>
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
                <Award className="mx-auto w-16 h-16 text-yellow-500 mb-4"/>
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

      <Footer />
    </>
  );
}
