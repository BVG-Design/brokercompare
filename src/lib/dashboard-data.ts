import type { SupabaseClient } from '@supabase/supabase-js';

// Shared dashboard types. These are intentionally light and match the
// Base44 dashboards: tweak the fields if your Supabase schema differs.
export type UserProfile = {
  id: string;
  email: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  user_type?: 'consumer' | 'vendor' | 'admin' | 'broker';
  vendor_id?: string | null;
  phone?: string | null;
  company?: string | null;
  website?: string | null;
  broker_type?: string | null;
  notification_frequency?: string | null;
  display_name?: string | null;
  profile_image?: string | null;
  admin_dashboard?: boolean | null;
  broker_dashboard?: boolean | null;
  vendor_dashboard?: boolean | null;
  default_dashboard?: 'admin' | 'broker' | 'vendor' | null;
  default_profile?: 'admin' | 'broker' | 'vendor' | null;
};

export type VendorRecord = {
  id: string;
  company_name?: string | null;
  description?: string | null;
  tagline?: string | null;
  logo_url?: string | null;
  website?: string | null;
  status?: string | null;
  listing_tier?: string | null;
  categories?: string[];
  view_count?: number | null;
};

export type LeadRecord = {
  id: string;
  vendor_id?: string | null;
  broker_id?: string | null;
  broker_name?: string | null;
  broker_email?: string | null;
  broker_phone?: string | null;
  message?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type ReviewRecord = {
  id: string;
  vendor_id?: string | null;
  author?: string | null;
  rating?: number | null;
  comment?: string | null;
  status?: string | null;
  moderation_status?: string | null;
  moderationStatus?: string | null;
  is_verified?: boolean | null;
  isVerified?: boolean | null;
  verified?: boolean | null;
  created_at?: string | null;
};

export type ApplicationRecord = {
  id: string;
  company_name?: string | null;
  contact_name?: string | null;
  email?: string | null;
  status?: string | null;
  business_type?: string | null;
  categories?: string[];
  created_at?: string | null;
};

export type ShortlistRecord = {
  id: string;
  user_id?: string | null;
  vendor_id?: string | null;
  vendor_name?: string | null;
  vendor_type?: 'service' | 'software' | string | null;
};

type SafeQuery<T> = Promise<T | null>;

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): SafeQuery<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.warn('getProfile error', error);
    return null;
  }
  return data as UserProfile | null;
}

export async function getVendorForUser(
  supabase: SupabaseClient,
  profile: UserProfile
): SafeQuery<VendorRecord> {
  if (profile.vendor_id) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', profile.vendor_id)
      .maybeSingle();
    if (!error && data) return data as VendorRecord;
  }

  if (profile.email) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('email', profile.email)
      .maybeSingle();
    if (!error && data) return data as VendorRecord;
  }

  return null;
}

export async function getVendorLeads(
  supabase: SupabaseClient,
  vendorId: string
): SafeQuery<LeadRecord[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('getVendorLeads error', error);
    return null;
  }
  return (data as LeadRecord[]) ?? [];
}

export async function getVendorReviews(
  supabase: SupabaseClient,
  vendorId: string
): SafeQuery<ReviewRecord[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('getVendorReviews error', error);
    return null;
  }
  return (data as ReviewRecord[]) ?? [];
}

export async function getAdminStats(supabase: SupabaseClient) {
  const [vendorsResult, applicationsResult, leadsResult, reviewsResult] = await Promise.all([
    supabase.from('vendors').select('id, status'),
    supabase.from('vendor_applications').select('id, status'),
    supabase.from('leads').select('id, status'),
    supabase.from('reviews').select('id, status'),
  ]);

  const count = (rows?: { status?: string | null }[] | null, status?: string) =>
    rows
      ? rows.filter((r) => (status ? r.status === status : true)).length
      : 0;

  return {
    vendorsTotal: count(vendorsResult.data as any[]),
    vendorsApproved: count(vendorsResult.data as any[], 'approved'),
    applicationsTotal: count(applicationsResult.data as any[]),
    applicationsPending: count(applicationsResult.data as any[], 'pending'),
    leadsTotal: count(leadsResult.data as any[]),
    leadsNew: count(leadsResult.data as any[], 'new'),
    reviewsTotal: count(reviewsResult.data as any[]),
    reviewsPending: count(reviewsResult.data as any[], 'pending'),
  };
}

export async function getVendorApplications(
  supabase: SupabaseClient
): SafeQuery<ApplicationRecord[]> {
  const { data, error } = await supabase
    .from('vendor_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('getVendorApplications error', error);
    return null;
  }
  return (data as ApplicationRecord[]) ?? [];
}

export async function getBrokerShortlist(
  supabase: SupabaseClient,
  userId: string
): SafeQuery<ShortlistRecord[]> {
  const { data, error } = await supabase
    .from('shortlists')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.warn('getBrokerShortlist error', error);
    return null;
  }
  return (data as ShortlistRecord[]) ?? [];
}

export async function getBrokerLeads(
  supabase: SupabaseClient,
  userId: string,
  email?: string | null
): SafeQuery<LeadRecord[]> {
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (email) {
    query = query.or(`broker_id.eq.${userId},broker_email.eq.${email}`);
  } else {
    query = query.eq('broker_id', userId);
  }
  
  const { data, error } = await query;
  if (error) {
    console.warn('getBrokerLeads error', error);
    return null;
  }
  return (data as LeadRecord[]) ?? [];
}
