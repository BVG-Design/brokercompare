import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email } = await request.json();

        if (!firstName || !email) {
            return NextResponse.json(
                { error: 'First name and email are required' },
                { status: 400 }
            );
        }

        // Log the submission (placeholder for GoHighLevel integration)
        console.log('Subscription received:', { firstName, lastName, email });

        // TODO: Connect to GoHighLevel
        // If using a Webhook URL:
        // const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
        // if (GHL_WEBHOOK_URL) {
        //   await fetch(GHL_WEBHOOK_URL, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ firstName, lastName, email, source: 'Website Subscribe' }),
        //   });
        // }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
