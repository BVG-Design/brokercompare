import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

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
    const { feedback, pageUrl, softwareSlug, softwareName, isLoggedIn, userId, userEmail, userName } = await request.json();

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    // Insert feedback into database
    // Note: You'll need to create a 'feedback' table in Supabase with these columns:
    // - id (uuid, primary key, default: gen_random_uuid())
    // - feedback (text)
    // - page_url (text)
    // - software_slug (text, nullable)
    // - software_name (text, nullable)
    // - is_logged_in (boolean)
    // - user_id (uuid, nullable, references auth.users(id))
    // - user_email (text, nullable)
    // - user_name (text, nullable)
    // - created_at (timestamptz, default: now())
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        feedback: feedback.trim(),
        page_url: pageUrl,
        software_slug: softwareSlug,
        software_name: softwareName,
        is_logged_in: isLoggedIn,
        user_id: userId || null,
        user_email: userEmail || null,
        user_name: userName || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Feedback submission error:', error);
      
      // If table doesn't exist, provide helpful error
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        console.error('Feedback table does not exist. Please create it in Supabase.');
        return NextResponse.json(
          { 
            error: 'Feedback system not fully configured. Please contact support.',
            details: 'The feedback table needs to be created in the database.'
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to submit feedback. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      id: data.id 
    });

  } catch (err: any) {
    console.error('Feedback API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

