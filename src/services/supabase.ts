import { createClient } from '@/lib/supabase/client';

const supabase = createClient();


export const checkUserExists = async (email: string): Promise<boolean> => {
    // Try to sign in with OTP, but don't create a user.
    // If it succeeds (no error), the user exists.
    // If it fails (error), the user likely does not exist.
    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: false,
        },
    });

    return !error;
};

export const signInWithMagicLink = async (email: string, nextPath?: string) => {
    const isSafePath = nextPath && nextPath.startsWith('/') ? nextPath : null;
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);

    if (isSafePath) {
        callbackUrl.searchParams.set('next', isSafePath);
    }

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: callbackUrl.toString(),
            shouldCreateUser: false,
        },
    });
    return { error: error?.message };
};

interface RegisterUserData {
    email: string;
    firstName: string;
    lastName: string;
    heardFrom: string;
    heardFromOther?: string;
}

export const registerUser = async ({ email, firstName, lastName, heardFrom, heardFromOther }: RegisterUserData) => {
    const generatedPassword = `${crypto.randomUUID()}Aa1!`;

    const { data, error } = await supabase.auth.signUp({
        email,
        password: generatedPassword,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                heard_from: heardFrom,
                heard_from_other: heardFromOther,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    return { data, error: error?.message };
};


interface QuizWaitlistData {
    first_name: string;
    last_name: string;
    email: string;
}

export const joinQuizWaitlist = async (data: QuizWaitlistData) => {
    const { error } = await supabase
        .from('quiz')
        .insert([data]);

    if (error) {
        console.error('Error joining quiz waitlist:', error);
        return { error: error.message };
    }
    return { error: null };
};

export const getReviewsBySlug = async (slug: string) => {
    // 1. Get Directory Listing ID
    const { data: listing, error: listingError } = await supabase
        .from('partner')
        .select('id')
        .eq('slug', slug)
        .single();

    if (listingError || !listing) {
        // PGRST116 is the code for "no rows found" with .single()
        // This is common if a Sanity listing hasn't been synced to Supabase yet
        if (listingError && listingError.code !== 'PGRST116') {
            console.error('Error fetching listing for reviews:', {
                message: listingError.message,
                details: listingError.details,
                hint: listingError.hint,
                code: listingError.code
            });
        }
        return [];
    }

    // 2. Get Reviews
    const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('directory_listing_id', listing.id)
        .eq('is_published', true) // Only show published reviews
        .order('created_at', { ascending: false });

    if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        return [];
    }

    return reviews;
};
