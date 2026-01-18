import { NextResponse } from 'next/server';
import { fetchUnifiedSearchResults } from '@/services/sanity';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';
        const category = searchParams.get('category') || 'all';
        const type = searchParams.get('type') || 'all';
        const brokerType = searchParams.get('brokerType') || 'all';

        const searchTerms = q ? [q] : [];
        // We explicitly want 'directoryListing' for the demo
        const contentTypes = ['directoryListing'];

        const filters = {
            category: category !== 'all' ? category : undefined,
            brokerType: brokerType !== 'all' ? brokerType : undefined,
            type: type !== 'all' ? type : undefined,
        };

        console.log('[API] unified-search fetching:', { searchTerms, contentTypes, filters });

        const results = await fetchUnifiedSearchResults(searchTerms, contentTypes, filters);

        return NextResponse.json({ success: true, count: results.length, results });
    } catch (error: any) {
        console.error('[API] unified-search error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}