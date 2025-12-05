import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, CheckCircle, Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function DirectoryManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showRelationshipsDialog, setShowRelationshipsDialog] = useState(false);

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['all-vendors'],
    queryFn: () => base44.entities.Vendor.list('-created_date'),
  });

  const updateVendorMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Vendor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['all-approved-vendors'] });
      toast.success("Vendor updated successfully");
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: (id) => base44.entities.Vendor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['all-approved-vendors'] });
      toast.success("Vendor deleted successfully");
    },
  });

  const handleStatusChange = (vendor, newStatus) => {
    updateVendorMutation.mutate({
      id: vendor.id,
      data: { ...vendor, status: newStatus }
    });
  };

  const handleTierChange = (vendor, newTier) => {
    updateVendorMutation.mutate({
      id: vendor.id,
      data: { ...vendor, listing_tier: newTier }
    });
  };

  const handleDeleteVendor = (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      deleteVendorMutation.mutate(vendorId);
    }
  };

  const handleOpenRelationships = (vendor) => {
    setSelectedVendor({
      ...vendor,
      works_well_with: vendor.works_well_with || [],
      suggested_alternatives: vendor.suggested_alternatives || []
    });
    setShowRelationshipsDialog(true);
  };

  const handleToggleRelationship = (type, vendorId) => {
    const currentList = selectedVendor[type] || [];
    const updated = currentList.includes(vendorId)
      ? currentList.filter(id => id !== vendorId)
      : [...currentList, vendorId];
    
    setSelectedVendor({ ...selectedVendor, [type]: updated });
  };

  const handleSaveRelationships = () => {
    updateVendorMutation.mutate({
      id: selectedVendor.id,
      data: {
        ...selectedVendor,
        works_well_with: selectedVendor.works_well_with,
        suggested_alternatives: selectedVendor.suggested_alternatives
      }
    });
    setShowRelationshipsDialog(false);
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const approvedVendors = vendors.filter(v => v.status === 'approved' && v.id !== selectedVendor?.id);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">
            Directory Listings ({vendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredVendors.map(vendor => (
                <div key={vendor.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {vendor.logo_url && (
                          <img src={vendor.logo_url} alt={vendor.company_name} className="w-10 h-10 object-contain" />
                        )}
                        <div>
                          <h4 className="font-semibold text-[#132847]">{vendor.company_name}</h4>
                          <p className="text-sm text-gray-600">{vendor.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Select 
                          value={vendor.status} 
                          onValueChange={(value) => handleStatusChange(vendor, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select 
                          value={vendor.listing_tier || 'free'} 
                          onValueChange={(value) => handleTierChange(vendor, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                          </SelectContent>
                        </Select>

                        <Badge variant="outline">{vendor.categories?.length || 0} categories</Badge>
                        <Badge variant="outline">{vendor.view_count || 0} views</Badge>
                        <Badge variant="outline">{vendor.lead_count || 0} leads</Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRelationships(vendor)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Relationships
                      </Button>
                      <Link to={createPageUrl(`VendorProfile?id=${vendor.id}`)}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relationships Dialog */}
      <Dialog open={showRelationshipsDialog} onOpenChange={setShowRelationshipsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Vendor Relationships - {selectedVendor?.company_name}</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6">
              {/* Works Well With */}
              <div>
                <h3 className="font-semibold text-lg text-[#132847] mb-3">Works Well With</h3>
                <p className="text-sm text-gray-600 mb-4">Select vendors that complement this one (integrations, partnerships)</p>
                <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {approvedVendors.map(vendor => (
                    <div key={vendor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`works-${vendor.id}`}
                        checked={selectedVendor.works_well_with?.includes(vendor.id)}
                        onCheckedChange={() => handleToggleRelationship('works_well_with', vendor.id)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <label htmlFor={`works-${vendor.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                        {vendor.logo_url && (
                          <img src={vendor.logo_url} alt="" className="w-6 h-6 object-contain" />
                        )}
                        {vendor.company_name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedVendor.works_well_with?.length || 0} vendors
                </p>
              </div>

              {/* Suggested Alternatives */}
              <div>
                <h3 className="font-semibold text-lg text-[#132847] mb-3">Suggested Alternatives</h3>
                <p className="text-sm text-gray-600 mb-4">Select competing or alternative vendors to suggest</p>
                <div className="grid md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                  {approvedVendors.map(vendor => (
                    <div key={vendor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`alt-${vendor.id}`}
                        checked={selectedVendor.suggested_alternatives?.includes(vendor.id)}
                        onCheckedChange={() => handleToggleRelationship('suggested_alternatives', vendor.id)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <label htmlFor={`alt-${vendor.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                        {vendor.logo_url && (
                          <img src={vendor.logo_url} alt="" className="w-6 h-6 object-contain" />
                        )}
                        {vendor.company_name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedVendor.suggested_alternatives?.length || 0} vendors
                </p>
              </div>

              {/* "You Might Also Like" Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-sm text-blue-900 mb-2">About "You Might Also Like"</h4>
                <p className="text-xs text-blue-800">
                  The "You Might Also Like" section is automatically generated based on matching categories. 
                  Vendors with similar categories will be suggested. To control this, update the vendor's categories.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveRelationships}
                  className="flex-1 bg-[#132847] hover:bg-[#1a3a5f]"
                  disabled={updateVendorMutation.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {updateVendorMutation.isPending ? "Saving..." : "Save Relationships"}
                </Button>
                <Button
                  onClick={() => setShowRelationshipsDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}