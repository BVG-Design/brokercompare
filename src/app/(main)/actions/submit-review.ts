'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function submitReview(data: any) {
    try {
        const webhookUrl = process.env.REVIEW_SUBMISSION_WEBHOOK_URL;

        if (!webhookUrl) {
            console.error('REVIEW_SUBMISSION_WEBHOOK_URL is not configured');
            return { success: false, error: 'Configuration error. Please try again later.' };
        }

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
            return { success: false, error: 'Failed to submit review. Please try again.' };
        }

        return { success: true };
    } catch (err: any) {
        console.error('submitReview exception:', err);
        return { success: false, error: 'Internal server error' };
    }
}
