
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function VendorManagement() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingVendor, setEditingVendor] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: () => base44.entities.Vendor.list('-created_date'),
  });

  const updateVendorMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Vendor.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast.success("Vendor updated");
      setShowEditDialog(false);
      setEditingVendor(null);
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: (id) => base44.entities.Vendor.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast.success("Vendor deleted");
    },
  });

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingVendor) {
      updateVendorMutation.mutate({
        id: editingVendor.id,
        data: editingVendor
      });
    }
  };

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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">Vendor Management</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No vendors found</div>
          ) : (
            <div className="divide-y">
              {filteredVendors.map(vendor => (
                <div key={vendor.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-[#132847]">{vendor.company_name}</h3>
                        <Badge className={
                          vendor.status === 'approved' ? 'bg-green-500' :
                          vendor.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                        }>
                          {vendor.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{vendor.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{vendor.view_count || 0} views</span>
                        <span>{vendor.lead_count || 0} leads</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(vendor)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Link to={createPageUrl(`VendorProfile?id=${vendor.id}`)}>
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            if (window.confirm(`Delete ${vendor.company_name}?`)) {
                              deleteVendorMutation.mutate(vendor.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Select value={vendor.status} onValueChange={(value) => handleStatusChange(vendor, value)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={vendor.listing_tier} onValueChange={(value) => handleTierChange(vendor, value)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="featured">Featured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Vendor Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor: {editingVendor?.company_name}</DialogTitle>
          </DialogHeader>
          {editingVendor && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_company_name">Company Name</Label>
                <Input
                  id="edit_company_name"
                  value={editingVendor.company_name}
                  onChange={(e) => setEditingVendor({ ...editingVendor, company_name: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="edit_tagline">Tagline</Label>
                <Input
                  id="edit_tagline"
                  value={editingVendor.tagline || ''}
                  onChange={(e) => setEditingVendor({ ...editingVendor, tagline: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={editingVendor.description}
                  onChange={(e) => setEditingVendor({ ...editingVendor, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_website">Website</Label>
                  <Input
                    id="edit_website"
                    value={editingVendor.website || ''}
                    onChange={(e) => setEditingVendor({ ...editingVendor, website: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_email">Email</Label>
                  <Input
                    id="edit_email"
                    value={editingVendor.email}
                    onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit_pricing">Pricing Model</Label>
                <Input
                  id="edit_pricing"
                  value={editingVendor.pricing_model || ''}
                  onChange={(e) => setEditingVendor({ ...editingVendor, pricing_model: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  disabled={updateVendorMutation.isPending}
                  className="bg-[#132847] hover:bg-[#1a3a5f]"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
