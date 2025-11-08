"use client";

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
import { Menu, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/software", label: "Software" },
  { href: "/resources", label: "Resources" },
  { href: "/recommendations", label: "AI Recommender" },
];

// Mock user object. In a real app, this would come from an auth hook.
const mockUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatarUrl: "https://picsum.photos/seed/avatar-4/40/40",
  initials: "JD",
};

export function Header() {
  const pathname = usePathname();
  // We'll use a local state to simulate authentication for now.
  const [user, setUser] = useState<typeof mockUser | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Image src="/logo.svg" alt="O Broker Tools Logo" width={140} height={35} className="brightness-0 invert"/>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-bold transition-colors hover:text-accent",
                pathname.startsWith(item.href)
                  ? "text-white"
                  : "text-white"
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
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
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
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setUser(null)}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button asChild variant="outline" className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10">
                  <Link href="#"><Plus className="mr-1 h-4 w-4" /> List Your Business</Link>
              </Button>
              <Button asChild variant="secondary">
                  <Link href="#">Login / Join</Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden text-primary-foreground border-primary-foreground/50 hover:bg-primary-foreground/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                  <Image src="/logo.svg" alt="O Broker Tools Logo" width={140} height={35} />
                </Link>
                <nav className="grid gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-accent",
                        pathname.startsWith(item.href) ? "text-primary font-semibold" : "text-muted-foreground"
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
                            <Button variant="link" className="p-0 h-auto" onClick={() => setUser(null)}>Log out</Button>
                        </div>
                    </div>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                          <Link href="#"><Plus className="mr-1 h-4 w-4" /> List Your Business</Link>
                      </Button>
                      <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                        <Link href="#">Login / Join</Link>
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
