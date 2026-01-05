import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Upload, Link2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categories = [
  { value: "people", label: "People" },
  { value: "software", label: "Software" },
  { value: "process", label: "Process & Automations" },
  { value: "services", label: "Services" }
];

const stages = [
  { value: "pre_start", label: "Pre-Start" },
  { value: "client_acquisition", label: "Client Acquisition" },
  { value: "application", label: "Application" },
  { value: "settlement", label: "Settlement" },
  { value: "post_settlement", label: "Post-Settlement" },
  { value: "ongoing", label: "Ongoing" }
];

const types = [
  { value: "aggregator", label: "Aggregator" },
  { value: "insurance", label: "Insurance" },
  { value: "website", label: "Website" },
  { value: "accounting", label: "Accounting" },
  { value: "crm", label: "CRM" },
  { value: "lodgement", label: "Lodgement" },
  { value: "compliance", label: "Compliance" },
  { value: "marketing", label: "Marketing" },
  { value: "communication", label: "Communication" },
  { value: "document_management", label: "Document Management" },
  { value: "other", label: "Other" }
];

export default function AddToolModal({ isOpen, onClose, onAdd, preselectedCategory, preselectedStage }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: preselectedCategory || "",
    stage: preselectedStage || "",
    type: "",
    logo_url: "",
    website_url: "",
    pricing: "",
    rating: "",
    features: "",
    pros: "",
    cons: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const toolData = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      features: formData.features ? formData.features.split('\n').filter(Boolean) : [],
      pros: formData.pros ? formData.pros.split('\n').filter(Boolean) : [],
      cons: formData.cons ? formData.cons.split('\n').filter(Boolean) : [],
      order: 0
    };
    
    await onAdd(toolData);
    setIsSubmitting(false);
    setFormData({
      name: "",
      description: "",
      category: "",
      stage: "",
      type: "",
      logo_url: "",
      website_url: "",
      pricing: "",
      rating: "",
      features: "",
      pros: "",
      cons: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Tool</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Connective, Xero, Mailchimp"
                required
              />
            </div>
            
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({...formData, category: v})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Stage *</Label>
              <Select
                value={formData.stage}
                onValueChange={(v) => setFormData({...formData, stage: v})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({...formData, type: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                placeholder="4.5"
              />
            </div>
          </div>
          
          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Brief description of what this tool does..."
              rows={2}
            />
          </div>
          
          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Logo URL</Label>
              <Input
                value={formData.logo_url}
                onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input
                value={formData.website_url}
                onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>
          
          {/* Pricing */}
          <div>
            <Label>Pricing</Label>
            <Input
              value={formData.pricing}
              onChange={(e) => setFormData({...formData, pricing: e.target.value})}
              placeholder="e.g., From $29/month, Free tier available"
            />
          </div>
          
          {/* Features, Pros, Cons */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={4}
              />
            </div>
            <div>
              <Label>Pros (one per line)</Label>
              <Textarea
                value={formData.pros}
                onChange={(e) => setFormData({...formData, pros: e.target.value})}
                placeholder="Pro 1&#10;Pro 2"
                rows={4}
              />
            </div>
            <div>
              <Label>Cons (one per line)</Label>
              <Textarea
                value={formData.cons}
                onChange={(e) => setFormData({...formData, cons: e.target.value})}
                placeholder="Con 1&#10;Con 2"
                rows={4}
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Tool"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}