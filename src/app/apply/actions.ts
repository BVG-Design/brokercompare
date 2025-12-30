'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function searchFeatures(query: string) {
    if (!query || query.length < 2) return [];

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('partner_application')
        .select('features')
        .not('features', 'is', null);

    if (error || !data) return [];

    // Flatten and filter
    const allFeatures = data.flatMap(row => row.features || []);
    const uniqueFeatures = Array.from(new Set(allFeatures));

    return uniqueFeatures
        .filter(f => f.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10); // Limit results
}

export async function searchIntegrations(query: string) {
    if (!query || query.length < 2) return [];

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
        .from('partner_application')
        .select('integrations')
        .not('integrations', 'is', null);

    if (error || !data) return [];

    const allIntegrations = data.flatMap(row => row.integrations || []);
    const uniqueIntegrations = Array.from(new Set(allIntegrations));

    return uniqueIntegrations
        .filter(i => i.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);
}
