'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export type AskQuestionPayload = {
    firstName: string;
    lastName: string;
    email: string;
    Question: string;
    category: string;
    listingslug?: string;
    listingname?: string;
};

export async function submitQuestion(data: AskQuestionPayload) {
    try {
        // 1. Submit to Supabase
        const supabase = createServerActionClient({ cookies });

        const { error: dbError } = await supabase
            .from('questions')
            .insert({
                first_name: data.firstName,
                last_name: data.lastName,
                email: data.email,
                question: data.Question,
                category: data.category,
                listing_slug: data.listingslug,
                listing_name: data.listingname,
                status: 'new', // Default status
                submitted_at: new Date().toISOString()
            });

        if (dbError) {
            console.error('Supabase insertion error:', dbError);
            // We'll continue to try the webhook even if DB fails, or failing here?
            // Let's treat DB as primary but non-blocking for webhook if we want redundancy, 
            // OR fully fail if DB fails. Given the request is "integrate into Supabase", let's return error if it fails.
            return { error: 'Failed to save question to database' };
        }

        // 2. Webhook Submission (Legacy/Notification)
        const webhookUrl = process.env.QUESTION_SUBMISSION_WEBHOOK_URL;

        if (webhookUrl) {
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
            } catch (webhookError) {
                console.error('Webhook submission failed:', webhookError);
                // Non-blocking for now since we saved to DB
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Server action error:', error);
        return { error: 'Internal server error' };
    }
}
