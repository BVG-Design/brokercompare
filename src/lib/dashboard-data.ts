import type { SupabaseClient } from '@supabase/supabase-js';

// Shared dashboard types. These are intentionally light and match the
// Base44 dashboards: tweak the fields if your Supabase schema differs.
export type UserProfile = {
  id: string;
  email: string | null;
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  user_type?: 'consumer' | 'partner' | 'admin' | 'broker';
  partner_id?: string | null;
  phone?: string | null;
  company?: string | null;
  website?: string | null;
  broker_type?: string | null;
  notification_frequency?: string | null;
  display_name?: string | null;
  profile_image?: string | null;
  admin_dashboard?: boolean | null;
  broker_dashboard?: boolean | null;
  partner_dashboard?: boolean | null;
  default_dashboard?: 'admin' | 'broker' | 'partner' | null;
  default_profile?: 'admin' | 'broker' | 'partner' | null;
  // Broker specific fields
  broker_services?: string[];
  broker_service_other?: string | null;
  commercial_finance_areas?: string[];
  commercial_finance_other?: string | null;
  aggregator?: string | null;
  aggregator_other?: string | null;
  team_size?: string | null;
  team_location?: string | null;
  top_priorities?: string[];
  lead_capture_crm?: string | null;
  fact_find_software?: string | null;
  email_system?: string | null;
  phone_system?: string | null;
  has_it_support?: boolean | null;
  has_accountant?: boolean | null;
  has_marketing_agency?: boolean | null;
  has_mindset_coach?: boolean | null;
  has_lawyer?: boolean | null;
  has_insurance_broker?: boolean | null;
  has_ai_specialist?: boolean | null;
  considering_change?: boolean | null;
  change_details?: string | null;
};

export type PartnerRecord = {
  id: string;
  company_name?: string | null;
  description?: string | null;
  tagline?: string | null;
  logo_url?: string | null;
  website?: string | null;
  status?: string | null;
  listing_tier?: string | null;
  categories?: string[];
  features?: string[];
  integrations?: string[];
  teamSize?: string[];
  revenue?: string[];
  budgetAmount?: string | null;
  budgetPeriod?: string | null;
  lookingTo?: string[];
  lookingToOther?: string | null;
  notFitFor?: string | null;
  materials?: any[];
  pricing?: string | null;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  newFeature?: string | null;
  newIntegration?: string | null;
  newMaterial?: any;
  isTrainingPublic?: boolean | null;
  view_count?: number | null;
};

export type LeadRecord = {
  id: string;
  partner_id?: string | null;
  partner_name?: string | null;
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
  partner_id?: string | null;
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
  partner_id?: string | null;
  partner_name?: string | null;
  partner_type?: 'service' | 'software' | string | null;
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

export async function getPartnerForUser(
  supabase: SupabaseClient,
  profile: UserProfile
): SafeQuery<PartnerRecord> {
  if (profile.partner_id) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', profile.partner_id)
      .maybeSingle();
    if (!error && data) return data as PartnerRecord;
  }

  if (profile.email) {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('email', profile.email)
      .maybeSingle();
    if (!error && data) return data as PartnerRecord;
  }

  return null;
}

export async function getPartnerLeads(
  supabase: SupabaseClient,
  partnerId: string
): SafeQuery<LeadRecord[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('getPartnerLeads error', error);
    return null;
  }
  return (data as LeadRecord[]) ?? [];
}

export async function getPartnerReviews(
  supabase: SupabaseClient,
  partnerId: string
): SafeQuery<ReviewRecord[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('partner_id', partnerId)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('getPartnerReviews error', error);
    return null;
  }
  return (data as ReviewRecord[]) ?? [];
}

export async function getAdminStats(supabase: SupabaseClient) {
  const [partnersResult, applicationsResult, leadsResult, reviewsResult] = await Promise.all([
    supabase.from('partners').select('id, status'),
    supabase.from('partner_application').select('id, status'),
    supabase.from('leads').select('id, status'),
    supabase.from('reviews').select('id, status'),
  ]);

  const count = (rows?: { status?: string | null }[] | null, status?: string) =>
    rows
      ? rows.filter((r) => (status ? r.status === status : true)).length
      : 0;

  return {
    partnersTotal: count(partnersResult.data as any[]),
    partnersApproved: count(partnersResult.data as any[], 'approved'),
    applicationsTotal: count(applicationsResult.data as any[]),
    applicationsPending: count(applicationsResult.data as any[], 'pending'),
    leadsTotal: count(leadsResult.data as any[]),
    leadsNew: count(leadsResult.data as any[], 'new'),
    reviewsTotal: count(reviewsResult.data as any[]),
    reviewsPending: count(reviewsResult.data as any[], 'pending'),
  };
}

export async function getPartnerApplications(
  supabase: SupabaseClient
): SafeQuery<ApplicationRecord[]> {
  const { data, error } = await supabase
    .from('partner_application')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('getPartnerApplications error', error);
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
