import type { Metadata } from "next";
import "./globals.css";
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
  { name: "AI Recommender", path: "/recommendations" },
  { name: "Workflow Automations", path: "/directory?category=ai" },
  { name: "CRMs & Fact Finds", path: "/directory?category=crm" },
  { name: "VA Services", path: "/directory?category=va" },
  { name: "Marketing & Sales", path: "/directory?category=marketing" },
  { name: "Other", path: "/directory?category=other" },
  { name: "Resources", path: "/blog" },
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

  if (sanityConfigured) {
    try {
      const items = await client.fetch<SearchIntentNavItem[]>(
        SEARCH_INTENT_NAV_QUERY
      );

      const sanitized =
        items
          ?.filter((item) => item?.slug && item?.title)
          .map((item) => ({
            name: item.title as string,
            path: `/search/${item.slug}`,
          })) ?? [];

      if (sanitized.length > 0) {
        navLinks = sanitized;
      }
    } catch (error) {
      console.warn("Failed to load Sanity nav links, using fallback.", error);
    }
  }

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
