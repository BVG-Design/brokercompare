import { Scale, ShieldCheck, FileText } from 'lucide-react';

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
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 rounded-xl border bg-card shadow-sm space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-semibold">Account terms</h2>
              <p className="text-sm text-muted-foreground">
                You need an accurate email and must keep credentials secure. You are responsible for actions taken using your account.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card shadow-sm space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                <ShieldCheck className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-semibold">Acceptable use</h2>
              <p className="text-sm text-muted-foreground">
                Do not misuse the platform, attempt unauthorized access, or submit unlawful content. We may suspend accounts for abuse.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card shadow-sm space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                <Scale className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-lg font-semibold">Service changes</h2>
              <p className="text-sm text-muted-foreground">
                We may modify or discontinue features with notice when possible. Some features rely on third parties and may change.
              </p>
            </div>
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
