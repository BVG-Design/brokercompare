import { SITE_URLS } from "@/lib/config";

const sitemapPaths = [
  SITE_URLS.main + "/",
  SITE_URLS.directory + "/search",
  SITE_URLS.directory + "/compare",
  SITE_URLS.main + "/recommendations",
  SITE_URLS.resources + "/blog",
  SITE_URLS.main + "/apply",
  SITE_URLS.main + "/partner",
  SITE_URLS.main + "/why-broker-tools",
  SITE_URLS.main + "/faq",
  SITE_URLS.main + "/terms",
  SITE_URLS.main + "/privacy",
  SITE_URLS.main + "/ai-data-use-policy",
  SITE_URLS.main + "/write-review",
  SITE_URLS.main + "/optimise-workflow",
  SITE_URLS.main + "/quiz",
  SITE_URLS.directory + "/search?cat=mortgage_software",
  SITE_URLS.directory + "/search?cat=asset_finance",
  SITE_URLS.directory + "/search?cat=commercial_finance",
  SITE_URLS.directory + "/search?cat=loan_processing_credit_support",
  SITE_URLS.directory + "/search?cat=crm_document_collection",
  SITE_URLS.directory + "/search?cat=ai_workflow_design",
  SITE_URLS.directory + "/search?cat=marketing_automations",
  SITE_URLS.directory + "/search?cat=organic_social_media",
];

const buildXml = (origin: string) => {
  const uniquePaths = Array.from(new Set(sitemapPaths));
  const urls = uniquePaths
    .map((path) => `<url><loc>${path}</loc></url>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls +
    `</urlset>`;
};

export function GET() {
  const xml = buildXml("");

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
