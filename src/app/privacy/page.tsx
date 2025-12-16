import { Lock, Scale, Database, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How BrokerCompare collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/10">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wider text-primary-foreground/80">Privacy</p>
              <h1 className="text-4xl font-bold font-headline">Privacy Policy</h1>
              <p className="text-primary-foreground/80 max-w-3xl">
                How we collect, use, share, and protect your information while you use BrokerCompare.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 space-y-10">
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/terms" className="group block h-full">
            <div className="p-6 rounded-xl border bg-card shadow-sm space-y-3 h-full cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  <Scale className="w-5 h-5 text-accent" />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">Terms of Service</h2>
              <p className="text-sm text-muted-foreground">
                The rules for using BrokerCompare, including acceptable use and liability.
              </p>
            </div>
          </Link>

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
          <h2 className="text-xl font-semibold">Details</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Sharing:</strong> We do not sell personal data. We share with trusted processors only to operate the service, under agreements that protect your information.
            </p>
            <p>
              <strong className="text-foreground">Security:</strong> Encryption, access controls, and monitoring help protect stored data. No system is perfect; report issues so we can address them quickly.
            </p>
            <p>
              <strong className="text-foreground">Retention:</strong> We keep data only as long as needed for the purposes described or to meet legal obligations, then delete or anonymize it.
            </p>
            <p>
              <strong className="text-foreground">Cookies:</strong> We use cookies to keep you signed in and to measure usage. You can manage cookies through your browser settings.
            </p>
            <p>
              <strong className="text-foreground">International transfers:</strong> Data may be processed in other regions with appropriate safeguards in place.
            </p>
            <p>
              <strong className="text-foreground">Contact:</strong> Privacy questions? Email our support team and we will respond.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
