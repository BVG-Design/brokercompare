import { NextResponse } from 'next/server';
import { fetchCategories } from '@/services/sanity';

export async function GET() {
    try {
        const categories = await fetchCategories();
        return NextResponse.json(categories || []);
    } catch (error: any) {
        console.error('[API] categories error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
