import { NextRequest } from "next/server";

const sitemapPaths = [
  "/",
  "/directory",
  "/compare",
  "/recommendations",
  "/blog",
  "/apply",
  "/partner",
  "/why-broker-tools",
  "/faq",
  "/terms",
  "/privacy",
  "/ai-data-use-policy",
  "/write-review",
  "/optimise-workflow",
  "/quiz",
  "/directory?cat=mortgage_software",
  "/directory?cat=asset_finance",
  "/directory?cat=commercial_finance",
  "/directory?cat=loan_processing_credit_support",
  "/directory?cat=crm_document_collection",
  "/directory?cat=ai_workflow_design",
  "/directory?cat=marketing_automations",
  "/directory?cat=organic_social_media",
];

const buildXml = (origin: string) => {
  const uniquePaths = Array.from(new Set(sitemapPaths));
  const urls = uniquePaths
    .map((path) => `<url><loc>${origin}${path}</loc></url>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls +
    `</urlset>`;
};

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const xml = buildXml(origin);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
