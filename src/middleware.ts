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

    // Define your micro-site hostnames
    const MAIN_HOST = process.env.NEXT_PUBLIC_MAIN_HOST || 'brokertools.com.au';
    const DIRECTORY_HOST = process.env.NEXT_PUBLIC_DIRECTORY_HOST || 'directory.brokertools.com.au';
    const RESOURCES_HOST = process.env.NEXT_PUBLIC_RESOURCES_HOST || 'resources.brokertools.com.au';

    // Handle local development (localhost:3000)
    // You can test subdomains locally by editing your /etc/hosts file or using tools like lvh.me
    const isLocal = hostname.includes('localhost');

    let targetFolder = '(main)';

    if (hostname.includes(DIRECTORY_HOST) || (isLocal && hostname.startsWith('directory.'))) {
        targetFolder = '(directory)';
    } else if (hostname.includes(RESOURCES_HOST) || (isLocal && hostname.startsWith('resources.'))) {
        targetFolder = '(resources)';
    } else if (hostname.includes(MAIN_HOST) || isLocal) {
        targetFolder = '(main)';
    }

    // Rewrite to the appropriate route group
    // Route groups are identified by folder name in parentheses, but they don't appear in the URL
    // So we rewrite to /(targetFolder)/path
    const newUrl = new URL(`/${targetFolder}${url.pathname}${url.search}`, req.url);

    return NextResponse.rewrite(newUrl);
}
