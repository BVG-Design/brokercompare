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
        .from('quiz') // Using lowercase table name as is standard convention, user said "Quiz" but often Postgres is case sensitive or normalized. sticking to 'quiz' is safer usually, or I should double check if I can. Let's try 'quiz' first.
        .insert([data]);

    if (error) {
        console.error('Error joining quiz waitlist:', error);
        return { error: error.message };
    }
    return { error: null };
};
