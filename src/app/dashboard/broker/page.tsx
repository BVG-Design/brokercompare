'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

  // Mock data, in a real app this would come from an API
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
    // Mock user auth
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
    toast({ title: 'Profile updated successfully!' });
    setUser({ ...user, ...profileData });
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  {/* Profile Section */}
                  <div className="text-center mb-6">
                    <label className="cursor-pointer group relative block">
                      <Avatar className="w-20 h-20 mx-auto mb-3 ring-2 ring-gray-200 group-hover:ring-[#132847] transition-all">
                        {profileData.profile_image ? (
                          <AvatarImage
                            src={profileData.profile_image}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-[#132847] text-white text-2xl">
                            {user?.full_name?.substring(0, 2).toUpperCase() ||
                              user?.email?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </Avatar>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        disabled={uploading}
                      />
                    </label>
                    <h3 className="font-bold text-lg text-[#132847]">
                      {user?.full_name || 'Broker'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Member since{' '}
                      {new Date(user?.created_date).getFullYear()}
                    </p>
                  </div>

                  {/* Navigation Menu */}
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          activeSection === item.id
                            ? 'bg-[#132847] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge > 0 && (
                          <Badge className="bg-[#ef4e23] text-white">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  {/* Welcome Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#132847]">
                        Welcome back, {user?.full_name || 'Broker'}! Check out
                        your current stats:
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                          onClick={() => setShowReviewsDialog(true)}
                          className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-center mb-2">
                            <MessageSquare className="w-8 h-8 text-[#132847]" />
                          </div>
                          <p className="text-sm text-gray-600">
                            You&apos;ve written
                          </p>
                          <p className="text-2xl font-bold text-[#132847]">0</p>
                          <p className="text-sm text-gray-600">reviews</p>
                        </button>
                        <button
                          onClick={() => setShowBadgesDialog(true)}
                          className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-center mb-2">
                            <Award className="w-8 h-8 text-[#05d8b5]" />
                          </div>
                          <p className="text-sm text-gray-600">
                            You&apos;ve earned
                          </p>
                          <p className="text-2xl font-bold text-[#132847]">1</p>
                          <p className="text-sm text-gray-600">badge</p>
                        </button>
                        <button
                          onClick={() => setShowQuestionsDialog(true)}
                          className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-center mb-2">
                            <ThumbsUp className="w-8 h-8 text-[#ef4e23]" />
                          </div>
                          <p className="text-sm text-gray-600">
                            You&apos;ve answered
                          </p>
                          <p className="text-2xl font-bold text-[#132847]">0</p>
                          <p className="text-sm text-gray-600">questions</p>
                        </button>
                        <button
                          onClick={() => setShowReferralDialog(true)}
                          className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-center mb-2">
                            <Star className="w-8 h-8 text-yellow-500" />
                          </div>
                          <p className="text-sm text-gray-600">Referrals</p>
                          <p className="text-2xl font-bold text-[#132847]">0</p>
                          <p className="text-sm text-gray-600">You&apos;ve made</p>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Other dashboard sections */}
                </div>
              )}
              {activeSection === 'settings' && (
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
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </Label>
                        <Input
                          type="text"
                          value={profileData.full_name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              full_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Email
                        </Label>
                        <Input type="email" value={user?.email} disabled />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </Label>
                        <Input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+44 7XXX XXXXXX"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Company
                        </Label>
                        <Input
                          type="text"
                          value={profileData.company}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              company: e.target.value,
                            })
                          }
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2">
                          Broker Type
                        </Label>
                        <Select
                          value={profileData.broker_type}
                          onValueChange={(value) =>
                            setProfileData({
                              ...profileData,
                              broker_type: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select broker type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mortgage_broker">
                              Mortgage Broker
                            </SelectItem>
                            <SelectItem value="asset_finance_broker">
                              Asset Finance Broker
                            </SelectItem>
                            <SelectItem value="commercial_finance_broker">
                              Commercial Finance Broker
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleSaveProfile}
                        className="w-full bg-[#132847] hover:bg-[#1a3a5f]"
                      >
                        Save Changes
                      </Button>
                      <div className="pt-4 border-t">
                        <button className="text-sm text-red-600 hover:text-red-700 underline">
                          Deactivate Account
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
