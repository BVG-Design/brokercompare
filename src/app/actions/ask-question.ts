'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

export type AskQuestionData = {
    question: string;
    context?: string;
    category?: string;
    sourcePage?: string;
    postAs?: 'public' | 'private';
    userId?: string | null;
    userEmail?: string;
    userName?: string;
    isLoggedIn?: boolean;
};

export async function submitQuestion(data: AskQuestionData) {
    try {
        const supabase = createServerSupabaseClient();

        // Validate required fields
        if (!data.question) {
            return { error: 'Question is required' };
        }

        const { error } = await supabase.from('ask_questions').insert({
            question: data.question,
            context: data.context,
            category: data.category,
            source_page: data.sourcePage,
            post_as: data.postAs || 'public',
            user_id: data.userId || null,
            user_email: data.userEmail,
            user_name: data.userName,
            is_logged_in: data.isLoggedIn || false,
            status: 'pending',
        });

        if (error) {
            console.error('Error submitting question:', error);
            return { error: 'Failed to submit question' };
        }

        return { success: true };
    } catch (error) {
        console.error('Server action error:', error);
        return { error: 'Internal server error' };
    }
}
