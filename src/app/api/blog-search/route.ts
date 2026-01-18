import { NextResponse } from 'next/server';
import { fetchUnifiedSearchResults } from '@/services/sanity';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';
        const category = searchParams.get('category') || 'all';
        const blogType = searchParams.get('blogType') || 'all';
        const brokerType = searchParams.get('brokerType') || 'all';
        const author = searchParams.get('author') || 'all'; // New param

        const searchTerms = q ? [q] : [];
        // We explicitly want 'blog' content
        const contentTypes = ['blog'];

        const filters = {
            category: category !== 'all' ? category : undefined,
            brokerType: brokerType !== 'all' ? brokerType : undefined,
            type: blogType !== 'all' ? blogType : undefined, // Mapping blogType to 'type' filter
            author: author !== 'all' ? author : undefined
        };

        console.log('[API] blog-search fetching:', { searchTerms, contentTypes, filters });

        const results = await fetchUnifiedSearchResults(searchTerms, contentTypes, filters);

        return NextResponse.json({ success: true, count: results.length, results });
    } catch (error: any) {
        console.error('[API] blog-search error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
