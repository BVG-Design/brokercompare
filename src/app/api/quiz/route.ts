import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

type QuizPayload = {
  userId: string | null;
  isLoggedIn: boolean;
  needs: {
    selectedProducts: string[];
    selectedServices: string[];
    somethingElse?: string;
  };
  brokerageType?: string;
  aggregator?: string;
  businessStage?: string;
  revenue?: string;
  serviceDetails?: Record<string, unknown>;
  productDetails?: Record<string, unknown>;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    website?: string;
    location?: string;
    notes?: string;
  };
};

export async function POST(request: Request) {
  if (!supabaseServiceKey) {
    return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const payload = (await request.json()) as QuizPayload;

    if (!payload?.contact?.email || !payload.contact.firstName || !payload.contact.lastName) {
      return NextResponse.json(
        { error: 'First name, last name and email are required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('quiz_responses')
      .insert({
        user_id: payload.userId,
        is_logged_in: payload.isLoggedIn,
        contact_first_name: payload.contact.firstName,
        contact_last_name: payload.contact.lastName,
        contact_email: payload.contact.email,
        contact_phone: payload.contact.phone || null,
        contact_website: payload.contact.website || null,
        contact_location: payload.contact.location || null,
        notes: payload.contact.notes || null,
        brokerage_type: payload.brokerageType || null,
        aggregator: payload.aggregator || null,
        business_stage: payload.businessStage || null,
        revenue_band: payload.revenue || null,
        selected_products: payload.needs?.selectedProducts || [],
        selected_services: payload.needs?.selectedServices || [],
        something_else: payload.needs?.somethingElse || null,
        service_details: payload.serviceDetails || null,
        product_details: payload.productDetails || null,
      })
      .select('id')
      .single();

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Quiz response table is missing in Supabase.' },
          { status: 500 },
        );
      }
      return NextResponse.json({ error: 'Failed to save quiz' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
