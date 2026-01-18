'use server';

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
        // Webhook Submission
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
                // We typically continue to return success or error to client depending on if this is critical
                // For this request, since Supabase is "disconnected", this is the primary method.
                return { error: 'Failed to submit question' };
            }
        } else {
            console.warn('QUESTION_SUBMISSION_WEBHOOK_URL is not configured.');
            return { error: 'Configuration error' };
        }

        return { success: true };
    } catch (error) {
        console.error('Server action error:', error);
        return { error: 'Internal server error' };
    }
}
