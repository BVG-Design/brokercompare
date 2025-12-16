'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Building2, Sparkles, X, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FormState = {
  business_type: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  company_description: string;
  logo_url: string;
  categories: string[];
  category_other: string;
  commercial_finance_subcategories: string[];
  commercial_finance_other: string;
  broker_types: string[];
  broker_type_other: string;
  product_service_features: string;
  integrations: string;
  pricing_structure: string;
  pricing_details: string;
  special_offer: string;
  why_join: string;
  referral_source: string;
  referral_name: string;
};

const CATEGORY_OPTIONS = [
  { value: 'mortgage_software', label: 'Mortgage Software' },
  { value: 'asset_finance_tools', label: 'Asset Finance Tools' },
  { value: 'commercial_finance', label: 'Commercial Finance' },
  { value: 'crm_systems', label: 'CRM Systems' },
  { value: 'lead_generation', label: 'Lead Generation' },
  { value: 'compliance_tools', label: 'Compliance Tools' },
  { value: 'document_management', label: 'Document Management' },
  { value: 'loan_origination', label: 'Loan Origination' },
  { value: 'broker_tools', label: 'Broker Tools' },
  { value: 'marketing_services', label: 'Marketing Services' },
  { value: 'accounting_software_services', label: 'Accounting Software or Services' },
  { value: 'credit_reporting', label: 'Credit Reporting' },
  { value: 'fraud_checks_id_verification', label: 'Fraud Checks and ID Verification' },
  { value: 'esignatures', label: 'eSignatures' },
  { value: 'legal_services', label: 'Legal Services' },
  { value: 'insurance_products', label: 'Insurance Products' },
  { value: 'training_education', label: 'Training & Education' },
  { value: 'data_analytics', label: 'Data Analytics' },
  { value: 'other', label: 'Other' },
] as const;

const COMMERCIAL_FINANCE_SUBCATEGORIES = [
  { value: 'commercial_mortgage', label: 'Commercial Mortgage' },
  { value: 'bridging_loans', label: 'Bridging Loans' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'invoicing', label: 'Invoicing' },
  { value: 'trade_finance', label: 'Trade Finance' },
  { value: 'other', label: 'Other' },
] as const;

const BROKER_TYPES = [
  { value: 'mortgage_broker', label: 'Mortgage Brokers' },
  { value: 'asset_finance_broker', label: 'Asset Finance Brokers' },
  { value: 'commercial_finance_broker', label: 'Commercial Finance Brokers' },
  { value: 'all_brokers', label: 'All Broker Types' },
  { value: 'other', label: 'Other' },
] as const;

const REFERRAL_SOURCES = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'chatgpt_ai', label: 'ChatGPT/AI Chat' },
  { value: 'google', label: 'Google' },
  { value: 'friend_referral', label: 'Friend/Referral' },
] as const;

const initialForm: FormState = {
  business_type: '',
  company_name: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  company_description: '',
  logo_url: '',
  categories: [],
  category_other: '',
  commercial_finance_subcategories: [],
  commercial_finance_other: '',
  broker_types: [],
  broker_type_other: '',
  product_service_features: '',
  integrations: '',
  pricing_structure: '',
  pricing_details: '',
  special_offer: '',
  why_join: '',
  referral_source: '',
  referral_name: '',
};

