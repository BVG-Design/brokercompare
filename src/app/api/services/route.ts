import { NextResponse } from 'next/server';
import { sanity } from '../../../../lib/sanity';
import { SERVICES_QUERY } from '@/sanity/queries';

export async function GET() {
    try {
        const services = await sanity.fetch(SERVICES_QUERY);
        return NextResponse.json(services);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}
