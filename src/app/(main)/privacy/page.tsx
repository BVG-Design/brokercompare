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
              <p className="text-sm uppercase tracking-wider text-primary-foreground/80">Privacy Policy</p>
              <h1 className="text-4xl font-bold font-headline">Your Data & Privacy</h1>
              <p className="text-primary-foreground/80 max-w-3xl">
                At Broker Tools, we’re taking a human approach in the age of AI. We believe in keeping things simple, clear, and honest.
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

        <div className="space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. Your Data & Privacy</h2>
            <p className="text-muted-foreground">
              We do not sell your details or data to other brokers, aggregators, or third parties.
            </p>
            <div className="pl-4 border-l-2 border-primary/20 space-y-4">
              <div>
                <strong className="block text-foreground mb-1">What we collect:</strong>
                <p className="text-muted-foreground">When you participate in our surveys or sign up for updates, we may collect information like your email address, survey responses, and basic details about your brokerage. We only collect what&apos;s necessary to understand the broker technology landscape.</p>
              </div>
              <div>
                <strong className="block text-foreground mb-1">How we use it:</strong>
                <p className="text-muted-foreground">Your responses help us research and map out how the tools available are being used and their potential for improvement. We may use anonymous, aggregated insights (e.g. &quot;X% of brokers said…&quot;), but your personal details remain private and are never shared in a way that identifies you.</p>
              </div>
              <div>
                <strong className="block text-foreground mb-1">How we protect it:</strong>
                <p className="text-muted-foreground">We store your information securely and only keep it for as long as needed for our research purposes.</p>
              </div>
              <div>
                <strong className="block text-foreground mb-1">Third-party tools:</strong>
                <p className="text-muted-foreground">We use trusted services with SOC II compliance to collect and manage responses. These providers are bound by their own privacy policies and only process data on our behalf.</p>
              </div>
              <div>
                <strong className="block text-foreground mb-1">Your rights:</strong>
                <p className="text-muted-foreground">You can request to see, update, or delete your personal information at any time by contacting us at <a href="mailto:privacy@brokertools.com" className="text-primary hover:underline">privacy@brokertools.com</a>. You are always in control of what you choose to share.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Affiliate & Advertising</h2>
            <p className="text-muted-foreground">
              Sometimes, we may recommend products or services we believe could truly benefit brokers.
            </p>
            <p className="text-muted-foreground">
              If you decide to click on a link and purchase, we may earn a small commission at no extra cost to you. These are called affiliate links, and we&apos;ll always be transparent when we use them.
            </p>
            <div className="pl-4 border-l-2 border-primary/20 space-y-4">
              <div>
                <strong className="block text-foreground mb-1">Our independence:</strong>
                <p className="text-muted-foreground">These partnerships help keep Broker Tools sustainable, but they don&apos;t influence our research or recommendations. We&apos;ll only promote tools we genuinely see value in for you, and we&apos;ll never let commissions drive what we recommend.</p>
              </div>
            </div>
            <p className="text-muted-foreground font-medium">
              You&apos;re never obligated to use our links, and our content remains helpful regardless of whether you do.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. Our Promise</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>No selling of your personal information.</strong></li>
              <li><strong>No spam:</strong> We&apos;ll only contact you if you&apos;ve opted in, and you can unsubscribe anytime.</li>
              <li><strong>No hidden tricks:</strong> If something changes, we&apos;ll tell you.</li>
              <li><strong>Your control:</strong> You can request to access, update, or delete your data at any time by contacting us at <a href="mailto:privacy@brokertools.com" className="text-primary hover:underline">privacy@brokertools.com</a>.</li>
            </ul>
            <p className="text-lg font-medium text-primary pt-2">
              We exist to make broker tools simpler, not more complicated.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
