import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, X, FileText, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationsManagement() {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const { data: applications = [] } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.VendorApplication.list('-created_date'),
  });

  const approveApplicationMutation = useMutation({
    mutationFn: async (application) => {
      const vendorData = {
        company_name: application.company_name,
        slug: application.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logo_url: application.logo_url || "",
        tagline: "",
        description: application.company_description,
        website: application.website,
        email: application.email,
        phone: application.phone || "",
        categories: application.categories || [],
        broker_types: application.broker_types || [],
        listing_tier: "free",
        status: "approved",
        features: application.product_service_features ? [application.product_service_features] : [],
        pricing_info: application.pricing_details || "",
        integrations: application.integrations ? application.integrations.split(',').map(i => i.trim()) : [],
        special_offer: application.special_offer || "",
      };

      const vendor = await base44.entities.Vendor.create(vendorData);

      await base44.entities.VendorApplication.update(application.id, {
        ...application,
        status: 'approved',
        vendor_id: vendor.id,
        admin_notes: adminNotes
      });

      await base44.integrations.Core.SendEmail({
        to: application.email,
        subject: "Your BrokerTools Directory Application Has Been Approved!",
        body: `Congratulations ${application.contact_name}!\n\nYour application for ${application.company_name} has been approved. Your directory listing is now live on BrokerTools.\n\nYou can manage your listing by logging in at: ${window.location.origin}\n\nBest regards,\nThe BrokerTools Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['directories'] });
      toast.success("Application approved and directory listing created!");
      setSelectedApplication(null);
      setAdminNotes("");
    },
  });

  const rejectApplicationMutation = useMutation({
    mutationFn: async (application) => {
      await base44.entities.VendorApplication.update(application.id, {
        ...application,
        status: 'rejected',
        admin_notes: `${adminNotes}\n\nRejection Reason: ${rejectReason}`
      });

      if (rejectReason) {
        await base44.integrations.Core.SendEmail({
          to: application.email,
          subject: "Update on Your BrokerTools Directory Application",
          body: `Dear ${application.contact_name},\n\nThank you for your interest in BrokerTools. After reviewing your application for ${application.company_name}, we are unable to approve it at this time.\n\n${rejectReason}\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\nThe BrokerTools Team`
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success("Application rejected");
      setSelectedApplication(null);
      setAdminNotes("");
      setRejectReason("");
    },
  });

  const saveNotesMutation = useMutation({
    mutationFn: (application) => 
      base44.entities.VendorApplication.update(application.id, {
        ...application,
        admin_notes: adminNotes
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success("Notes saved");
    },
  });

  const pendingApplications = applications.filter(a => a.status === 'pending');
  const processedApplications = applications.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">
            Pending Applications ({pendingApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending applications</p>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map(app => (
                <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedApplication(app)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-[#132847]">{app.company_name}</h4>
                        <Badge variant="outline" className="bg-orange-50">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                        {app.business_type && (
                          <Badge variant="secondary">{app.business_type}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Contact:</strong> {app.contact_name} ({app.email})
                      </p>
                      {app.categories && app.categories.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Categories:</strong> {app.categories.slice(0, 3).join(', ')}
                          {app.categories.length > 3 && ` +${app.categories.length - 3} more`}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#132847]">
            Processed Applications ({processedApplications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {processedApplications.map(app => (
              <div 
                key={app.id} 
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedApplication(app)}
              >
                <div>
                  <p className="font-semibold text-[#132847]">{app.company_name}</p>
                  <p className="text-sm text-gray-600">{app.contact_name}</p>
                </div>
                <Badge className={app.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}>
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => {
        setSelectedApplication(null);
        setAdminNotes("");
        setRejectReason("");
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details - {selectedApplication?.company_name}</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Business Type */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Business Type</p>
                  <p className="font-semibold">{selectedApplication.business_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={
                    selectedApplication.status === 'approved' ? 'bg-green-500' :
                    selectedApplication.status === 'rejected' ? 'bg-red-500' :
                    'bg-orange-500'
                  }>
                    {selectedApplication.status}
                  </Badge>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="font-semibold text-lg text-[#132847] mb-3">Company Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-medium">{selectedApplication.company_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedApplication.website}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-gray-700">{selectedApplication.company_description}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-lg text-[#132847] mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Contact Name</p>
                    <p className="font-medium">{selectedApplication.contact_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedApplication.email}</p>
                  </div>
                  {selectedApplication.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedApplication.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {selectedApplication.categories && selectedApplication.categories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-3">Service Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.categories.map((cat, idx) => (
                      <Badge key={idx} variant="secondary">{cat.replace(/_/g, ' ')}</Badge>
                    ))}
                  </div>
                  {selectedApplication.category_other && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Other:</strong> {selectedApplication.category_other}
                    </p>
                  )}
                </div>
              )}

              {/* Commercial Finance Subcategories */}
              {selectedApplication.commercial_finance_subcategories && selectedApplication.commercial_finance_subcategories.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-3">Commercial Finance Subcategories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.commercial_finance_subcategories.map((cat, idx) => (
                      <Badge key={idx} variant="outline">{cat.replace(/_/g, ' ')}</Badge>
                    ))}
                  </div>
                  {selectedApplication.commercial_finance_other && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Other:</strong> {selectedApplication.commercial_finance_other}
                    </p>
                  )}
                </div>
              )}

              {/* Broker Types */}
              {selectedApplication.broker_types && selectedApplication.broker_types.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-3">Target Broker Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.broker_types.map((type, idx) => (
                      <Badge key={idx} className="bg-[#05d8b5]">{type.replace(/_/g, ' ')}</Badge>
                    ))}
                  </div>
                  {selectedApplication.broker_type_other && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Other:</strong> {selectedApplication.broker_type_other}
                    </p>
                  )}
                </div>
              )}

              {/* Product/Service Details */}
              {selectedApplication.product_service_features && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-2">Product/Service Features</h3>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.product_service_features}
                  </p>
                </div>
              )}

              {/* Integrations */}
              {selectedApplication.integrations && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-2">Integrations</h3>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.integrations}
                  </p>
                </div>
              )}

              {/* Pricing */}
              {selectedApplication.pricing_structure && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-2">Pricing</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Structure</p>
                    <p className="font-medium mb-2">{selectedApplication.pricing_structure}</p>
                    {selectedApplication.pricing_details && (
                      <>
                        <p className="text-sm text-gray-600">Details</p>
                        <p className="text-gray-700">{selectedApplication.pricing_details}</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Special Offer */}
              {selectedApplication.special_offer && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-2">Special Offer</h3>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.special_offer}
                  </p>
                </div>
              )}

              {/* Why Join */}
              {selectedApplication.why_join && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-2">Why They Want to Join</h3>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                    {selectedApplication.why_join}
                  </p>
                </div>
              )}

              {/* Referral Source */}
              {selectedApplication.referral_source && (
                <div>
                  <h3 className="font-semibold text-lg text-[#132847] mb-2">How They Heard About Us</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{selectedApplication.referral_source.replace(/_/g, ' ')}</p>
                    {selectedApplication.referral_name && (
                      <p className="text-sm text-gray-600 mt-1">
                        Referred by: {selectedApplication.referral_name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <h3 className="font-semibold text-lg text-[#132847] mb-2">Admin Notes</h3>
                <Textarea
                  value={adminNotes || selectedApplication.admin_notes || ""}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this application..."
                  rows={4}
                />
                <Button
                  onClick={() => saveNotesMutation.mutate(selectedApplication)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  disabled={saveNotesMutation.isPending}
                >
                  Save Notes
                </Button>
              </div>

              {/* Actions */}
              {selectedApplication.status === 'pending' && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => approveApplicationMutation.mutate(selectedApplication)}
                      disabled={approveApplicationMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        if (rejectReason) {
                          rejectApplicationMutation.mutate(selectedApplication);
                        } else {
                          toast.error("Please provide a rejection reason");
                        }
                      }}
                      disabled={rejectApplicationMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Rejection Reason (will be sent to applicant):</p>
                    <Textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Provide a reason for declining this application..."
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedApplication(null);
                      setAdminNotes("");
                      setRejectReason("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}