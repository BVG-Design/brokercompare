import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Shield, Sparkles, Lock, Mail, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

const commitments = [
  {
    icon: <Sparkles className="w-5 h-5 text-accent" />,
    title: 'Purpose-built AI',
    copy: 'We use AI to surface recommendations and benchmarks that help brokers compare software and services.',
  },
  {
    icon: <Lock className="w-5 h-5 text-accent" />,
    title: 'No selling of personal data',
    copy: 'Personal data is never sold. We only use what is needed to deliver and improve the platform.',
  },
  {
    icon: <SlidersHorizontal className="w-5 h-5 text-accent" />,
    title: 'Control and opt-outs',
    copy: 'You can opt out of AI-driven personalization at any time without losing access to your account.',
  },
];

export const metadata = {
  title: 'AI & Data Use Policy',
  description: 'How BrokerCompare uses AI and data to deliver benchmarking and recommendations.',
};

export default function AIDataUsePolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-background text-foreground">
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/10">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-wider text-primary-foreground/80">Transparency</p>
                <h1 className="text-4xl font-bold font-headline">AI &amp; Data Use Policy</h1>
                <p className="text-primary-foreground/80 max-w-3xl">
                  Learn how we apply AI to benchmarking, what data we handle, and the controls you have over your information.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-6 py-12 space-y-10">
          <div className="grid gap-6 md:grid-cols-3">
            {commitments.map((item) => (
              <div key={item.title} className="p-6 rounded-xl border bg-card shadow-sm space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                  {item.icon}
                </div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">How AI is used</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Ranking and recommending software and services based on your interests.</li>
                <li>Summarizing benchmarking insights to help you compare providers quickly.</li>
                <li>Improving search relevance and highlighting options that match your profile.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Data handling</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Personal data is used to deliver the service and personalize recommendations.</li>
                <li>Usage analytics help us improve accuracy while keeping data minimization in mind.</li>
                <li>We do not sell personal data. Access is limited to what is required for support and operations.</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold">Your controls</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>You can opt out of AI-driven personalization in your account settings.</li>
                <li>You may request access, correction, or deletion of your personal data.</li>
                <li>Security measures such as encryption and access controls protect stored information.</li>
              </ul>
            </div>
            <div className="p-6 rounded-xl border bg-muted/30 space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">Questions?</h3>
              <p className="text-sm text-muted-foreground">
                If you have questions about how we use AI and data, or want to manage your preferences, reach out to our support team and we will help.
              </p>
              <Link href="/faq" className="text-sm font-semibold text-secondary underline">
                Visit FAQs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
