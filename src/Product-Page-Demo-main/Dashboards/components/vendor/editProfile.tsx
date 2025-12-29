import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Save } from "lucide-react";
import { toast } from "sonner";

export default function EditProfile({ vendor }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    ...vendor,
    features: vendor.features || [],
    categories: vendor.categories || [],
  });

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
    { value: "other", label: "Other" }
  ];

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, logo_url: file_url });
      toast.success("Logo uploaded");
    } catch (error) {
      toast.error("Failed to upload logo");
    }
    setUploading(false);
  };

  const toggleCategory = (value) => {
    const categories = formData.categories || [];
    if (categories.includes(value)) {
      setFormData({ ...formData, categories: categories.filter(c => c !== value) });
    } else {
      setFormData({ ...formData, categories: [...categories, value] });
    }
  };

  const addFeature = (feature) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData({ ...formData, features: [...formData.features, feature] });
    }
  };

  const removeFeature = (feature) => {
    setFormData({ ...formData, features: formData.features.filter(f => f !== feature) });
  };

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Vendor.update(vendor.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-vendors'] });
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update profile");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#132847]">Edit Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <Label>Company Logo</Label>
            {formData.logo_url ? (
              <div className="relative mt-2 inline-block">
                <img 
                  src={formData.logo_url} 
                  alt="Logo" 
                  className="w-32 h-32 object-contain border rounded-lg bg-white p-2"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2"
                  onClick={() => setFormData({ ...formData, logo_url: "" })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Upload Logo</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Short, catchy description"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Company Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              required
            />
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label>Service Categories *</Label>
            <div className="grid md:grid-cols-3 gap-3 mt-3">
              {categories.map(category => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.value}
                    checked={formData.categories?.includes(category.value)}
                    onCheckedChange={() => toggleCategory(category.value)}
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
            <Label>Key Features</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="gap-1">
                  {feature}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
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

          {/* Pricing */}
          <div>
            <Label htmlFor="pricing_model">Pricing Model</Label>
            <Input
              id="pricing_model"
              value={formData.pricing_model || ''}
              onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value })}
              placeholder="e.g., Monthly subscription, Per-use, Custom pricing"
            />
          </div>

          {/* Video URL */}
          <div>
            <Label htmlFor="video_url">Demo Video URL (YouTube/Vimeo)</Label>
            <Input
              id="video_url"
              value={formData.video_url || ''}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-[#132847] hover:bg-[#1a3a5f]"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}