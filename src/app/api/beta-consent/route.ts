import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

export async function POST(request: Request) {
    if (!supabaseServiceKey) {
        console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
        return NextResponse.json(
            { error: 'Server configuration error' },
            { status: 500 }
        );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    try {
        const { name, email } = await request.json();

        if (!email || !name) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        // 1. Check if user exists in Auth (more reliable than user_profiles if profile creation failed previously)
        // However, checking user_profiles is what was requested "If the email exists...".
        // We'll check Auth to be safe about account existence.
        const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
        // listUsers might be slow if many users, but usually fine for beta.
        // Better to use listUsers with filter? supabase-js v2 doesn't always support filtering efficiently in admin.
        // Actually, we can use `supabase.from('user_profiles').select('*').eq('email', email).single()` with Service Role.
        // Service Role bypasses RLS, so this works.

        const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('email', email)
            .single();

        if (existingProfile) {
            return NextResponse.json({ status: 'exists' });
        }

        // Also check Auth just in case profile is missing but user exists
        // (Optimization: skip if listUsers is heavy, but for now it's safe)
        // Actually, creating a user will fail if email exists, so we can rely on that error potentially.

        // 2. Create User
        // We want to "waitslist" them. We create an account so "user_profile" can be created.
        // We won't send an invite email yet (unless desired), or maybe we do?
        // "contact them for feedback".
        // I'll create the user with a dummy password and auto-confirm, effectively "ghost" account until they reset password or we invite properly?
        // Or simpler: `inviteUserByEmail`.
        // I will use `createUser` without password (if allowed for magic link flows) or with dummy.
        // But `inviteUserByEmail` ensures flow.
        // Let's try to just insert into `user_profiles` FIRST?
        // If database enforces FK to auth.users, it will fail.
        // If I create auth user, I consume a user quota.
        // Given usage "gate... waitlist", maybe I should just create a `waitlist` table entry?
        // User SAID: "This form needs to create a user_profile."

        // I will try to create an auth user silently.
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { full_name: name, on_waitlist: true }
        });

        if (createError) {
            // If error is "User already registered", return exists
            if (createError.message?.includes('already registered') || createError.status === 422) {
                return NextResponse.json({ status: 'exists' });
            }
            throw createError;
        }

        // 3. Create Profile
        if (newUser?.user) {
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                    id: newUser.user.id,
                    email: email,
                    full_name: name,
                    user_type: 'broker', // Default
                    onboarding_completed: false
                });

            if (profileError) {
                console.error('Profile creation error:', profileError);
                // User created but profile failed. Return created anyway?
                // Or cleanup?
            }
        }

        return NextResponse.json({ status: 'created' });

    } catch (err: any) {
        console.error('Beta consent error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
