
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await req.json();

    const {
      feedback,
      pageUrl,
      softwareSlug,
      softwareName,
      isLoggedIn,
      userId,
      userEmail,
      userName,
    } = body;

    // Basic validation
    if (!feedback) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        feedback,
        page_url: pageUrl,
        software_slug: softwareSlug,
        software_name: softwareName,
        is_logged_in: isLoggedIn,
        user_id: userId || null,
        user_email: userEmail,
        user_name: userName,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting feedback:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Feedback API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
