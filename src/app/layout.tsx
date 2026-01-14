import type { Metadata } from "next";
import "./globals.css";
import { SITE_URLS } from "@/lib/config";
import { Toaster } from "@/components/ui/toaster";
import { ComparisonProvider } from "@/components/compare/ComparisonContext";
import { ComparisonBar } from "@/components/compare/ComparisonBar";
import MainLayout from "@/components/layout/MainLayout";
import { client, sanityConfigured } from "@/sanity/lib/client";
import { SEARCH_INTENT_NAV_QUERY } from "@/sanity/lib/queries";

type NavLink = {
  name: string;
  path: string;
};

export const metadata: Metadata = {
  title: "O Broker Tools",
  description:
    "Compare marketing, VA, finance providers and software for brokers in Australia.",
};

const fallbackNavLinks: NavLink[] = [
  { name: "Directory", path: `${SITE_URLS.directory}/search` },
  { name: "Tech Reviews", path: `${SITE_URLS.resources}/blog?blogType=review` },
  { name: "Podcasts", path: `${SITE_URLS.resources}/blog?blogType=podcast` },
  { name: "Resources", path: `${SITE_URLS.resources}/blog` },
  { name: "Schedule a Chat", path: "/workflow-optimisation" },
];

type SearchIntentNavItem = {
  _id: string;
  title?: string;
  slug?: string;
  order?: number;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let navLinks = fallbackNavLinks;

  // Dynamic navigation from Sanity is disabled to maintain standard "Directory, Reviews, Podcasts, Resources" menu
  // if (sanityConfigured) {
  //   try {
  //     const items = await client.fetch<SearchIntentNavItem[]>(
  //       SEARCH_INTENT_NAV_QUERY
  //     );
  //
  //     const sanitized =
  //       items
  //         ?.filter((item) => item?.slug && item?.title)
  //         .map((item) => ({
  //           name: item.title as string,
  //           path: `${SITE_URLS.directory}/search/${item.slug}`,
  //         })) ?? [];
  //
  //     if (sanitized.length > 0) {
  //       navLinks = sanitized;
  //     }
  //   } catch (error) {
  //     console.error("Failed to load Sanity nav links. Ensure 'searchIntent' documents with 'showInNav' set to true exist in your Sanity dataset.", error);
  //   }
  // }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ComparisonProvider>
          <MainLayout navLinks={navLinks}>
            {children}
          </MainLayout>
          <ComparisonBar />
        </ComparisonProvider>
        <Toaster />
      </body>
    </html>
  );
}
