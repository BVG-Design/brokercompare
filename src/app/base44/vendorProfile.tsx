import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Award, Star, CheckCircle, Bookmark, ArrowLeftRight, Send, FileText, Video, Calendar, MessageSquare, ThumbsUp, Edit, ChevronRight, ChevronLeft, Download, Play, Save, X, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function VendorProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const vendorId = urlParams.get('id');
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedVendor, setEditedVendor] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showFullPricing, setShowFullPricing] = useState(false);
  const [showAllIntegrations, setShowAllIntegrations] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [currentMediaItem, setCurrentMediaItem] = useState({ url: '', title: '', thumbnail: '' });
  const [currentPdfItem, setCurrentPdfItem] = useState({ url: '', title: '', thumbnail: '' });

  const [leadData, setLeadData] = useState({
    broker_name: "",
    broker_email: "",
    broker_phone: "",
    broker_type: "mortgage_broker",
    company_name: "",
    team_size: "",
    aggregator: "",
    enquiry_about: "",
    message: ""
  });

  const [reviewData, setReviewData] = useState({
    rating: 5,
    review_title: "",
    review_content: ""
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLeadData(prev => ({
        ...prev,
        broker_name: u.full_name || "",
        broker_email: u.email || ""
      }));
    }).catch(() => setUser(null));
  }, []);

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      const vendors = await base44.entities.Vendor.filter({ id: vendorId });
      if (vendors.length === 0) return null;

      const vendor = vendors[0];
      await base44.entities.Vendor.update(vendor.id, {
        ...vendor,
        view_count: (vendor.view_count || 0) + 1
      });

      return { ...vendor, view_count: (vendor.view_count || 0) + 1 };
    },
    enabled: !!vendorId,
  });

  // Fetch ALL approved vendors once - this will be used for all related vendor queries
  const { data: allApprovedVendors = [] } = useQuery({
    queryKey: ['all-approved-vendors'],
    queryFn: () => base44.entities.Vendor.filter({ status: 'approved' }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Initialize editedVendor when vendor loads
  useEffect(() => {
    if (vendor && !editedVendor) {
      setEditedVendor({
        ...vendor,
        categories: vendor.categories || [],
        features: vendor.features || [],
        integrations: vendor.integrations || [],
        demo_videos: vendor.demo_videos || [],
        walkthrough_pdfs: vendor.walkthrough_pdfs || [],
        works_well_with: vendor.works_well_with || [],
        suggested_alternatives: vendor.suggested_alternatives || []
      });
    }
  }, [vendor]);

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', vendorId],
    queryFn: () => base44.entities.Review.filter({ vendor_id: vendorId, status: 'approved' }, '-created_date'),
    enabled: !!vendorId,
  });

  const { data: shortlist } = useQuery({
    queryKey: ['shortlist', user?.email, vendorId],
    queryFn: async () => {
      if (!user?.email) return null;
      const items = await base44.entities.Shortlist.filter({
        user_email: user.email,
        vendor_id: vendorId
      });
      return items.length > 0 ? items[0] : null;
    },
    enabled: !!user && !!vendorId,
  });

  // Optimized related vendors using memoization and single data source
  const similarVendors = useMemo(() => {
    if (!vendor?.categories || vendor.categories.length === 0 || allApprovedVendors.length === 0) return [];
    
    return allApprovedVendors
      .filter(v => v.id !== vendorId && v.categories?.some(cat => vendor.categories.includes(cat)))
      .slice(0, 4);
  }, [vendor, allApprovedVendors, vendorId]);

  const worksWellWithVendors = useMemo(() => {
    if (!vendor?.works_well_with || vendor.works_well_with.length === 0 || allApprovedVendors.length === 0) return [];
    
    return allApprovedVendors.filter(v => vendor.works_well_with.includes(v.id));
  }, [vendor, allApprovedVendors]);

  const alternativeVendors = useMemo(() => {
    if (!vendor?.suggested_alternatives || vendor.suggested_alternatives.length === 0 || allApprovedVendors.length === 0) return [];
    
    return allApprovedVendors.filter(v => vendor.suggested_alternatives.includes(v.id));
  }, [vendor, allApprovedVendors]);

  useEffect(() => {
    setIsShortlisted(!!shortlist);
  }, [shortlist]);

  // Auto-scroll reviews every 5 seconds
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Check if user can edit (admin or vendor owner)
  const canEdit = user && (user.role === 'admin' || vendor?.email === user.email);

  const updateVendorMutation = useMutation({
    mutationFn: (data) => base44.entities.Vendor.update(vendorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', vendorId] });
      queryClient.invalidateQueries({ queryKey: ['all-approved-vendors'] });
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. " + (error.message || "Please try again."));
    }
  });

  const handleSaveChanges = () => {
    if (!editedVendor) {
      toast.error("No vendor data to save.");
      return;
    }
    updateVendorMutation.mutate(editedVendor);
  };

  const handleCancelEdit = () => {
    // Reset editedVendor to the current official vendor data, normalized
    setEditedVendor({
      ...vendor,
      categories: vendor.categories || [],
      features: vendor.features || [],
      integrations: vendor.integrations || [],
      demo_videos: vendor.demo_videos || [],
      walkthrough_pdfs: vendor.walkthrough_pdfs || [],
      works_well_with: vendor.works_well_with || [],
      suggested_alternatives: vendor.suggested_alternatives || []
    });
    setIsEditMode(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setEditedVendor({ ...editedVendor, logo_url: file_url });
      toast.success("Logo uploaded");
    } catch (error) {
      console.error("Failed to upload logo:", error);
      toast.error("Failed to upload logo");
    }
    setUploading(false);
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
    if (feature && editedVendor.features && !editedVendor.features.includes(feature)) {
      setEditedVendor({ ...editedVendor, features: [...editedVendor.features, feature] });
    }
  };

  const removeFeature = (feature) => {
    if (editedVendor.features) {
      setEditedVendor({ ...editedVendor, features: editedVendor.features.filter(f => f !== feature) });
    }
  };

  const addIntegration = (integration) => {
    if (integration && editedVendor.integrations && !editedVendor.integrations.includes(integration)) {
      setEditedVendor({ ...editedVendor, integrations: [...editedVendor.integrations, integration] });
    }
  };

  const removeIntegration = (integration) => {
    if (editedVendor.integrations) {
      setEditedVendor({ ...editedVendor, integrations: editedVendor.integrations.filter(i => i !== integration) });
    }
  };

  const addDemoVideo = () => {
    if (currentMediaItem.url && editedVendor.demo_videos) {
      const newVideo = {
        url: currentMediaItem.url,
        title: currentMediaItem.title || `Demo Video ${editedVendor.demo_videos.length + 1}`,
        thumbnail: currentMediaItem.thumbnail || ''
      };
      setEditedVendor({ ...editedVendor, demo_videos: [...editedVendor.demo_videos, newVideo] });
      setCurrentMediaItem({ url: '', title: '', thumbnail: '' });
    }
  };

  const removeDemoVideo = (index) => {
    if (editedVendor.demo_videos) {
      setEditedVendor({
        ...editedVendor,
        demo_videos: editedVendor.demo_videos.filter((_, idx) => idx !== index)
      });
    }
  };

  const addWalkthroughPdf = () => {
    if (currentPdfItem.url && editedVendor.walkthrough_pdfs) {
      const newPdf = {
        url: currentPdfItem.url,
        title: currentPdfItem.title || `Walkthrough Guide ${editedVendor.walkthrough_pdfs.length + 1}`,
        thumbnail: currentPdfItem.thumbnail || ''
      };
      setEditedVendor({ ...editedVendor, walkthrough_pdfs: [...editedVendor.walkthrough_pdfs, newPdf] });
      setCurrentPdfItem({ url: '', title: '', thumbnail: '' });
    }
  };

  const removeWalkthroughPdf = (index) => {
    if (editedVendor.walkthrough_pdfs) {
      setEditedVendor({
        ...editedVendor,
        walkthrough_pdfs: editedVendor.walkthrough_pdfs.filter((_, idx) => idx !== index)
      });
    }
  };

  const handleMediaUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (type === 'video-thumbnail') {
        setCurrentMediaItem(prev => ({ ...prev, thumbnail: file_url }));
      } else if (type === 'pdf-thumbnail') {
        setCurrentPdfItem(prev => ({ ...prev, thumbnail: file_url }));
      }
      toast.success("File uploaded");
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Failed to upload file");
    }
    setUploading(false);
  };


  const createLeadMutation = useMutation({
    mutationFn: async (data) => {
      const lead = await base44.entities.Lead.create({
        vendor_id: vendor.id,
        vendor_name: vendor.company_name,
        ...data,
        source: 'profile_view'
      });

      await base44.entities.Vendor.update(vendor.id, {
        ...vendor,
        lead_count: (vendor.lead_count || 0) + 1
      });

      await base44.integrations.Core.SendEmail({
        to: vendor.email,
        subject: `New Lead from ${data.broker_name}`,
        body: `You have received a new lead from BrokerTools!\n\nBroker Name: ${data.broker_name}\nEmail: ${data.broker_email}\nPhone: ${data.broker_phone || 'Not provided'}\nCompany: ${data.company_name || 'Not provided'}\nTeam Size: ${data.team_size || 'Not provided'}\nAggregator: ${data.aggregator || 'Not provided'}\nBroker Type: ${data.broker_type}\nEnquiry About: ${data.enquiry_about || 'Not provided'}\n\nMessage:\n${data.message}\n\nPlease respond to this lead promptly.`
      });

      return lead;
    },
    onSuccess: () => {
      toast.success("Your inquiry has been sent!");
      setShowLeadForm(false);
      setLeadData({
        broker_name: user?.full_name || "",
        broker_email: user?.email || "",
        broker_phone: "",
        broker_type: "mortgage_broker",
        company_name: "",
        team_size: "",
        aggregator: "",
        enquiry_about: "",
        message: ""
      });
      queryClient.invalidateQueries({ queryKey: ['vendor', vendorId] });
    },
    onError: (error) => {
      console.error("Failed to send inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    }
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data) => {
      const review = await base44.entities.Review.create({
        vendor_id: vendor.id,
        vendor_name: vendor.company_name,
        reviewer_name: user.full_name || user.email,
        reviewer_email: user.email,
        ...data,
        verified: true,
        verification_method: "BrokerTools login"
      });

      const allApprovedReviews = await base44.entities.Review.filter({ vendor_id: vendor.id, status: 'approved' });
      const sumRatings = allApprovedReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = allApprovedReviews.length > 0 ? sumRatings / allApprovedReviews.length : 0;

      await base44.entities.Vendor.update(vendor.id, {
        ...vendor,
        rating: avgRating,
        review_count: allApprovedReviews.length
      });

      return review;
    },
    onSuccess: () => {
      toast.success("Review submitted! It will be visible after approval.");
      setShowReviewForm(false);
      setReviewData({ rating: 5, review_title: "", review_content: "" });
      queryClient.invalidateQueries({ queryKey: ['reviews', vendorId] });
      queryClient.invalidateQueries({ queryKey: ['vendor', vendorId] });
    },
    onError: (error) => {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review.");
    }
  });

  const toggleShortlistMutation = useMutation({
    mutationFn: async () => {
      if (isShortlisted && shortlist) {
        await base44.entities.Shortlist.delete(shortlist.id);
        return false;
      } else {
        await base44.entities.Shortlist.create({
          user_email: user.email,
          vendor_id: vendor.id,
          vendor_name: vendor.company_name
        });
        return true;
      }
    },
    onSuccess: (added) => {
      setIsShortlisted(added);
      toast.success(added ? "Added to shortlist!" : "Removed from shortlist");
      queryClient.invalidateQueries({ queryKey: ['shortlist'] });
    },
    onError: (error) => {
      console.error("Failed to update shortlist:", error);
      toast.error("Failed to update shortlist.");
    }
  });

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    createLeadMutation.mutate(leadData);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }
    createReviewMutation.mutate(reviewData);
  };

  if (isLoading || !editedVendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#132847]" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor not found</h2>
          <p className="text-gray-600">The vendor you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const displayedIntegrations = showAllIntegrations ? (isEditMode ? editedVendor.integrations : vendor.integrations) : (isEditMode ? editedVendor.integrations?.slice(0, 6) : vendor.integrations?.slice(0, 6));
  const displayedFeatures = showAllFeatures ? (isEditMode ? editedVendor.features : vendor.features) : (isEditMode ? editedVendor.features?.slice(0, 12) : vendor.features?.slice(0, 12));

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Save/Cancel Bar (Fixed at top when editing) */}
      {isEditMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#ef4e23] to-[#05d8b5] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit className="w-5 h-5" />
                <span className="font-semibold">Edit Mode</span>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="bg-white text-[#132847] border-white hover:bg-gray-100"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={updateVendorMutation.isPending}
                  className="bg-[#132847] hover:bg-[#1a3a5f] text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateVendorMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className={`bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-12 ${isEditMode ? 'mt-16' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            {isEditMode ? (
              <div>
                {editedVendor.logo_url ? (
                  <div className="relative group">
                    <img
                      src={editedVendor.logo_url}
                      alt={editedVendor.company_name}
                      className="w-24 h-24 rounded-xl object-contain bg-white p-4 shadow-lg"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 p-1 h-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setEditedVendor({ ...editedVendor, logo_url: "" })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <Upload className="w-8 h-8 text-white/70 mb-1" />
                    <span className="text-xs text-white/70">Upload Logo</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            ) : (
              <>
                {vendor.logo_url ? (
                  <img
                    src={vendor.logo_url}
                    alt={vendor.company_name}
                    className="w-24 h-24 rounded-xl object-contain bg-white p-4 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#05d8b5] to-[#ef4e23] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {vendor.company_name?.[0] || "V"}
                  </div>
                )}
              </>
            )}

            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                {isEditMode ? (
                  <Input
                    value={editedVendor.company_name || ''}
                    onChange={(e) => setEditedVendor({ ...editedVendor, company_name: e.target.value })}
                    className="text-3xl md:text-4xl font-bold bg-white/10 border-white/30 text-white placeholder:text-white/50"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold">{vendor.company_name}</h1>
                )}
                {vendor.listing_tier === 'featured' && (
                  <Badge className="bg-gradient-to-r from-[#ef4e23] to-[#05d8b5] border-0">
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {vendor.listing_tier === 'premium' && (
                  <Badge className="bg-white text-[#132847]">Premium</Badge>
                )}
              </div>

              {isEditMode ? (
                <Input
                  value={editedVendor.tagline || ''}
                  onChange={(e) => setEditedVendor({ ...editedVendor, tagline: e.target.value })}
                  placeholder="Short tagline"
                  className="text-xl bg-white/10 border-white/30 text-white placeholder:text-white/50 mb-4"
                />
              ) : (
                vendor.tagline && <p className="text-xl text-gray-300 mb-4">{vendor.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {vendor.rating && vendor.rating > 0 && (
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= Math.round(vendor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{vendor.rating.toFixed(1)}</span>
                    {vendor.review_count > 0 && (
                      <span className="text-gray-300">({vendor.review_count} reviews)</span>
                    )}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => user ? toggleShortlistMutation.mutate() : toast.error("Please log in to save vendors")}
                  className={`text-white hover:bg-white/10 ${isShortlisted ? 'text-[#ef4e23]' : ''}`}
                  disabled={toggleShortlistMutation.isPending || isEditMode}
                >
                  <Bookmark className={`w-4 h-4 mr-1 ${isShortlisted ? 'fill-[#ef4e23]' : ''}`} />
                  {isShortlisted ? 'Saved' : 'Save to Shortlist'}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  disabled={isEditMode}
                >
                  <ArrowLeftRight className="w-4 h-4 mr-1" />
                  Compare
                </Button>

                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditMode(!isEditMode)}
                    className="text-white hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {isEditMode ? 'Exit Edit Mode' : 'Edit Profile'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About & Pricing Side by Side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847] flex items-center justify-between">
                    <span>About {vendor.company_name}</span>
                    {!isEditMode && vendor.website && (
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="text-[#ef4e23]">
                          Visit Website
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </a>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditMode ? (
                    <Textarea
                      value={editedVendor.description || ''}
                      onChange={(e) => setEditedVendor({ ...editedVendor, description: e.target.value })}
                      rows={8}
                      className="w-full"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{vendor.description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Pricing Section */}
              <Card className="border-[#05d8b5]">
                <CardHeader className="bg-gradient-to-r from-[#05d8b5]/10 to-white">
                  <CardTitle className="text-[#132847]">Pricing</CardTitle>
                  <p className="text-sm text-gray-500">Pricing provided by {vendor.company_name}</p>
                </CardHeader>
                <CardContent>
                  {isEditMode ? (
                    <Textarea
                      value={editedVendor.pricing_info || ''}
                      onChange={(e) => setEditedVendor({ ...editedVendor, pricing_info: e.target.value })}
                      rows={8}
                      placeholder="Add pricing information..."
                      className="w-full"
                    />
                  ) : (
                    <>
                      {vendor.pricing_info ? (
                        <>
                          <div className={`text-gray-700 whitespace-pre-wrap ${!showFullPricing ? 'line-clamp-6' : ''}`}>
                            {vendor.pricing_info}
                          </div>
                          {vendor.pricing_info.length > 200 && (
                            <Button
                              variant="link"
                              className="text-[#ef4e23] p-0 h-auto mt-2"
                              onClick={() => setShowFullPricing(!showFullPricing)}
                            >
                              {showFullPricing ? 'Show Less' : 'View More Pricing Information'}
                              <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showFullPricing ? 'rotate-90' : ''}`} />
                            </Button>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 italic">No pricing information available</p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Categories (Edit Mode) */}
            {isEditMode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847]">Service Categories</CardTitle>
                  <p className="text-sm text-gray-500">Select categories relevant to your services.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-3">
                    {categories.map(category => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={editedVendor.categories?.includes(category.value)}
                          onCheckedChange={() => toggleCategory(category.value)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <label htmlFor={category.value} className="text-sm cursor-pointer">
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Works With Section (Integrations) */}
            {(isEditMode || (vendor.integrations && vendor.integrations.length > 0)) && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[#132847]">
                      {vendor.company_name} Integrations {!isEditMode && `(${vendor.integrations?.length || 0})`}
                    </CardTitle>
                    <div className="w-8 h-8 rounded-lg bg-[#ef4e23]/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-[#ef4e23]" />
                    </div>
                  </div>
                  {!isEditMode && <p className="text-sm text-gray-500">Verified by {vendor.company_name}</p>}
                </CardHeader>
                <CardContent>
                  {isEditMode ? (
                    <>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {editedVendor.integrations.map((integration, idx) => (
                          <Badge key={idx} variant="secondary" className="gap-1 bg-gray-100 text-gray-800">
                            {integration}
                            <X
                              className="w-3 h-3 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
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
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {displayedIntegrations?.map((integration, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-gray-600">{integration.substring(0, 2).toUpperCase()}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{integration}</span>
                          </div>
                        ))}
                      </div>
                      {(vendor.integrations?.length > 6) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAllIntegrations(!showAllIntegrations)}
                        >
                          {showAllIntegrations ? 'Show Less' : `Show More (${vendor.integrations.length - 6} more)`}
                          <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAllIntegrations ? 'rotate-90' : ''}`} />
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Features Section */}
            {(isEditMode || (vendor.features && vendor.features.length > 0)) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#132847]">{vendor.company_name} Features</CardTitle>
                  {isEditMode && <p className="text-sm text-gray-500">List key features of your product/service.</p>}
                </CardHeader>
                <CardContent>
                  {isEditMode ? (
                    <>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {editedVendor.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="gap-1 bg-gray-100 text-gray-800">
                            {feature}
                            <X
                              className="w-3 h-3 cursor-pointer text-gray-500 hover:text-gray-900 transition-colors"
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
                    </>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        {displayedFeatures?.map((feature, idx) => (
                          <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-[#05d8b5] flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(vendor.features?.length > 12) && (
                        <Button
                          variant="link"
                          className="text-[#ef4e23] p-0 h-auto"
                          onClick={() => setShowAllFeatures(!showAllFeatures)}
                        >
                          {showAllFeatures ? 'View Less Features' : 'View More Features'}
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Media Gallery (Premium Only) */}
            {(vendor.listing_tier === 'premium' || vendor.listing_tier === 'featured' || isEditMode) && (
              <>
                {/* Demo Videos */}
                {(isEditMode || (vendor.demo_videos && vendor.demo_videos.length > 0)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#132847]">{vendor.company_name} Media</CardTitle>
                      {isEditMode && <p className="text-sm text-gray-500">Add demo videos with custom titles and thumbnails.</p>}
                    </CardHeader>
                    <CardContent>
                      {isEditMode ? (
                        <>
                          <div className="space-y-4 mb-4">
                            {editedVendor.demo_videos.map((video, idx) => (
                              <div key={idx} className="border rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-2">
                                  {video.thumbnail && (
                                    <img src={video.thumbnail} alt="" className="w-20 h-20 object-cover rounded" />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-sm text-[#132847]">{video.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{video.url}</p>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeDemoVideo(idx)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t pt-4 space-y-3">
                            <h4 className="font-semibold text-sm">Add New Video</h4>
                            <Input
                              placeholder="Video URL (YouTube/Vimeo embed)"
                              value={currentMediaItem.url}
                              onChange={(e) => setCurrentMediaItem({ ...currentMediaItem, url: e.target.value })}
                            />
                            <Input
                              placeholder="Video Title"
                              value={currentMediaItem.title}
                              onChange={(e) => setCurrentMediaItem({ ...currentMediaItem, title: e.target.value })}
                            />
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">Thumbnail (optional)</label>
                              <div className="flex gap-2">
                                {currentMediaItem.thumbnail ? (
                                  <div className="relative">
                                    <img src={currentMediaItem.thumbnail} alt="" className="w-20 h-20 object-cover rounded" />
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="destructive"
                                      className="absolute -top-2 -right-2 p-1 h-auto rounded-full"
                                      onClick={() => setCurrentMediaItem({ ...currentMediaItem, thumbnail: '' })}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                                    <Upload className="w-6 h-6 text-gray-400" />
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => handleMediaUpload(e, 'video-thumbnail')}
                                      disabled={uploading}
                                    />
                                  </label>
                                )}
                                <Input
                                  placeholder="Or paste thumbnail URL"
                                  value={currentMediaItem.thumbnail}
                                  onChange={(e) => setCurrentMediaItem({ ...currentMediaItem, thumbnail: e.target.value })}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <Button
                              onClick={addDemoVideo}
                              disabled={!currentMediaItem.url}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Video
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {vendor.demo_videos?.map((video, idx) => (
                            <div key={idx} className="group relative rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                              {video.thumbnail ? (
                                <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover" />
                              ) : (
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                  <iframe
                                    src={video.url}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={video.title || `Demo ${idx + 1}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play className="w-12 h-12 text-white" />
                              </div>
                              {video.title && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                  <p className="text-white text-sm font-medium">{video.title}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Official Downloads / Walkthroughs */}
                {(isEditMode || (vendor.walkthrough_pdfs && vendor.walkthrough_pdfs.length > 0)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#132847]">Official Downloads {!isEditMode && `(${vendor.walkthrough_pdfs?.length || 0})`}</CardTitle>
                      {isEditMode && <p className="text-sm text-gray-500">Add PDF documents with custom titles and thumbnails.</p>}
                    </CardHeader>
                    <CardContent>
                      {isEditMode ? (
                        <>
                          <div className="space-y-4 mb-4">
                            {editedVendor.walkthrough_pdfs.map((pdf, idx) => (
                              <div key={idx} className="border rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-2">
                                  {pdf.thumbnail ? (
                                    <img src={pdf.thumbnail} alt="" className="w-20 h-20 object-cover rounded" />
                                  ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                                      <FileText className="w-8 h-8 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-sm text-[#132847]">{pdf.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{pdf.url}</p>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeWalkthroughPdf(idx)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t pt-4 space-y-3">
                            <h4 className="font-semibold text-sm">Add New PDF</h4>
                            <Input
                              placeholder="PDF URL"
                              value={currentPdfItem.url}
                              onChange={(e) => setCurrentPdfItem({ ...currentPdfItem, url: e.target.value })}
                            />
                            <Input
                              placeholder="PDF Title"
                              value={currentPdfItem.title}
                              onChange={(e) => setCurrentPdfItem({ ...currentPdfItem, title: e.target.value })}
                            />
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">Thumbnail (optional)</label>
                              <div className="flex gap-2">
                                {currentPdfItem.thumbnail ? (
                                  <div className="relative">
                                    <img src={currentPdfItem.thumbnail} alt="" className="w-20 h-20 object-cover rounded" />
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="destructive"
                                      className="absolute -top-2 -right-2 p-1 h-auto rounded-full"
                                      onClick={() => setCurrentPdfItem({ ...currentPdfItem, thumbnail: '' })}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                                    <Upload className="w-6 h-6 text-gray-400" />
                                    <input
                                      type="file"
                                      className="hidden"
                                      accept="image/*"
                                      onChange={(e) => handleMediaUpload(e, 'pdf-thumbnail')}
                                      disabled={uploading}
                                    />
                                  </label>
                                )}
                                <Input
                                  placeholder="Or paste thumbnail URL"
                                  value={currentPdfItem.thumbnail}
                                  onChange={(e) => setCurrentPdfItem({ ...currentPdfItem, thumbnail: e.target.value })}
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <Button
                              onClick={addWalkthroughPdf}
                              disabled={!currentPdfItem.url}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add PDF
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                          {vendor.walkthrough_pdfs?.map((pdf, idx) => (
                            <a
                              key={idx}
                              href={pdf.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group border rounded-lg p-4 hover:border-[#05d8b5] hover:shadow-md transition-all"
                            >
                              <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                                {pdf.thumbnail ? (
                                  <img src={pdf.thumbnail} alt={pdf.title} className="w-full h-full object-cover" />
                                ) : (
                                  <FileText className="w-12 h-12 text-gray-400" />
                                )}
                              </div>
                              <h4 className="font-semibold text-[#132847] text-sm mb-1 group-hover:text-[#ef4e23]">
                                {pdf.title || `Walkthrough Guide ${idx + 1}`}
                              </h4>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>PDF Document</span>
                                <Download className="w-3 h-3" />
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Reviews Carousel */}
            {!isEditMode && reviews.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-[#132847]">
                    Customer Reviews ({reviews.length})
                  </CardTitle>
                  <p className="text-sm text-gray-500">Authentic and verified reviews</p>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {reviews.length > 0 && (
                      <div className="transition-all duration-500">
                        <div className="bg-white rounded-lg p-6 border">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#132847] text-white flex items-center justify-center font-bold text-lg">
                              {reviews[currentReviewIndex].reviewer_name?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-[#132847]">{reviews[currentReviewIndex].reviewer_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${star <= reviews[currentReviewIndex].rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{reviews[currentReviewIndex].rating}/5</span>
                              </div>
                            </div>
                          </div>
                          <h4 className="font-bold text-lg text-[#132847] mb-2">"{reviews[currentReviewIndex].review_title}"</h4>
                          <p className="text-gray-700 line-clamp-4">{reviews[currentReviewIndex].review_content}</p>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    {reviews.length > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-6">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentReviewIndex(prev => prev === 0 ? reviews.length - 1 : prev - 1)}
                          className="hover:bg-gray-100"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex gap-2">
                          {reviews.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentReviewIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentReviewIndex ? 'bg-[#132847] w-8' : 'bg-gray-300'
                              }`}
                              aria-label={`Go to review ${idx + 1}`}
                            />
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentReviewIndex(prev => (prev + 1) % reviews.length)}
                          className="hover:bg-gray-100"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related Vendors Sections */}
            {!isEditMode && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Works Well With */}
                {worksWellWithVendors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#132847]">Works Well With</CardTitle>
                      <p className="text-sm text-gray-500">Complementary tools & services</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {worksWellWithVendors.map(relatedVendor => (
                          <Link key={relatedVendor.id} to={createPageUrl(`VendorProfile?id=${relatedVendor.id}`)}>
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 hover:border-[#05d8b5] transition-all">
                              {relatedVendor.logo_url ? (
                                <img src={relatedVendor.logo_url} alt={relatedVendor.company_name} className="w-10 h-10 object-contain" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs font-bold">
                                  {relatedVendor.company_name?.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-[#132847] text-sm">{relatedVendor.company_name}</p>
                                {relatedVendor.rating && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{relatedVendor.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Suggested Alternatives */}
                {alternativeVendors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#132847]">Alternative Solutions</CardTitle>
                      <p className="text-sm text-gray-500">Similar options to consider</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {alternativeVendors.map(altVendor => (
                          <Link key={altVendor.id} to={createPageUrl(`VendorProfile?id=${altVendor.id}`)}>
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 hover:border-[#ef4e23] transition-all">
                              {altVendor.logo_url ? (
                                <img src={altVendor.logo_url} alt={altVendor.company_name} className="w-10 h-10 object-contain" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs font-bold">
                                  {altVendor.company_name?.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-[#132847] text-sm">{altVendor.company_name}</p>
                                {altVendor.rating && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{altVendor.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* You Might Also Like (Similar Vendors) */}
                {similarVendors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-[#132847]">You Might Also Like</CardTitle>
                      <p className="text-sm text-gray-500">Based on category match</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {similarVendors.map(similar => (
                          <Link key={similar.id} to={createPageUrl(`VendorProfile?id=${similar.id}`)}>
                            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 hover:border-[#05d8b5] transition-all">
                              {similar.logo_url ? (
                                <img src={similar.logo_url} alt={similar.company_name} className="w-10 h-10 object-contain" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs font-bold">
                                  {similar.company_name?.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-[#132847] text-sm">{similar.company_name}</p>
                                {similar.rating && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{similar.rating.toFixed(1)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Explore More (Related Articles) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#132847]">Explore More</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Link to={createPageUrl('Blog')} className="block text-gray-700 hover:text-[#ef4e23] text-sm">
                        Best-rated software for {vendor.categories?.[0]?.replace(/_/g, ' ')}
                      </Link>
                      <Link to={createPageUrl('Blog')} className="block text-gray-700 hover:text-[#ef4e23] text-sm">
                        Top-rated solutions for brokers
                      </Link>
                      <Link to={createPageUrl('BrowseVendors')} className="block text-gray-700 hover:text-[#ef4e23] text-sm">
                        Compare similar products
                      </Link>
                      <Link to={createPageUrl(`VendorProfile?id=${vendor.id}`)} className="block text-gray-700 hover:text-[#ef4e23] text-sm">
                        Pros and Cons Details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Speak with Expert */}
            {!isEditMode && (
              <Card className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white border-0">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#05d8b5]" />
                  <h3 className="text-2xl font-bold mb-2">Speak with an Expert</h3>
                  <p className="text-gray-300 mb-6">
                    Schedule a call with our team to discuss your specific needs
                  </p>
                  <Button className="bg-[#05d8b5] hover:bg-[#04c5a6] text-[#132847] font-semibold">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule a Chat
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {!isEditMode && (
              <>
                {/* Contact Card */}
                <Card className="border-[#132847] sticky top-6">
                  <CardHeader className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white rounded-t-lg">
                    <CardTitle className="text-lg">Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-[#ef4e23] hover:bg-[#d63d15] text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Connect With Us
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Connect with {vendor.company_name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="broker_name">Your Name *</Label>
                            <Input
                              id="broker_name"
                              value={leadData.broker_name}
                              onChange={(e) => setLeadData({...leadData, broker_name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="broker_email">Email *</Label>
                            <Input
                              id="broker_email"
                              type="email"
                              value={leadData.broker_email}
                              onChange={(e) => setLeadData({...leadData, broker_email: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="broker_phone">Phone</Label>
                            <Input
                              id="broker_phone"
                              value={leadData.broker_phone}
                              onChange={(e) => setLeadData({...leadData, broker_phone: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                              id="company_name"
                              value={leadData.company_name}
                              onChange={(e) => setLeadData({...leadData, company_name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="team_size">Team Size</Label>
                            <Input
                              id="team_size"
                              value={leadData.team_size}
                              onChange={(e) => setLeadData({...leadData, team_size: e.target.value})}
                              placeholder="e.g., 5-10 people"
                            />
                          </div>
                          <div>
                            <Label htmlFor="aggregator">Aggregator/Network</Label>
                            <Input
                              id="aggregator"
                              value={leadData.aggregator}
                              onChange={(e) => setLeadData({...leadData, aggregator: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="broker_type">Broker Type *</Label>
                            <Select value={leadData.broker_type} onValueChange={(value) => setLeadData({...leadData, broker_type: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mortgage_broker">Mortgage Broker</SelectItem>
                                <SelectItem value="asset_finance_broker">Asset Finance Broker</SelectItem>
                                <SelectItem value="commercial_finance_broker">Commercial Finance Broker</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="enquiry_about">Enquiry About</Label>
                            <Input
                              id="enquiry_about"
                              value={leadData.enquiry_about}
                              onChange={(e) => setLeadData({...leadData, enquiry_about: e.target.value})}
                              placeholder="e.g., Pricing, Demo, Integration"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              value={leadData.message}
                              onChange={(e) => setLeadData({...leadData, message: e.target.value})}
                              rows={4}
                              required
                              placeholder="Tell us about your needs..."
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-[#132847] hover:bg-[#1a3a5f]"
                            disabled={createLeadMutation.isPending}
                          >
                            {createLeadMutation.isPending ? "Sending..." : "Send Inquiry"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    {vendor.website && (
                      <a href={vendor.affiliate_link || vendor.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full border-[#132847] text-[#132847] hover:bg-[#132847] hover:text-white">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit Website
                        </Button>
                      </a>
                    )}

                    <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Star className="w-4 h-4 mr-2" />
                          Write a Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Write a Review for {vendor.company_name}</DialogTitle>
                        </DialogHeader>
                        {!user ? (
                          <div className="text-center py-6">
                            <p className="text-gray-600 mb-4">Please log in to write a review</p>
                            <Button onClick={() => base44.auth.redirectToLogin()}>
                              Log In
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                              <Label>Rating *</Label>
                              <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star
                                    key={star}
                                    className={`w-8 h-8 cursor-pointer transition-colors ${
                                      star <= reviewData.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300 hover:text-yellow-400'
                                    }`}
                                    onClick={() => setReviewData({...reviewData, rating: star})}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="review_title">Review Title *</Label>
                              <Input
                                id="review_title"
                                value={reviewData.review_title}
                                onChange={(e) => setReviewData({...reviewData, review_title: e.target.value})}
                                required
                                placeholder="Sum up your experience"
                              />
                            </div>
                            <div>
                              <Label htmlFor="review_content">Your Review *</Label>
                              <Textarea
                                id="review_content"
                                value={reviewData.review_content}
                                onChange={(e) => setReviewData({...reviewData, review_content: e.target.value})}
                                rows={5}
                                required
                                placeholder="Share your experience with this vendor..."
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-[#132847] hover:bg-[#1a3a5f]"
                              disabled={createReviewMutation.isPending}
                            >
                              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                            </Button>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#132847] text-lg">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vendor.categories && vendor.categories.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {vendor.categories.map((cat, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-gray-100">
                              {cat.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {vendor.broker_types && vendor.broker_types.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Best For</h4>
                        <div className="flex flex-wrap gap-2">
                          {vendor.broker_types.map((type, idx) => (
                            <Badge key={idx} variant="outline" className="border-[#05d8b5] text-[#05d8b5]">
                              {type.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}