export default function ApplyVendor() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormState>(initialForm);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleValue = (field: keyof Pick<FormState, 'categories' | 'commercial_finance_subcategories' | 'broker_types'>, value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const fileUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, logo_url: fileUrl }));
    toast({ description: 'Logo uploaded successfully!' });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.business_type) {
      toast({ title: 'Error', description: 'Please select business type', variant: 'destructive' });
      return;
    }
    if (formData.categories.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one category', variant: 'destructive' });
      return;
    }
    if (formData.broker_types.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one broker type', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    toast({ title: 'Success!', description: 'Your application has been submitted.' });
    router.push('/');
  };

  const showCommercialFinanceSubcategories = formData.categories.includes('commercial_finance');
  const showCategoryOther = formData.categories.includes('other');
  const showBrokerTypeOther = formData.broker_types.includes('other');
  const showCommercialFinanceOther = formData.commercial_finance_subcategories.includes('other');
  const showReferralName = formData.referral_source === 'friend_referral';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-gradient-to-br from-[#132847] to-[#1a3a5f] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#05d8b5] to-[#ef4e23] mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">List Your Business</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join our directory and connect with brokers looking for your solutions
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { title: 'Pre-Qualified Leads', description: 'Get connected with brokers actively looking for your services' },
            { title: 'Increased Visibility', description: 'Showcase your business to a targeted audience of finance professionals' },
            { title: 'Verified Listing', description: 'Build trust with our vetting process and quality badge' },
          ].map((benefit, idx) => (
            <Card key={idx} className="border-[#05d8b5]/20">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#132847] to-[#05d8b5] flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#132847] mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="text-2xl text-[#132847]">Application Form</CardTitle>
            <p className="text-gray-600 mt-2">
              Fill out the form below and we&apos;ll review your application within 2-3 business days
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#132847]">Business Type *</h3>
                <RadioGroup value={formData.business_type} onValueChange={value => setFormData({ ...formData, business_type: value })}>
                  {['software', 'service', 'both'].map(value => (
                    <div className="flex items-center space-x-2" key={value}>
                      <RadioGroupItem value={value} id={value} />
                      <Label htmlFor={value} className="cursor-pointer capitalize">
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#132847]">Company Information</h3>
                <div>
                  <Label>Company Logo</Label>
                  <p className="text-sm text-gray-500 mb-2">Upload a square logo (recommended 400x400px)</p>
                  {formData.logo_url ? (
                    <div className="relative inline-block">
                      <img src={formData.logo_url} alt="Company Logo" className="w-32 h-32 object-contain border rounded-lg bg-white p-2" />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 p-1 h-auto w-auto rounded-full"
                        onClick={() => setFormData({ ...formData, logo_url: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        uploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      {uploading ? (
                        <span className="text-sm text-gray-500">Uploading...</span>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Upload Logo</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                    </label>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website *</Label>
                    <Input id="website" type="url" placeholder="https://" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_description">Company Description *</Label>
                  <Textarea
                    id="company_description"
                    value={formData.company_description}
                    onChange={e => setFormData({ ...formData, company_description: e.target.value })}
                    rows={4}
                    placeholder="Tell us about your company and what you offer..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#132847]">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_name">Contact Name *</Label>
                    <Input id="contact_name" value={formData.contact_name} onChange={e => setFormData({ ...formData, contact_name: e.target.value })} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base">
                    Service Categories * <span className="text-sm font-normal text-gray-500">(Select all that apply)</span>
                  </Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {CATEGORY_OPTIONS.map(category => (
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={formData.categories.includes(category.value)}
                          onCheckedChange={(_checked) => toggleValue('categories', category.value)}
                        />
                        <label htmlFor={category.value} className="text-sm text-gray-700 cursor-pointer">
                          {category.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {showCategoryOther && (
                  <div>
                    <Label htmlFor="category_other">Please specify other category</Label>
                    <Input
                      id="category_other"
                      value={formData.category_other}
                      onChange={e => setFormData({ ...formData, category_other: e.target.value })}
                      placeholder="Enter category details..."
                    />
                  </div>
                )}

                {showCommercialFinanceSubcategories && (
                  <div className="border-l-4 border-[#05d8b5] pl-4">
                    <Label className="text-base">Commercial Finance Subcategories</Label>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      {COMMERCIAL_FINANCE_SUBCATEGORIES.map(subcat => (
                        <div key={subcat.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cf_${subcat.value}`}
                            checked={formData.commercial_finance_subcategories.includes(subcat.value)}
                            onCheckedChange={(_checked) => toggleValue('commercial_finance_subcategories', subcat.value)}
                          />
                          <label htmlFor={`cf_${subcat.value}`} className="text-sm text-gray-700 cursor-pointer">
                            {subcat.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    {showCommercialFinanceOther && (
                      <div className="mt-3">
                        <Label htmlFor="commercial_finance_other">Please specify other subcategory</Label>
                        <Input
                          id="commercial_finance_other"
                          value={formData.commercial_finance_other}
                          onChange={e => setFormData({ ...formData, commercial_finance_other: e.target.value })}
                          placeholder="Enter subcategory details..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base">
                    Target Broker Types * <span className="text-sm font-normal text-gray-500">(Select all that apply)</span>
                  </Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {BROKER_TYPES.map(type => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={formData.broker_types.includes(type.value)}
                          onCheckedChange={(_checked) => toggleValue('broker_types', type.value)}
                        />
                        <label htmlFor={type.value} className="text-sm text-gray-700 cursor-pointer">
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {showBrokerTypeOther && (
                  <div>
                    <Label htmlFor="broker_type_other">Please specify other broker type</Label>
                    <Input
                      id="broker_type_other"
                      value={formData.broker_type_other}
                      onChange={e => setFormData({ ...formData, broker_type_other: e.target.value })}
                      placeholder="Enter broker type details..."
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="product_service_features">Product/Service Features</Label>
                <Textarea
                  id="product_service_features"
                  value={formData.product_service_features}
                  onChange={e => setFormData({ ...formData, product_service_features: e.target.value })}
                  rows={4}
                  placeholder="List the key features of your product or service..."
                />
              </div>

              <div>
                <Label htmlFor="integrations">Do you integrate or work with other software?</Label>
                <Textarea
                  id="integrations"
                  value={formData.integrations}
                  onChange={e => setFormData({ ...formData, integrations: e.target.value })}
                  rows={3}
                  placeholder="List any software or services you integrate with..."
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="pricing_structure">Pricing Structure</Label>
                  <Select value={formData.pricing_structure} onValueChange={value => setFormData({ ...formData, pricing_structure: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pricing structure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subscription">Subscription</SelectItem>
                      <SelectItem value="tiered">Tiered</SelectItem>
                      <SelectItem value="set_fee">Set Fee</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.pricing_structure && (
                  <div>
                    <Label htmlFor="pricing_details">Pricing Details</Label>
                    <Textarea
                      id="pricing_details"
                      value={formData.pricing_details}
                      onChange={e => setFormData({ ...formData, pricing_details: e.target.value })}
                      rows={3}
                      placeholder="Provide details about your pricing..."
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="special_offer">Do you have a special offer?</Label>
                <Textarea
                  id="special_offer"
                  value={formData.special_offer}
                  onChange={e => setFormData({ ...formData, special_offer: e.target.value })}
                  rows={3}
                  placeholder="Describe any special offers or promotions..."
                />
              </div>

              <div>
                <Label htmlFor="why_join">Why do you want to join our directory? *</Label>
                <Textarea
                  id="why_join"
                  value={formData.why_join}
                  onChange={e => setFormData({ ...formData, why_join: e.target.value })}
                  rows={4}
                  placeholder="Tell us why you'd like to be featured in our directory..."
                  required
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="referral_source">How did you hear about us?</Label>
                  <Select value={formData.referral_source} onValueChange={value => setFormData({ ...formData, referral_source: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {REFERRAL_SOURCES.map(source => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {showReferralName && (
                  <div>
                    <Label htmlFor="referral_name">Referral Name</Label>
                    <Input
                      id="referral_name"
                      value={formData.referral_name}
                      onChange={e => setFormData({ ...formData, referral_name: e.target.value })}
                      placeholder="Enter the name of the person who referred you..."
                    />
                    <p className="text-xs text-gray-500 mt-1">We&apos;d love to thank them!</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto bg-[#132847] hover:bg-[#1a3a5f] text-white"
                  disabled={isSubmitting || uploading}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  * All applications are reviewed manually. We&apos;ll get back to you within 2-3 business days.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

  );
}
