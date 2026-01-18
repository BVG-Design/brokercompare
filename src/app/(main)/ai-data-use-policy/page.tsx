import { Shield, Mail, Scale, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';



export const metadata = {
  title: 'AI & Data Use Policy',
  description: 'How BrokerCompare uses AI and data to deliver benchmarking and recommendations.',
};

export default function AIDataUsePolicyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-white/10">
              <Shield className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-wider text-primary-foreground/80">Transparency</p>
              <h1 className="text-4xl font-bold font-headline">AI & Data Use Policy</h1>
              <p className="text-primary-foreground/80 max-w-3xl">
                At Broker Tools, we use AI to do the heavy lifting so you don&apos;t have to. But we believe technology should serve people, not the other way around.
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
            <h2 className="text-2xl font-bold">1. How We Use AI</h2>
            <p className="text-muted-foreground">
              We use Artificial Intelligence as a research super-assistant. It helps us process vast amounts of information to give you better answers, faster.
            </p>
            <div className="pl-4 border-l-2 border-primary/20 space-y-4">
              <div>
                <strong className="block text-foreground mb-1">To Analyse:</strong>
                <p className="text-muted-foreground">We use AI to read and digest hundreds of pages of product documentation, saving us (and you) weeks of reading.</p>
              </div>
              <div>
                <strong className="block text-foreground mb-1">To Compare:</strong>
                <p className="text-muted-foreground">AI helps us identify key differences between products and highlight features that matter most to brokers.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Your Data & AI</h2>
            <p className="text-muted-foreground">
              We are extremely protective of the data you share with us.
            </p>
            <div className="pl-4 border-l-2 border-primary/20 space-y-4">
              <div>
                <strong className="block text-foreground mb-1">No Public Training:</strong>
                <p className="text-muted-foreground">We do not use your personal information to train public AI models. Your specific business details remain yours.</p>
              </div>
              <div>
                <strong className="block text-foreground mb-1">Secure Processing:</strong>
                <p className="text-muted-foreground">When we use AI tools to process survey data or feedback, we use SOC II compliant, enterprise-grade services that are bound by strict privacy agreements.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. Limitations & Trust</h2>
            <p className="text-muted-foreground">
              AI is smart, but it&apos;s not perfect. Neither are we, but we try harder.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Human in the loop:</strong> AI generates insights, but humans review our key content and recommendations.</li>
              <li><strong>Transparency:</strong> We aim to be clear about when you are interacting with AI-generated content.</li>
              <li><strong>Your Judgment:</strong> Always use your own due diligence. Our AI-assisted insights are for discovery and education, not financial or legal advice.</li>
            </ul>
          </div>

          <div className="pt-6 border-t">
            <p className="text-muted-foreground">
              Questions about our AI use? Email us: <a href="mailto:privacy@brokertools.com" className="text-primary hover:underline">privacy@brokertools.com</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
