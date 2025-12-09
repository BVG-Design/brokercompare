import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ComparisonProvider } from "@/components/compare/ComparisonContext";
import { ComparisonBar } from "@/components/compare/ComparisonBar";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "O Broker Tools",
  description:
    "Compare marketing, VA, finance providers and software for brokers in Australia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ComparisonProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <ComparisonBar />
        </ComparisonProvider>
        <Toaster />
      </body>
    </html>
  );
}
