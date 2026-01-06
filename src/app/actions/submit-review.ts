'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function submitReview(data: any) {
    try {
        const supabase = createServerActionClient({ cookies });

        // Check auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        // We assume the listingId is passed correctly from the client.
        // If we only have slug, we would need to look it up, but let's try to pass the ID if possible
        // or lookup if strictly needed. For now, the modal will pass what it has.

        // If the client passes listingSlug but not ID, we must fetch the ID.
        let directoryListingId = data.directoryListingId;

        if (!directoryListingId && data.listingSlug) {
            // Lookup partner/listing by slug
            // Using 'partner' table as per schema reference "references public.partner(id)"
            const { data: listing, error: lookupError } = await supabase
                .from('partner')
                .select('id')
                .eq('slug', data.listingSlug)
                .single();

            if (lookupError || !listing) {
                console.error('Listing lookup failed:', lookupError);
                return { success: false, error: 'Directory listing not found' };
            }
            directoryListingId = listing.id;
        }

        if (!directoryListingId) {
            return { success: false, error: 'Missing directory listing ID' };
        }

        // Map fields to table 'reviews'
        // Table schema provided:
        // id, user_id, directory_listing_id, seamless_setup, ease_of_use, quality_of_support, 
        // value_for_money, reliability, overall_rating, title, content, pros, cons, 
        // recommended_for, is_published

        const insertData = {
            user_id: session.user.id,
            directory_listing_id: directoryListingId,
            seamless_setup: Number(data.metrics.setup),
            ease_of_use: Number(data.metrics.usability),
            quality_of_support: Number(data.metrics.support),
            value_for_money: Number(data.metrics.value),
            reliability: Number(data.metrics.reliability),
            overall_rating: Number(data.overallRating),
            title: data.title,
            content: data.content,
            pros: data.pros,
            cons: data.cons,
            recommended_for: data.recommendations || [],
            is_published: false // Default
        };

        const { error } = await supabase
            .from('reviews')
            .insert(insertData);

        if (error) {
            console.error('Supabase write error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error('submitReview exception:', err);
        return { success: false, error: 'Internal server error' };
    }
}
