import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel if not already initialized
// Note: You should ensure NEXT_PUBLIC_MIXPANEL_TOKEN is set in your environment variables
const initMixpanel = () => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
            debug: process.env.NODE_ENV === 'development',
            ignore_dnt: true,
        });
    }
};

// Safe track function that ensures init
export const trackEvent = (eventName: string, props: Record<string, any> = {}) => {
    if (typeof window === 'undefined') return;

    // Check if mixpanel is loaded/inited, if not try to init
    if (!(mixpanel as any).__loaded) { // Simple check, or just call init
        initMixpanel();
    }

    try {
        mixpanel.track(eventName, props);
    } catch (error) {
        console.error('Mixpanel track error:', error);
    }
};

export const trackOutboundListingClick = (
    e: React.MouseEvent | React.KeyboardEvent,
    listing: {
        slug: string;
        name: string;
        websiteUrl?: string;
        category?: string | string[];
    },
    sourcePage: string,
    ctaLabel: string
) => {
    e.preventDefault();

    if (!listing.websiteUrl) return;

    let finalUrl = listing.websiteUrl;
    let targetDomain = '';

    try {
        const urlObj = new URL(listing.websiteUrl.startsWith('http') ? listing.websiteUrl : `https://${listing.websiteUrl}`);

        // Append UTMs
        urlObj.searchParams.set('utm_source', 'brokertools');
        urlObj.searchParams.set('utm_medium', 'directory');
        urlObj.searchParams.set('utm_campaign', listing.slug);

        finalUrl = urlObj.toString();
        targetDomain = urlObj.hostname;
    } catch (err) {
        console.warn('Invalid URL for tracking:', listing.websiteUrl);
    }

    // Prepare Properties
    const subcategory = Array.isArray(listing.category)
        ? listing.category[0]
        : (listing.category || 'unknown');

    const props = {
        listing_id: listing.slug,
        listing_name: listing.name,
        subcategory: typeof subcategory === 'string' ? subcategory : 'unknown',
        destination_domain: targetDomain,
        outbound_url: finalUrl,
        source_page: sourcePage,
        cta_label: ctaLabel
    };

    // Track
    trackEvent('Outbound Listing Clicked', props);

    // Delay & Navigate
    setTimeout(() => {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
    }, 120);
};
