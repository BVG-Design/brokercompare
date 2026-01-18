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
              <h1 className="text-4xl font-bold font-headline">Terms & Conditions</h1>
              <p className="text-primary-foreground/80 max-w-3xl">
                Broker Tools is a research project aimed at helping the broker industry. Information provided is for discovery and educational purposes only.
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

        <div className="space-y-8 max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Research Purpose Only</h2>
            <p className="text-muted-foreground">
              Broker Tools is currently a research project. Information provided is for discovery and educational purposes only. It should not be considered financial, legal, business, or technology advice. Always do your own due diligence before making decisions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Accuracy of Information</h2>
            <p className="text-muted-foreground">
              While we aim to keep the information accurate and up to date, we make no guarantees or warranties about completeness, reliability, or accuracy. The broker technology landscape changes rapidly, and tools or services mentioned may update their features, pricing, or availability at any time. Use all information at your own discretion.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Broker Tools (and its team) will not be held liable for any loss, damage, or inconvenience caused by use of our site, survey, or any tools we recommend. This includes, but is not limited to, any direct or indirect damages arising from:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Decisions made based on information found on Broker Tools</li>
              <li>Use of third-party products or services we mention or link to</li>
              <li>Any errors, omissions, or inaccuracies in our content</li>
            </ul>
            <p className="text-muted-foreground font-medium">
              To the maximum extent permitted by law, you use Broker Tools entirely at your own risk.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Third-Party Links</h2>
            <p className="text-muted-foreground">
              We may link to third-party products or services. We are not responsible for the content, privacy practices, or outcomes of those third-party sites. When you click a link and leave Broker Tools, you are subject to that site&apos;s own terms and privacy policy. You interact with them at your own risk.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Some links may be affiliate links (see Section 2 of Privacy Policy), but this doesn&apos;t change our lack of responsibility for third-party sites.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on Broker Tools (logos, branding, wording, design, and research findings) belongs to Broker Tools unless otherwise noted. Please don&apos;t copy, reproduce or reuse without permission.
            </p>
            <div className="pl-4 border-l-2 border-primary/20">
              <strong className="block text-foreground mb-1">Fair use:</strong>
              <p className="text-muted-foreground">You&apos;re welcome to reference or quote our findings with proper attribution (e.g., &quot;According to Broker Tools research...&quot;) and a link back to our site.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to These Terms</h2>
            <p className="text-muted-foreground">
              We may update these Terms & Privacy Policy occasionally as our project evolves. If we do, we&apos;ll always post the latest version here with the updated date at the top.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Material changes:</strong> If we make significant changes that affect your rights or how we handle data, we&apos;ll notify you via email (if you&apos;ve provided one) or through a notice on our site.</li>
              <li><strong>Continued use:</strong> By continuing to use Broker Tools after changes are posted, you accept the updated terms.</li>
            </ul>
          </div>

          <div className="pt-6 border-t">
            <p className="text-muted-foreground">
              Got questions? Reach out anytime: <a href="mailto:privacy@brokertools.com" className="text-primary hover:underline">privacy@brokertools.com</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
