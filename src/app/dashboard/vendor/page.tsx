'use client';


import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
// TODO: Replace with Supabase queries when tables are ready
// import { supabase } from '@/lib/supabase';

export const dynamic = "force-dynamic";

function VendorDashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [uploading, setUploading] = useState(false);
  const [editedVendor, setEditedVendor] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // TODO: Replace with Supabase auth when ready
  useEffect(() => {
    // Placeholder: Check authentication
    // const checkAuth = async () => {
    //   const { data: { user } } = await supabase.auth.getUser();
    //   if (!user) {
    //     router.push('/');
    //     return;
    //   }
    //   setUser(user);
    // };
    // checkAuth();
    
    // For now, set a placeholder user
    setUser({ email: 'vendor@example.com' });
  }, [router]);

  // TODO: Replace with Supabase query when tables are ready
  useEffect(() => {
    if (!user) return;
    
    // Placeholder: Fetch vendor data
    // const fetchVendor = async () => {
    //   const { data, error } = await supabase
    //     .from('vendors')
    //     .select('*')
    //     .eq('email', user.email)
    //     .single();
    //   
    //   if (error || !data) {
    //     setVendorLoading(false);
    //     return;
    //   }
    //   
    //   setVendor(data);
    //   setEditedVendor({
    //     ...data,
    //     categories: data.categories || [],
    //     features: data.features || [],
    //     integrations: data.integrations || []
    //   });
    //   setVendorLoading(false);
    // };
    // fetchVendor();
    
    setVendorLoading(false);
  }, [user]);

  const categories = [
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
    { value: 'va_services', label: 'VA Services' },
    { value: 'ai_automations', label: 'AI Automations' },
    { value: 'other', label: 'Other' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads & Inquiries', icon: Inbox, badge: leads.filter(l => l.status === 'new').length },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'upgrade', label: 'Upgrade Plan', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSaveProfile = () => {
    if (!editedVendor) return;
    
    // TODO: Implement Supabase mutation
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Implement file upload to Supabase Storage
      toast({
        title: 'Logo uploaded',
        description: 'Your logo has been uploaded successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload logo. Please try again.',
        variant: 'destructive',
      });
    }
    setUploading(false);
  };

  if (!user) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (vendorLoading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!vendor) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-primary">No Vendor Profile Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  You don't have a vendor profile yet. Please apply to list your business.
                </p>
                <Button asChild className="w-full">
                  <Link href="/apply">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback>{vendor.company_name?.[0] || 'V'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-primary">{vendor.company_name}</h3>
                      <Badge variant={vendor.listing_tier === 'featured' ? 'default' : 'secondary'}>
                        {vendor.listing_tier || 'free'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1">
                    {menuItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                          activeSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive">{item.badge}</Badge>
                        )}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeSection === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {vendor.company_name}</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{vendor.view_count || 0}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Leads</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{leads.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Reviews</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{reviews.length}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Leads */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {leads.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No leads yet</p>
                      ) : (
                        <div className="space-y-4">
                          {leads.slice(0, 5).map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-semibold">{lead.broker_name}</p>
                                <p className="text-sm text-muted-foreground">{lead.broker_email}</p>
                              </div>
                              <Badge>{lead.status}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'leads' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Leads & Inquiries</h1>
                    <p className="text-muted-foreground">Manage your incoming leads</p>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      {leads.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No leads yet</p>
                      ) : (
                        <div className="space-y-4">
                          {leads.map((lead) => (
                            <div key={lead.id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{lead.broker_name}</p>
                                  <p className="text-sm text-muted-foreground">{lead.broker_email}</p>
                                  <p className="text-sm text-muted-foreground">{lead.broker_phone}</p>
                                </div>
                                <Badge>{lead.status}</Badge>
                              </div>
                              {lead.message && (
                                <p className="text-sm text-foreground mt-2">{lead.message}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'edit-profile' && editedVendor && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Edit Profile</h1>
                    <p className="text-muted-foreground">Update your vendor profile information</p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company Logo</label>
                        <div className="flex items-center gap-4">
                          {editedVendor.logo_url && (
                            <img src={editedVendor.logo_url} alt="Logo" className="w-20 h-20 rounded-lg object-contain border" />
                          )}
                          <div>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              disabled={uploading}
                              className="w-full"
                            />
                            {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Company Name</label>
                        <Input
                          value={editedVendor.company_name || ''}
                          onChange={(e) => setEditedVendor({ ...editedVendor, company_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Tagline</label>
                        <Input
                          value={editedVendor.tagline || ''}
                          onChange={(e) => setEditedVendor({ ...editedVendor, tagline: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={editedVendor.description || ''}
                          onChange={(e) => setEditedVendor({ ...editedVendor, description: e.target.value })}
                          rows={5}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Website</label>
                        <Input
                          value={editedVendor.website || ''}
                          onChange={(e) => setEditedVendor({ ...editedVendor, website: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Categories</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {categories.map(cat => (
                            <div key={cat.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={cat.value}
                                checked={editedVendor.categories?.includes(cat.value) || false}
                                onCheckedChange={(checked) => {
                                  const currentCategories = editedVendor.categories || [];
                                  if (checked) {
                                    setEditedVendor({ ...editedVendor, categories: [...currentCategories, cat.value] });
                                  } else {
                                    setEditedVendor({ ...editedVendor, categories: currentCategories.filter(c => c !== cat.value) });
                                  }
                                }}
                              />
                              <label htmlFor={cat.value} className="text-sm cursor-pointer">
                                {cat.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button onClick={handleSaveProfile} className="bg-primary hover:bg-primary/90">
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setActiveSection('dashboard')}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
                    <p className="text-muted-foreground">View your vendor performance metrics</p>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center py-8">Analytics will be available once Supabase tables are set up.</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'upgrade' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Upgrade Plan</h1>
                    <p className="text-muted-foreground">Upgrade your listing to get more visibility</p>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center py-8">Upgrade options will be available soon.</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings</p>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground text-center py-8">Settings will be available once Supabase tables are set up.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function VendorDashboardPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 md:px-6 py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    }>
      <VendorDashboardContent />
    </Suspense>
  );
}

