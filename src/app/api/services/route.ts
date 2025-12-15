import { NextResponse } from 'next/server';

export async function GET() {
    // Sanity query disabled for now to fix build error
    return NextResponse.json([]);
}
