import { NextResponse } from 'next/server';
import { fetchUnifiedSearchResults } from '@/services/sanity';

export async function GET() {
    try {
        const results = await fetchUnifiedSearchResults([], ['directoryListing', 'blog'], { category: 'all', type: 'all', brokerType: 'all' });
        return NextResponse.json({ success: true, count: results.length, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
