"use client";
import { SITE_URLS } from "@/lib/config";

// NOT used - MainLayout.tsx is used instead
// If you are editing this file and not seeing changes, edit MainLayout.tsx

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { href: `${SITE_URLS.directory}/search`, label: "Directory" },
  { href: `${SITE_URLS.resources}/blog?blogType=review`, label: "Tech Reviews" },
  { href: `${SITE_URLS.resources}/blog?blogType=podcast`, label: "Podcasts" },
  { href: `${SITE_URLS.resources}/blog`, label: "Resources" },
];

interface User {
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image
            src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/BrokerTools%20Logo.png"
            alt="Broker Tools Logo"
            width={140}
            height={35}
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-base font-bold transition-colors hover:text-accent",
                pathname.startsWith(item.href) ? "text-white" : "text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/broker">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setUser(null)}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="bg-transparent border-primary-foreground/50 hover:bg-accent hover:text-accent-foreground text-primary-foreground"
              >
                <Link href="/login">
                  <Plus className="mr-1 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/signup">Join</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                  <Image
                    src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/BrokerTools%20Logo.png"
                    alt="Broker Tools Logo"
                    width={140}
                    height={35}
                  />
                </Link>

                <nav className="grid gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-accent",
                        pathname.startsWith(item.href)
                          ? "text-primary font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col gap-4">
                  {user ? (
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => setUser(null)}
                        >
                          Log out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href="/login">
                          <Plus className="mr-1 h-4 w-4" /> Login
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      >
                        <Link href="/signup">Join</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
