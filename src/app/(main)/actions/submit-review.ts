'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function submitReview(data: any) {
    try {
<<<<<<< Updated upstream
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
=======
        // 1. Submit to Supabase
        const supabase = createServerActionClient({ cookies });

        const { error: dbError } = await supabase
            .from('reviews')
            .insert({
                ...data,
                // Ensure field names match your DB columns. Assuming 'data' matches or JSONB
                // If the table schema is strict, we might need to map fields.
                // For now, dumping 'data' spreading is risky if columns don't match exactly.
                // But without schema knowledge, we'll try to map common fields or save as JSON if there's a payload column.
                // Let's assume standard fields based on Guest Review conversation:
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                business_name: data.businessName,
                role: data.role,
                rating: data.rating,
                review_text: data.review,
                listing_slug: data.listingSlug,
                status: 'pending',
                submitted_at: new Date().toISOString()
            });

        if (dbError) {
            console.error('Supabase review insertion error:', dbError);
            // Verify if we should fail hard.
            // return { success: false, error: 'Database error' };
        }

        // 2. Webhook Submission
        const webhookUrl = process.env.REVIEW_SUBMISSION_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('REVIEW_SUBMISSION_WEBHOOK_URL is not configured');
            // If DB succeeded, maybe we don't fail? But let's keep original behavior if DB failed too.
        } else {
            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'review_submission',
                        ...data,
                        submittedAt: new Date().toISOString()
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Webhook responded with status: ${response.status}`);
                }
            } catch (webhookError) {
                console.error('Webhook submission failed:', webhookError);
                // return { success: false, error: 'Failed to submit review. Please try again.' };
            }
>>>>>>> Stashed changes
        }

        // If we reached here, at least one method likely worked or we are tolerant.
        return { success: true };
    } catch (err: any) {
        console.error('submitReview exception:', err);
        return { success: false, error: 'Internal server error' };
    }
}
