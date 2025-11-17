import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ComparisonProvider } from "@/components/compare/ComparisonContext";
import { ComparisonBar } from "@/components/compare/ComparisonBar";

export const metadata: Metadata = {
  title: 'O Broker Tools',
  description: 'Compare marketing, VA, finance providers and software for brokers in Australia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <ComparisonProvider>
          {children}
          <ComparisonBar />
        </ComparisonProvider>
        <Toaster />
      </body>
    </html>
  );
}
