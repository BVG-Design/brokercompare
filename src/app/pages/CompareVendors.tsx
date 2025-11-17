import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, X, Star, ExternalLink, Plus, ArrowRight } from "lucide-react";

export default function CompareVendors() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialIds = urlParams.get('ids')?.split(',').filter(Boolean) || [];
  
  const [selectedVendorIds, setSelectedVendorIds] = useState(initialIds);
  const [availableVendorId, setAvailableVendorId] = useState("");

  const { data: allVendors = [] } = useQuery({
    queryKey: ['all-approved-vendors'],
    queryFn: () => base44.entities.Vendor.filter({ status: 'approved' }),
  });

  const selectedVendors = allVendors.filter(v => selectedVendorIds.includes(v.id));

  useEffect(() => {
    // Update URL when selection changes
    if (selectedVendorIds.length > 0) {
      const newUrl = `${window.location.pathname}?ids=${selectedVendorIds.join(',')}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [selectedVendorIds]);

  const handleAddVendor = () => {
    if (availableVendorId && !selectedVendorIds.includes(availableVendorId)) {
      if (selectedVendorIds.length >= 4) {
        return; // Max 4 vendors
      }
      setSelectedVendorIds([...selectedVendorIds, availableVendorId]);
      setAvailableVendorId("");
    }
  };

  const handleRemoveVendor = (vendorId) => {
    setSelectedVendorIds(selectedVendorIds.filter(id => id !== vendorId));
  };

  const comparisonFeatures = [
    { key: "pricing_info", label: "Pricing" },
    { key: "categories", label: "Categories", isArray: true },
    { key: "broker_types", label: "Target Brokers", isArray: true },
    { key: "features", label: "Key Features", isArray: true },
    { key: "integrations", label: "Integrations", isArray: true },
    { key: "rating", label: "Rating" },
    { key: "review_count", label: "Reviews" },
    { key: "listing_tier", label: "Listing Tier" },
  ];

  const renderValue = (vendor, feature) => {
    const value = vendor[feature.key];
    
    if (!value) return <span className="text-gray-400 text-sm">Not specified</span>;
    
    if (feature.isArray && Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-400 text-sm">None</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((item, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {typeof item === 'string' ? item.replace(/_/g, ' ') : item}
            </Badge>
          ))}
        </div>
      );
    }
    
    if (feature.key === 'rating') {
      return (
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="font-semibold">{value.toFixed(1)}</span>
        </div>
      );
    }
    
    if (feature.key === 'listing_tier') {
      return (
        <Badge className={
          value === 'featured' ? 'bg-gradient-to-r from-[#ef4e23] to-[#05d8b5]' :
          value === 'premium' ? 'bg-[#132847]' : 'bg-gray-500'
        }>
          {value}
        </Badge>
      );
    }
    
    return <p className="text-sm text-gray-700">{value}</p>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compare Vendors
          </h1>
          <p className="text-xl text-gray-300">
            Side-by-side comparison to help you make the right choice
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add Vendor Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#132847]">Select Vendors to Compare (Max 4)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Select value={availableVendorId} onValueChange={setAvailableVendorId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a vendor to add..." />
                </SelectTrigger>
                <SelectContent>
                  {allVendors
                    .filter(v => !selectedVendorIds.includes(v.id))
                    .map(vendor => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.company_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAddVendor}
                disabled={!availableVendorId || selectedVendorIds.length >= 4}
                className="bg-[#132847] hover:bg-[#1a3a5f]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Compare
              </Button>
            </div>
            {selectedVendorIds.length >= 4 && (
              <p className="text-sm text-orange-600 mt-2">Maximum 4 vendors can be compared at once</p>
            )}
          </CardContent>
        </Card>

        {/* No vendors selected */}
        {selectedVendors.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Vendors Selected</h3>
                <p className="text-gray-600 mb-6">
                  Select vendors from the dropdown above to start comparing
                </p>
                <Link to={createPageUrl('BrowseVendors')}>
                  <Button variant="outline">
                    Browse Directory
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Single vendor selected */}
        {selectedVendors.length === 1 && (
          <Card>
            <CardContent className="py-16 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Add more vendors to compare with {selectedVendors[0].company_name}
              </h3>
              <p className="text-gray-600">Select at least one more vendor to see the comparison</p>
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        {selectedVendors.length >= 2 && (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid" style={{ gridTemplateColumns: `250px repeat(${selectedVendors.length}, 1fr)` }}>
                {/* Header Row */}
                <div className="bg-white border-b border-r p-4 font-semibold text-[#132847] sticky left-0 z-10">
                  Feature
                </div>
                {selectedVendors.map((vendor) => (
                  <div key={vendor.id} className="bg-white border-b border-r p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        {vendor.logo_url ? (
                          <img 
                            src={vendor.logo_url} 
                            alt={vendor.company_name}
                            className="w-16 h-16 object-contain mb-3"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-[#132847] to-[#05d8b5] rounded-lg flex items-center justify-center text-white text-xl font-bold mb-3">
                            {vendor.company_name?.[0]}
                          </div>
                        )}
                        <h3 className="font-bold text-[#132847] mb-1">{vendor.company_name}</h3>
                        {vendor.tagline && (
                          <p className="text-sm text-gray-600">{vendor.tagline}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVendor(vendor.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Link to={createPageUrl(`VendorProfile?id=${vendor.id}`)}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      {vendor.website && (
                        <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {/* Comparison Rows */}
                {comparisonFeatures.map((feature, idx) => (
                  <React.Fragment key={feature.key}>
                    <div className="bg-gray-50 border-b border-r p-4 font-semibold text-gray-700 sticky left-0 z-10">
                      {feature.label}
                    </div>
                    {selectedVendors.map((vendor) => (
                      <div key={vendor.id} className={`border-b border-r p-4 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        {renderValue(vendor, feature)}
                      </div>
                    ))}
                  </React.Fragment>
                ))}

                {/* Description Row */}
                <div className="bg-gray-50 border-b border-r p-4 font-semibold text-gray-700 sticky left-0 z-10">
                  Description
                </div>
                {selectedVendors.map((vendor) => (
                  <div key={vendor.id} className="border-b border-r p-4 bg-white">
                    <p className="text-sm text-gray-700 line-clamp-4">
                      {vendor.description || <span className="text-gray-400">No description available</span>}
                    </p>
                  </div>
                ))}

                {/* Action Row */}
                <div className="bg-white border-r p-4 sticky left-0 z-10"></div>
                {selectedVendors.map((vendor) => (
                  <div key={vendor.id} className="border-r p-4 bg-white">
                    <Link to={createPageUrl(`VendorProfile?id=${vendor.id}`)}>
                      <Button className="w-full bg-[#ef4e23] hover:bg-[#d63d15]">
                        View Full Profile
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {selectedVendors.length >= 2 && (
          <Card className="mt-8 bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white border-0">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Still unsure which to choose?</h3>
              <p className="text-gray-300 mb-6">
                Our team can help you make the right decision based on your specific needs
              </p>
              <Button className="bg-[#05d8b5] hover:bg-[#04c5a6] text-[#132847] font-semibold">
                Schedule a Consultation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}