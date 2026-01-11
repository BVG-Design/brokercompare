'use client';

import Link from "next/link";
import { Twitter, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FeedbackDialog } from "@/components/shared/FeedbackDialog";
import { SITE_URLS } from "@/lib/config";

export function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Image src="/logo.svg" alt="O Broker Tools Logo" width={140} height={35} className="brightness-0 invert" />
            </Link>
            <p className="text-sm text-primary-foreground/60">Empowering Australian brokers with data-driven decisions.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="text-primary-foreground/60 hover:text-primary-foreground"><Facebook className="h-5 w-5" /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href={`${SITE_URLS.directory}/search`} className="text-sm text-primary-foreground/80 hover:text-primary-foreground">Browse Directory</Link></li>
              <li><Link href={`${SITE_URLS.main}/recommendations`} className="text-sm text-primary-foreground/80 hover:text-primary-foreground">AI Quiz</Link></li>
              <li><Link href="/apply" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">List your Business</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Company</h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(true)}
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground"
                >
                  Give Feedback
                </button>
              </li>
              <li><Link href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Engage</h4>
            <ul className="space-y-2">
              <li><Link href="/workflow-optimisation" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">Schedule a Chat</Link></li>
              <li><Link href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">Partner with us</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} O Broker Tools. All rights reserved.</p>
        </div>
      </div>
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </footer>
  );
}
