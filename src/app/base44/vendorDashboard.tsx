import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "lucide-react";
import { toast } from "sonner";

export default function VendorDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [uploading, setUploading] = useState(false);
  const [editedVendor, setEditedVendor] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
    }).catch(() => {
      navigate(createPageUrl('Home'));
    });
  }, [navigate]);

  const { data: vendor, isLoading: vendorLoading } = useQuery({
    queryKey: ['my-vendor', user?.email],
    queryFn: async () => {
      const vendors = await base44.entities.Vendor.filter({ email: user.email });
      return vendors.length > 0 ? vendors[0] : null;
    },
    enabled: !!user,
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['vendor-leads', vendor?.id],
    queryFn: () => base44.entities.Lead.filter({ vendor_id: vendor.id }, '-created_date'),
    enabled: !!vendor,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['vendor-reviews', vendor?.id],
    queryFn: () => base44.entities.Review.filter({ vendor_id: vendor.id }),
    enabled: !!vendor,
  });

  useEffect(() => {
    if (vendor && !editedVendor) {
      setEditedVendor({
        ...vendor,
        categories: vendor.categories || [],
        features: vendor.features || [],
        integrations: vendor.integrations || []
      });
    }
  }, [vendor]);

  const updateVendorMutation = useMutation({
    mutationFn: (data) => base44.entities.Vendor.update(vendor.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-vendor'] });
      toast.success("Profile updated successfully!");
    },
  });

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setEditedVendor({ ...editedVendor, logo_url: file_url });
      updateVendorMutation.mutate({ ...editedVendor, logo_url: file_url });
    } catch (error) {
      toast.error("Failed to upload logo");
    }
    setUploading(false);
  };

  const handleSaveProfile = () => {
    if (!editedVendor) return;
    updateVendorMutation.mutate(editedVendor);
  };

  const toggleCategory = (value) => {
    const currentCategories = editedVendor.categories || [];
    if (currentCategories.includes(value)) {
      setEditedVendor({ ...editedVendor, categories: currentCategories.filter(c => c !== value) });
    } else {
      setEditedVendor({ ...editedVendor, categories: [...currentCategories, value] });
    }
  };

  const addFeature = (feature) => {
    if (feature && !editedVendor.features.includes(feature)) {
      setEditedVendor({ ...editedVendor, features: [...editedVendor.features, feature] });
    }
  };

  const removeFeature = (feature) => {
    setEditedVendor({ ...editedVendor, features: editedVendor.features.filter(f => f !== feature) });
  };

  const addIntegration = (integration) => {
    if (integration && !editedVendor.integrations.includes(integration)) {
      setEditedVendor({ ...editedVendor, integrations: [...editedVendor.integrations, integration] });
    }
  };

  const removeIntegration = (integration) => {
    setEditedVendor({ ...editedVendor, integrations: editedVendor.integrations.filter(i => i !== integration) });
  };

  const categories = [
    { value: "mortgage_software", label: "Mortgage Software" },
    { value: "asset_finance_tools", label: "Asset Finance Tools" },
    { value: "commercial_finance", label: "Commercial Finance" },
    { value: "crm_systems", label: "CRM Systems" },
    { value: "lead_generation", label: "Lead Generation" },
    { value: "compliance_tools", label: "Compliance Tools" },
    { value: "document_management", label: "Document Management" },
    { value: "loan_origination", label: "Loan Origination" },
    { value: "broker_tools", label: "Broker Tools" },
    { value: "marketing_services", label: "Marketing Services" },
    { value: "va_services", label: "VA Services" },
    { value: "ai_automations", label: "AI Automations" },
    { value: "other", label: "Other" }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Inquiries', icon: Inbox, badge: leads.filter(l => l.status === 'new').length },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'upgrade', label: 'Upgrade Plan', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#132847]" />
      </div>
    );
  }

  if (vendorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#132847]" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-[#132847]">No Vendor Profile Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You don't have a vendor profile yet. Please apply to list your business.
            </p>
            <Link to={createPageUrl('ApplyVendor')}>
              <Button className="w-full bg-[#132847] hover:bg-[#1a3a5f]">
                Apply Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vendor.status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-[#132847] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Application Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your vendor application is currently under review. We'll notify you once it's approved!
            </p>
            <Button variant="outline" onClick={() => navigate(createPageUrl('Home'))}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const avgRating = approvedReviews.length > 0 
    ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
    : 0;

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
                      {vendor.logo_url ? (
                        <img src={vendor.logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <AvatarFallback className="bg-[#132847] text-white text-2xl">
                          {vendor.company_name?.substring(0, 2).toUpperCase()}
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
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                  </label>
                  <h3 className="font-bold text-lg text-[#132847]">{vendor.company_name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge className={
                      vendor.listing_tier === 'featured' ? 'bg-gradient-to-r from-[#ef4e23] to-[#05d8b5]' :
                      vendor.listing_tier === 'premium' ? 'bg-[#132847]' : 'bg-gray-500'
                    }>
                      {vendor.listing_tier}
                    </Badge>
                    <Badge className={
                      vendor.status === 'approved' ? 'bg-green-500' : 'bg-orange-500'
                    }>
                      {vendor.status}
                    </Badge>
                  </div>
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

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t space-y-2">
                  <Link to={createPageUrl(`VendorProfile?id=${vendor.id}`)}>
                    <Button variant="outline" className="w-full" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Public Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#132847]">
                      Welcome back! Here's your performance overview:
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Eye className="w-8 h-8 text-[#132847] mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#132847]">{vendor.view_count || 0}</p>
                        <p className="text-sm text-gray-600">Profile Views</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Mail className="w-8 h-8 text-[#05d8b5] mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#132847]">{leads.length}</p>
                        <p className="text-sm text-gray-600">Total Leads</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#132847]">{avgRating > 0 ? avgRating.toFixed(1) : '-'}</p>
                        <p className="text-sm text-gray-600">Avg Rating</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <MessageSquare className="w-8 h-8 text-[#ef4e23] mx-auto mb-2" />
                        <p className="text-2xl font-bold text-[#132847]">{approvedReviews.length}</p>
                        <p className="text-sm text-gray-600">Reviews</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Leads */}
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

                {/* Quick Actions */}
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
              </div>
            )}

            {activeSection === 'leads' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847] flex items-center gap-2">
                    <Inbox className="w-5 h-5" />
                    Leads & Inquiries ({leads.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leads.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No leads yet</h3>
                      <p className="text-gray-600">When brokers contact you, their inquiries will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map(lead => (
                        <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-[#132847]">{lead.broker_name}</h4>
                                {lead.status === 'new' && (
                                  <Badge className="bg-green-500">New</Badge>
                                )}
                                <Badge variant="outline">{lead.broker_type?.replace(/_/g, ' ')}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{lead.broker_email}</p>
                              {lead.broker_phone && (
                                <p className="text-sm text-gray-600">{lead.broker_phone}</p>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(lead.created_date).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {lead.company_name && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Company:</strong> {lead.company_name}
                            </p>
                          )}
                          
                          {lead.enquiry_about && (
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Enquiry About:</strong> {lead.enquiry_about}
                            </p>
                          )}
                          
                          <div className="bg-gray-50 p-3 rounded-lg mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                            <p className="text-sm text-gray-600">{lead.message}</p>
                          </div>

                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={
                              lead.interest_level === 'high' ? 'bg-red-500' :
                              lead.interest_level === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                            }>
                              {lead.interest_level} interest
                            </Badge>
                            <Badge variant="secondary">{lead.source}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'edit-profile' && editedVendor && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847] flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                          <Input
                            value={editedVendor.company_name}
                            onChange={(e) => setEditedVendor({...editedVendor, company_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                          <Input
                            value={editedVendor.tagline || ''}
                            onChange={(e) => setEditedVendor({...editedVendor, tagline: e.target.value})}
                            placeholder="Short tagline (e.g., 'The best CRM for brokers')"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <Textarea
                            value={editedVendor.description}
                            onChange={(e) => setEditedVendor({...editedVendor, description: e.target.value})}
                            rows={6}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                          <Input
                            value={editedVendor.website || ''}
                            onChange={(e) => setEditedVendor({...editedVendor, website: e.target.value})}
                            placeholder="https://"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <Input
                            value={editedVendor.phone || ''}
                            onChange={(e) => setEditedVendor({...editedVendor, phone: e.target.value})}
                            placeholder="+44 7XXX XXXXXX"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Categories</h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        {categories.map(category => (
                          <div key={category.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.value}
                              checked={editedVendor.categories?.includes(category.value)}
                              onCheckedChange={() => toggleCategory(category.value)}
                              className="data-[state=checked]:bg-green-600"
                            />
                            <label htmlFor={category.value} className="text-sm cursor-pointer">
                              {category.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Features</h3>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {editedVendor.features?.map((feature, idx) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              {feature}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-600"
                                onClick={() => removeFeature(feature)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <Input
                          placeholder="Add feature and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addFeature(e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Integrations */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Integrations</h3>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {editedVendor.integrations?.map((integration, idx) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              {integration}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-red-600"
                                onClick={() => removeIntegration(integration)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <Input
                          placeholder="Add integration and press Enter"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addIntegration(e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Pricing Information</h3>
                      <Textarea
                        value={editedVendor.pricing_info || ''}
                        onChange={(e) => setEditedVendor({...editedVendor, pricing_info: e.target.value})}
                        rows={4}
                        placeholder="Describe your pricing structure..."
                      />
                    </div>

                    <Button
                      onClick={handleSaveProfile}
                      className="w-full bg-[#132847] hover:bg-[#1a3a5f]"
                      disabled={updateVendorMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {updateVendorMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'analytics' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847] flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics & Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Engagement Metrics */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Engagement Metrics</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Profile Views</span>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-3xl font-bold text-[#132847]">{vendor.view_count || 0}</p>
                          <p className="text-xs text-gray-500 mt-1">All time</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Leads Generated</span>
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-3xl font-bold text-[#132847]">{vendor.lead_count || 0}</p>
                          <p className="text-xs text-gray-500 mt-1">Total inquiries</p>
                        </div>
                      </div>
                    </div>

                    {/* Reviews Summary */}
                    <div>
                      <h3 className="font-semibold text-lg text-[#132847] mb-4">Reviews Summary</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Average Rating</span>
                            <Star className="w-4 h-4 text-yellow-500" />
                          </div>
                          <p className="text-3xl font-bold text-[#132847]">
                            {avgRating > 0 ? avgRating.toFixed(1) : '-'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">From {approvedReviews.length} reviews</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Total Reviews</span>
                            <MessageSquare className="w-4 h-4 text-[#05d8b5]" />
                          </div>
                          <p className="text-3xl font-bold text-[#132847]">{vendor.review_count || 0}</p>
                          <p className="text-xs text-gray-500 mt-1">All reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === 'upgrade' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847] flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Upgrade Your Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-gray-600">
                      Upgrade your listing to get more visibility and features
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Free */}
                      <div className={`border-2 rounded-xl p-6 ${vendor.listing_tier === 'free' ? 'border-[#132847] bg-gray-50' : 'border-gray-200'}`}>
                        <h3 className="text-xl font-bold text-[#132847] mb-2">Free</h3>
                        <p className="text-3xl font-bold text-[#132847] mb-4">£0<span className="text-sm text-gray-600">/mo</span></p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Basic listing</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Company profile</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Lead notifications</span>
                          </li>
                        </ul>
                        {vendor.listing_tier === 'free' && (
                          <Badge className="w-full bg-gray-500">Current Plan</Badge>
                        )}
                      </div>

                      {/* Premium */}
                      <div className={`border-2 rounded-xl p-6 ${vendor.listing_tier === 'premium' ? 'border-[#132847] bg-gray-50' : 'border-gray-200'}`}>
                        <h3 className="text-xl font-bold text-[#132847] mb-2">Premium</h3>
                        <p className="text-3xl font-bold text-[#132847] mb-4">£99<span className="text-sm text-gray-600">/mo</span></p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Everything in Free</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Priority placement</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Media gallery</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Analytics dashboard</span>
                          </li>
                        </ul>
                        {vendor.listing_tier === 'premium' ? (
                          <Badge className="w-full bg-gray-500">Current Plan</Badge>
                        ) : (
                          <Button className="w-full bg-[#132847] hover:bg-[#1a3a5f]">
                            Upgrade to Premium
                          </Button>
                        )}
                      </div>

                      {/* Featured */}
                      <div className={`border-2 rounded-xl p-6 ${vendor.listing_tier === 'featured' ? 'border-[#ef4e23] bg-gradient-to-br from-[#ef4e23]/5 to-[#05d8b5]/5' : 'border-[#ef4e23]'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-[#132847]">Featured</h3>
                          <Badge className="bg-gradient-to-r from-[#ef4e23] to-[#05d8b5]">Popular</Badge>
                        </div>
                        <p className="text-3xl font-bold text-[#132847] mb-4">£199<span className="text-sm text-gray-600">/mo</span></p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Everything in Premium</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Featured badge</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Homepage spotlight</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">Priority support</span>
                          </li>
                        </ul>
                        {vendor.listing_tier === 'featured' ? (
                          <Badge className="w-full bg-gradient-to-r from-[#ef4e23] to-[#05d8b5]">Current Plan</Badge>
                        ) : (
                          <Button className="w-full bg-gradient-to-r from-[#ef4e23] to-[#05d8b5] hover:opacity-90">
                            Upgrade to Featured
                          </Button>
                        )}
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
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <Input value={vendor.email} disabled />
                      <p className="text-xs text-gray-500 mt-1">Contact admin to change email</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          vendor.status === 'approved' ? 'bg-green-500' :
                          vendor.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                        }>
                          {vendor.status}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {vendor.status === 'approved' && 'Your listing is live'}
                          {vendor.status === 'pending' && 'Awaiting approval'}
                          {vendor.status === 'rejected' && 'Contact support for assistance'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Listing Tier</label>
                      <Badge className={
                        vendor.listing_tier === 'featured' ? 'bg-gradient-to-r from-[#ef4e23] to-[#05d8b5]' :
                        vendor.listing_tier === 'premium' ? 'bg-[#132847]' : 'bg-gray-500'
                      }>
                        {vendor.listing_tier}
                      </Badge>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-semibold text-gray-900 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Deleting your vendor profile is permanent and cannot be undone.
                      </p>
                      <Button variant="destructive" size="sm">
                        Delete Vendor Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}