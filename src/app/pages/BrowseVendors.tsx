import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, ExternalLink, Star, TrendingUp, MessageSquare, Sparkles } from "lucide-react";
import VendorCard from "../components/vendors/VendorCard";
import AIChatDialog from "../components/vendors/AIChatDialog";

export default function BrowseVendors() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || "all";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [brokerTypeFilter, setBrokerTypeFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [showAIChat, setShowAIChat] = useState(false);

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => base44.entities.Vendor.filter({ status: 'approved' }),
    initialData: [],
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "crm_systems", label: "CRM Systems" },
    { value: "document_management", label: "Document Collection" },
    { value: "va_services", label: "VA Services" },
    { value: "marketing_services", label: "Marketing & Sales" },
    { value: "mortgage_software", label: "Mortgage Software" },
    { value: "asset_finance_tools", label: "Asset Finance Tools" },
    { value: "commercial_finance", label: "Commercial Finance" },
    { value: "lead_generation", label: "Lead Generation" },
    { value: "compliance_tools", label: "Compliance Tools" },
    { value: "loan_origination", label: "Loan Origination" },
    { value: "broker_tools", label: "Broker Tools" },
  ];

  const brokerTypes = [
    { value: "all", label: "All Broker Types" },
    { value: "mortgage_broker", label: "Mortgage Brokers" },
    { value: "asset_finance_broker", label: "Asset Finance Brokers" },
    { value: "commercial_finance_broker", label: "Commercial Finance Brokers" },
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.tagline?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
                           vendor.categories?.includes(categoryFilter);
    
    const matchesBrokerType = brokerTypeFilter === "all" || 
                              vendor.broker_types?.includes(brokerTypeFilter) ||
                              vendor.broker_types?.includes("all_brokers");
    
    const matchesTier = tierFilter === "all" || vendor.listing_tier === tierFilter;

    return matchesSearch && matchesCategory && matchesBrokerType && matchesTier;
  });

  // Sort: featured first, then premium, then by view count
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    const tierWeight = { featured: 3, premium: 2, free: 1 };
    const aTier = tierWeight[a.listing_tier] || 0;
    const bTier = tierWeight[b.listing_tier] || 0;
    
    if (aTier !== bTier) return bTier - aTier;
    return (b.view_count || 0) - (a.view_count || 0);
  });

  const handleSearch = () => {
    // Search is handled by the searchTerm state
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Search the Directory
            </h1>
            <p className="text-xl text-gray-300">
              Find the perfect solution for your brokerage
            </p>
          </div>

          {/* Search Bar - matching home page style */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for vendors, products, or services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 pr-4 h-14 text-lg border-0 focus-visible:ring-0 text-gray-900"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  size="lg" 
                  className="bg-[#ef4e23] hover:bg-[#d63d15] text-white px-8 h-14"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* AI Chat Button */}
            <div className="mt-4 text-center">
              <Button
                onClick={() => setShowAIChat(true)}
                variant="ghost"
                className="text-white hover:text-[#05d8b5] hover:bg-white/10"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Or ask AI for personalized recommendations
                <span className="ml-2">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#132847]" />
            <h3 className="font-semibold text-[#132847]">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Broker Type</label>
              <Select value={brokerTypeFilter} onValueChange={setBrokerTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brokerTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Listing Type</label>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="featured">Featured Only</SelectItem>
                  <SelectItem value="premium">Premium Only</SelectItem>
                  <SelectItem value="free">Free Listings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(categoryFilter !== "all" || brokerTypeFilter !== "all" || tierFilter !== "all") && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter("all");
                  setBrokerTypeFilter("all");
                  setTierFilter("all");
                }}
                className="text-[#ef4e23] hover:text-[#d63d15]"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-[#132847]">{sortedVendors.length}</span> vendors found
          </p>
        </div>

        {/* Vendors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4" />
                <div className="h-6 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-4" />
                <div className="h-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : sortedVendors.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setBrokerTypeFilter("all");
                setTierFilter("all");
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVendors.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>

      {/* AI Chat Dialog */}
      <AIChatDialog open={showAIChat} onOpenChange={setShowAIChat} />
    </div>
  );
}