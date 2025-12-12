import { Scale, ShieldCheck, Database, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service',
  description: 'BrokerCompare terms of service and acceptable use.',
};

export default function TermsPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/10">
              <Scale className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wider text-primary-foreground/80">Terms</p>
              <h1 className="text-4xl font-bold font-headline">Terms of Service</h1>
              <p className="text-primary-foreground/80 max-w-3xl">
                The rules for using BrokerCompare, including acceptable use, accounts, and limitations of liability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/ai-data-use-policy" className="group block h-full">
            <div className="p-6 rounded-xl border bg-card shadow-sm space-y-3 h-full cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <Database className="w-5 h-5 text-accent" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">AI & Data Use Policy</h2>
              <p className="text-sm text-muted-foreground">
                Learn how we apply AI to benchmarking and how we handle your data.
              </p>
            </div>
          </Link>

          <Link href="/privacy" className="group block h-full">
            <div className="p-6 rounded-xl border bg-card shadow-sm space-y-3 h-full cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">Privacy Policy</h2>
              <p className="text-sm text-muted-foreground">
                How we collect, use, share, and protect your information.
              </p>
            </div>
          </Link>

          <Link href="/faq" className="group block h-full">
            <div className="p-6 rounded-xl border bg-card shadow-sm space-y-3 h-full cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <HelpCircle className="w-5 h-5 text-accent" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">FAQs</h2>
              <p className="text-sm text-muted-foreground">
                Find answers to common questions about using BrokerCompare.
              </p>
            </div>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Key terms</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">License:</strong> We grant you a personal, non-transferable license to use the platform in accordance with these terms.
            </p>
            <p>
              <strong className="text-foreground">Content:</strong> You retain rights to your content but grant us a license to host and display it as needed to operate the service.
            </p>
            <p>
              <strong className="text-foreground">Third-party services:</strong> Some features integrate external providers. Their terms and privacy practices apply when used.
            </p>
            <p>
              <strong className="text-foreground">Availability:</strong> We aim for high availability but do not guarantee uninterrupted access. Planned maintenance may occur.
            </p>
            <p>
              <strong className="text-foreground">Termination:</strong> We may suspend or terminate accounts for violations. You can cancel at any time.
            </p>
            <p>
              <strong className="text-foreground">Disclaimer:</strong> The service is provided &quot;as is&quot; without warranties. Liability is limited to the maximum extent permitted by law.
            </p>
            <p>
              <strong className="text-foreground">Contact:</strong> Questions about these terms? Email our support team and we will help.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
