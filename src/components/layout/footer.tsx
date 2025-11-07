import Link from "next/link";
import { Mountain, Twitter, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
             <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Mountain className="h-6 w-6 text-primary" />
              <span className="font-headline">BrokerCompare AU</span>
            </Link>
            <p className="text-sm text-muted-foreground">Empowering Australian brokers with data-driven decisions.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5"/></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-5 w-5"/></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5"/></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-primary">Service Providers</Link></li>
              <li><Link href="/software" className="text-sm text-muted-foreground hover:text-primary">Software</Link></li>
              <li><Link href="/recommendations" className="text-sm text-muted-foreground hover:text-primary">AI Recommender</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">About</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BrokerCompare AU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
