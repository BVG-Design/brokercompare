"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/software", label: "Software" },
  { href: "/recommendations", label: "AI Recommender" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-headline">BrokerCompare AU</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="#">Sign In</Link>
          </Button>
           <Button asChild className="hidden sm:inline-flex bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Link href="#">Register</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                  <Mountain className="h-6 w-6 text-primary" />
                  <span className="font-headline">BrokerCompare AU</span>
                </Link>
                <nav className="grid gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary",
                         pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                 <div className="flex flex-col gap-4">
                    <Button asChild variant="outline">
                        <Link href="#">Sign In</Link>
                    </Button>
                     <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        <Link href="#">Register</Link>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
