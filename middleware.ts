import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (static files)
         * 3. /_static (public files)
         * 4. /_vercel (Vercel internals)
         * 5. all root files (e.g. favicon.ico, sitemap.xml, robots.txt)
         */
        '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
    ],
};

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const hostname = req.headers.get('host') || '';

    // Define micro-site hostnames
    const DIRECTORY_HOST = process.env.NEXT_PUBLIC_DIRECTORY_HOST || 'directory.brokertools.com.au';
    const RESOURCES_HOST = process.env.NEXT_PUBLIC_RESOURCES_HOST || 'resources.brokertools.com.au';

    // Handle local development (localhost:3000)
    const isLocal = hostname.includes('localhost');

    // 1. Directory Subdomain
    if (hostname.includes(DIRECTORY_HOST) || (isLocal && hostname.startsWith('directory.'))) {
        // Root of directory goes to search
        if (url.pathname === '/') {
            return NextResponse.rewrite(new URL('/search', req.url));
        }

        // Allowed paths for directory
        const isDirectoryRoute = [
            '/search',
            '/partners',
            '/listings',
            '/compare',
            '/api',
            '/_next',
            '/favicon.ico'
        ].some(p => url.pathname.startsWith(p));

        if (!isDirectoryRoute) {
            // If it's a main site route (like /about) being accessed on directory subdomain, 404 it
            return NextResponse.rewrite(new URL('/404', req.url));
        }
        return NextResponse.next();
    }

    // 2. Resources Subdomain
    if (hostname.includes(RESOURCES_HOST) || (isLocal && hostname.startsWith('resources.'))) {
        // Root of resources goes to blog
        if (url.pathname === '/') {
            return NextResponse.rewrite(new URL('/blog', req.url));
        }

        // Allowed paths for resources
        const isResourcesRoute = [
            '/blog',
            '/api',
            '/_next',
            '/favicon.ico'
        ].some(p => url.pathname.startsWith(p));

        if (!isResourcesRoute) {
            return NextResponse.rewrite(new URL('/404', req.url));
        }
        return NextResponse.next();
    }

    // 3. Main Site (Default)
    // Block paths that should only exist on subdomains
    if (url.pathname.startsWith('/search') && !hostname.includes(DIRECTORY_HOST) && !(isLocal && hostname.startsWith('directory.'))) {
        // Redirect search on main domain to directory subdomain
        return NextResponse.redirect(new URL('https://' + DIRECTORY_HOST + url.pathname + url.search, req.url));
    }

    return NextResponse.next();
}
