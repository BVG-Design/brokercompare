export const SITE_URLS = {
    main: process.env.NEXT_PUBLIC_MAIN_URL || 'https://brokertools.com.au',
    directory: process.env.NEXT_PUBLIC_DIRECTORY_URL || 'https://directory.brokertools.com.au',
    resources: process.env.NEXT_PUBLIC_RESOURCES_URL || 'https://resources.brokertools.com.au',
};

export const getSiteUrl = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('directory.')) return SITE_URLS.directory;
        if (hostname.includes('resources.')) return SITE_URLS.resources;
        return SITE_URLS.main;
    }
    return SITE_URLS.main;
};
