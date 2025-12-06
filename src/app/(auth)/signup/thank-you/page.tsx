'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, MailCheck, Mail } from 'lucide-react';

export default function SignupThankYouPage() {
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const inboxLinks = useMemo(
    () => [
      { label: 'Gmail', href: 'https://mail.google.com', colorClass: 'text-secondary' },
      { label: 'Outlook', href: 'https://outlook.live.com/mail', colorClass: 'text-secondary' },
    ],
    []
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4 text-primary-foreground">
      <div className="w-full max-w-md bg-white text-foreground shadow-lg rounded-xl p-8 space-y-6">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Thanks for signing up</h1>
          <p className="text-sm text-gray-600">
            {email ? `We sent a confirmation email to ${email}.` : 'We sent a confirmation email to your inbox.'} Please check it to activate your account.
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MailCheck className="w-4 h-4" />
            What to do next
          </div>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Open the verification email and click the confirm link.</li>
            <li>Check your spam or promotions folder if you do not see it.</li>
            <li>Once confirmed, sign in to access your dashboard.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="w-full rounded-lg border border-orange-200 p-4 bg-orange-100 text-center space-y-2">
            <div className="text-sm font-semibold text-primary text-center">OPEN YOUR INBOX</div>
            <div className="flex items-center justify-center gap-2 text-sm text-accent font-semibold">
              {inboxLinks.map((item, idx) => (
                <span key={item.label} className="flex items-center gap-1">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`underline flex items-center gap-1 ${item.colorClass}`}
                  >
                    <Mail className="w-4 h-4" />
                    {item.label}
                  </a>
                  {idx < inboxLinks.length - 1 && <span className="text-gray-400">|</span>}
                </span>
              ))}
            </div>
          </div>
          <Link href="/faq" className="block text-sm text-center text-accent font-semibold hover:brightness-90">
            Need help? Visit the FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
