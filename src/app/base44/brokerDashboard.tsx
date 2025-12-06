
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  Share
} from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is installed for toast notifications
import AIChatDialog from "../components/vendors/AIChatDialog"; // New import for AI Chat Dialog

export default function BrokerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showReviewsDialog, setShowReviewsDialog] = useState(false);
  const [showBadgesDialog, setShowBadgesDialog] = useState(false);
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    phone: "",
    company: "",
    broker_type: "mortgage_broker",
    notification_frequency: "daily",
    display_name: "full_name",
    profile_image: ""
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setProfileData({
        full_name: u.full_name || "",
        phone: u.phone || "",
        company: u.company || "",
        broker_type: u.broker_type || "mortgage_broker",
        notification_frequency: u.notification_frequency || "daily",
        display_name: u.display_name || "full_name",
        profile_image: u.profile_image || ""
      });
    }).catch(() => {
      navigate(createPageUrl('Home'));
    });
  }, [navigate]);

  const { data: myShortlist = [] } = useQuery({
    queryKey: ['my-shortlist', user?.email],
    queryFn: () => base44.entities.Shortlist.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: myLeads = [] } = useQuery({
    queryKey: ['my-leads', user?.email],
    queryFn: () => base44.entities.Lead.filter({ broker_email: user.email }, '-created_date'),
    enabled: !!user,
  });

  const { data: recentVendors = [] } = useQuery({
    queryKey: ['recent-vendors'],
    queryFn: () => base44.entities.Vendor.filter({ status: 'approved' }, '-created_date', 6),
  });

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setProfileData({ ...profileData, profile_image: file_url });
      await base44.auth.updateMe({ profile_image: file_url });
      toast.success("Profile image updated!");
      setUser({ ...user, profile_image: file_url }); // Update user state as well
    } catch (error) {
      toast.error("Failed to upload image");
    }
    setUploading(false);
  };

  const handleSaveProfile = async () => {
    try {
      await base44.auth.updateMe(profileData);
      toast.success("Profile updated successfully!");
      setUser({...user, ...profileData}); // Update local user state to reflect changes immediately
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const referralLink = `${window.location.origin}${createPageUrl('Home')}?ref=${user?.id}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join BrokerTools',
        text: 'Check out BrokerTools - the best directory for broker solutions!',
        url: referralLink
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#132847]" />
      </div>
    );
  }

  return (
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
                        <img src={profileData.profile_image} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <AvatarFallback className="bg-[#132847] text-white text-2xl">
                          {user?.full_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase()}
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
                  <h3 className="font-bold text-lg text-[#132847]">{user?.full_name || "Broker"}</h3>
                  <p className="text-sm text-gray-500">Member since {new Date(user?.created_date).getFullYear()}</p>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {menuItems.map(item => (
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
                      Welcome back, {user?.full_name || "Broker"}! Check out your current stats:
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
                        <p className="text-sm text-gray-600">You've written</p>
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
                        <p className="text-sm text-gray-600">You've earned</p>
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
                        <p className="text-sm text-gray-600">You've answered</p>
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
                        <p className="text-sm text-gray-600">You've made</p>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Inbox Notifications */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[#132847] flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Inbox
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection('inbox')}
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {myLeads.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No new notifications</p>
                        <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myLeads.slice(0, 3).map(lead => (
                          <div key={lead.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                            <div className="w-2 h-2 rounded-full bg-[#ef4e23] mt-2" />
                            <div className="flex-1">
                              <p className="font-medium text-[#132847]">Response from {lead.vendor_name}</p>
                              <p className="text-sm text-gray-600 line-clamp-2">{lead.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(lead.created_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Activity Center - Shortlisted Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#132847] flex items-center gap-2">
                      <Bookmark className="w-5 h-5" />
                      Activity Center - Your Shortlist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {myShortlist.length === 0 ? (
                      <div className="text-center py-8">
                        <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 mb-4">You haven't shortlisted any products or services yet!</p>
                        <Link to={createPageUrl('BrowseVendors')}>
                          <Button className="bg-[#132847] hover:bg-[#1a3a5f]">
                            Browse Vendors
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {myShortlist.slice(0, 5).map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div>
                              <p className="font-medium text-[#132847]">{item.vendor_name}</p>
                              {item.notes && (
                                <p className="text-sm text-gray-600 line-clamp-1">{item.notes}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Resources Feed - Green Background */}
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-2">Resources</h3>
                    <p className="mb-6 opacity-90">
                      Explore our curated resources to help grow your brokerage
                    </p>
                    <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <Link to={createPageUrl('Blog')} className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <div>
                          <p className="font-semibold">Getting Started Guide</p>
                          <p className="text-sm opacity-90">Learn the basics of broker tools</p>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                      <Link to={createPageUrl('Blog')} className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <div>
                          <p className="font-semibold">Best CRM Systems for 2025</p>
                          <p className="text-sm opacity-90">Top-rated solutions reviewed</p>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                      <Link to={createPageUrl('Blog')} className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <div>
                          <p className="font-semibold">Community Q&A</p>
                          <p className="text-sm opacity-90">Ask questions and share knowledge</p>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                    <Button
                      className="mt-4 bg-white text-green-600 hover:bg-gray-100"
                      onClick={() => setActiveSection('resources')}
                    >
                      Explore All Resources
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'inbox' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847] flex items-center gap-2">
                    <Inbox className="w-5 h-5" />
                    Inbox & Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {myLeads.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h3>
                      <p className="text-gray-600">Your inbox is empty. Start browsing vendors to receive updates!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myLeads.map(lead => (
                        <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-[#ef4e23]" />
                              <h4 className="font-semibold text-[#132847]">{lead.vendor_name}</h4>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(lead.created_date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{lead.message}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{lead.status}</Badge>
                            <Badge variant="secondary">{lead.source}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'products' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#132847] flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Products
                    </CardTitle>
                    <Button onClick={() => setShowAIChat(true)} variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Browse Products</h3>
                    <p className="text-gray-600 mb-6">Discover software and tools for your brokerage</p>
                    <Link to={createPageUrl('BrowseVendors?category=mortgage_software')}>
                      <Button className="bg-[#132847] hover:bg-[#1a3a5f]">
                        Explore Products
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'services' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#132847] flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Services
                    </CardTitle>
                    <Button onClick={() => setShowAIChat(true)} variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Browse Services</h3>
                    <p className="text-gray-600 mb-6">Find service providers to support your business</p>
                    <Link to={createPageUrl('BrowseVendors?category=marketing_services')}>
                      <Button className="bg-[#132847] hover:bg-[#1a3a5f]">
                        Explore Services
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'resources' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#132847] flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Resources & Community Q&A
                    </CardTitle>
                    <Button onClick={() => setShowAIChat(true)} variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Getting Started */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-3">Getting Started</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Link to={createPageUrl('Blog')} className="p-4 border rounded-lg hover:border-[#05d8b5] transition-colors">
                          <h4 className="font-semibold text-[#132847] mb-2">Platform Guide</h4>
                          <p className="text-sm text-gray-600">Learn how to make the most of BrokerTools</p>
                        </Link>
                        <Link to={createPageUrl('Blog')} className="p-4 border rounded-lg hover:border-[#05d8b5] transition-colors">
                          <h4 className="font-semibold text-[#132847] mb-2">Video Tutorials</h4>
                          <p className="text-sm text-gray-600">Watch step-by-step guides</p>
                        </Link>
                      </div>
                    </div>

                    {/* Community Q&A */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-3">Community Q&A</h3>
                      <div className="space-y-3">
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium text-[#132847] mb-1">How to choose the right CRM?</p>
                          <p className="text-sm text-gray-600 mb-2">Asked by John D. • 5 answers</p>
                          <Button variant="outline" size="sm">View Discussion</Button>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <p className="font-medium text-[#132847] mb-1">Best lead generation tools in 2025?</p>
                          <p className="text-sm text-gray-600 mb-2">Asked by Sarah M. • 8 answers</p>
                          <Button variant="outline" size="sm">View Discussion</Button>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-[#132847] hover:bg-[#1a3a5f]">
                        Ask a Question
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'partnerships' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#132847] flex items-center gap-2">
                      <Handshake className="w-5 h-5" />
                      Partnerships
                    </CardTitle>
                    <Button onClick={() => setShowAIChat(true)} variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Handshake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Partnership Opportunities</h3>
                    <p className="text-gray-600 mb-6">Connect with vendors for exclusive deals and partnerships</p>
                    <Button className="bg-[#132847] hover:bg-[#1a3a5f]">
                      Explore Partnerships
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'growth-tracker' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Growth Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Rewards */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-3">Your Rewards</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-6 border rounded-lg">
                          <Award className="w-12 h-12 text-[#05d8b5] mx-auto mb-3" />
                          <h4 className="font-semibold text-[#132847]">Momentum Maker</h4>
                          <p className="text-sm text-gray-600 mt-1">0 referrals made</p>
                        </div>
                        <div className="text-center p-6 border border-dashed rounded-lg opacity-50">
                          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <h4 className="font-semibold text-gray-600">Review Master</h4>
                          <p className="text-sm text-gray-500 mt-1">Write 10 reviews</p>
                        </div>
                        <div className="text-center p-6 border border-dashed rounded-lg opacity-50">
                          <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <h4 className="font-semibold text-gray-600">Community Hero</h4>
                          <p className="text-sm text-gray-500 mt-1">Answer 50 questions</p>
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-3">Achievements</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Star className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#132847]">First Review</p>
                              <p className="text-sm text-gray-600">Write your first vendor review</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Start</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Bookmark className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-[#132847]">Shortlist Pro</p>
                              <p className="text-sm text-gray-600">Save 5 vendors to your shortlist</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Continue</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={user?.email}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="+44 7XXX XXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <Input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Broker Type</label>
                      <Select value={profileData.broker_type} onValueChange={(value) => setProfileData({...profileData, broker_type: value})}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select broker type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mortgage_broker">Mortgage Broker</SelectItem>
                          <SelectItem value="asset_finance_broker">Asset Finance Broker</SelectItem>
                          <SelectItem value="commercial_finance_broker">Commercial Finance Broker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Inbox Notification Frequency</label>
                      <Select value={profileData.notification_frequency} onValueChange={(value) => setProfileData({...profileData, notification_frequency: value})}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <Select value={profileData.display_name} onValueChange={(value) => setProfileData({...profileData, display_name: value})}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="How should your name be displayed?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_name">Full Name</SelectItem>
                          <SelectItem value="first_name">First Name Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full bg-[#132847] hover:bg-[#1a3a5f]">
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

      {/* Dialogs */}
      <Dialog open={showReviewsDialog} onOpenChange={setShowReviewsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Reviews</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">You haven't written any reviews yet.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">View All Reviews</Button>
              <Link to={createPageUrl('BrowseVendors')} className="flex-1">
                <Button className="w-full bg-[#132847] hover:bg-[#1a3a5f]">Write a Review</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBadgesDialog} onOpenChange={setShowBadgesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Badges</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Award className="w-12 h-12 text-[#05d8b5] mx-auto mb-2" />
                <p className="font-semibold">Momentum Maker</p>
                <Button size="sm" className="mt-2" variant="outline">Redeem Prize</Button>
              </div>
              <div className="text-center p-4 border border-dashed rounded-lg opacity-50">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="font-semibold text-gray-600">Review Master</p>
                <p className="text-xs text-gray-500">Write 10 reviews</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQuestionsDialog} onOpenChange={setShowQuestionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Community Questions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">You haven't answered any questions yet.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">See Your Answers</Button>
              <Button className="flex-1 bg-[#132847] hover:bg-[#1a3a5f]" onClick={() => { setActiveSection('resources'); setShowQuestionsDialog(false); }}>
                Help Answer Questions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share BrokerTools</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">Share your unique referral link and earn rewards!</p>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={copyReferralLink} variant="outline">Copy</Button>
            </div>
            <Button onClick={shareReferral} className="w-full bg-[#132847] hover:bg-[#1a3a5f]">
              <Share className="w-4 h-4 mr-2" />
              Share Link
            </Button>
            <div className="text-center text-sm text-gray-500">
              You've made <span className="font-bold text-[#132847]">0</span> referrals
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AIChatDialog open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
}
