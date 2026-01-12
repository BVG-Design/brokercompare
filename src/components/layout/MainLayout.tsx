'use client';

import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { FeedbackDialog } from '@/components/shared/FeedbackDialog';
import { SubscribeModal } from '@/components/shared/SubscribeModal';
import mixpanel from 'mixpanel-browser';
import { SITE_URLS } from '@/lib/config';

type NavLink = {
    name: string;
    path: string;
};

type MainLayoutProps = {
    children: React.ReactNode;
    navLinks: NavLink[];
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, navLinks }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [subscribeOpen, setSubscribeOpen] = useState(false);
    const [suggestOpen, setSuggestOpen] = useState(false);

    useEffect(() => {
        mixpanel.init('16b895b70692275a77cc85aa3099d050', {
            autocapture: true,
            record_sessions_percent: 100,
        });
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-brand-cream text-brand-blue font-sans">
            {/* Header */}
            <header className="bg-brand-blue text-white py-4 sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/BrokerTools%20Logo.png"
                            alt="BrokerTools"
                            className="h-14 w-auto"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6 text-base font-semibold">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="hover:text-brand-orange transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={() => setSubscribeOpen(true)}
                            className="px-5 py-2 rounded-lg bg-brand-orange hover:bg-orange-600 transition-colors font-semibold"
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-brand-blue border-t border-white/10 p-4 flex flex-col gap-4 shadow-xl">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="text-white py-2 border-b border-white/5 hover:text-brand-orange text-base font-semibold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setSubscribeOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full py-3 rounded-lg bg-brand-orange text-center font-bold text-white"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-brand-blue text-white pt-16 pb-8 border-t border-white/10">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1 flex flex-col items-start gap-4">
                            <Link href="/" className="flex items-center">
                                <img
                                    src="https://izjekecdocekznhwqivo.supabase.co/storage/v1/object/public/Media/BrokerTools%20Logo.png"
                                    alt="BrokerTools"
                                    className="h-12 w-auto object-contain"
                                />
                            </Link>
                            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                                Connecting brokers with the right products, software, and services to optimize their workflow.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <li><Link href={`${SITE_URLS.directory}/search`} className="hover:text-brand-orange transition-colors">Browse Directory</Link></li>
                                <li><Link href={`${SITE_URLS.resources}/blog`} className="hover:text-brand-orange transition-colors">Resources</Link></li>
                                <li><Link href="/apply" className="hover:text-brand-orange transition-colors">List Your Business</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setFeedbackOpen(true)}
                                        className="hover:text-brand-orange transition-colors"
                                    >
                                        Give Feedback
                                    </button>
                                </li>
                                <li><Link href="/faq" className="hover:text-brand-orange transition-colors">FAQs</Link></li>
                                <li><Link href="/terms" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Engage</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <li className="group relative w-fit">
                                    <Link href="/workflow-optimisation" className="hover:text-brand-orange transition-colors" title="Schedule a chat with us.">Schedule a Chat</Link>
                                </li>
                                <li className="group relative w-fit">
                                    <Link href="/partner" className="hover:text-brand-orange transition-colors" title="Work with us as a vendor, educator or integration partner.">Partner With Us</Link>
                                </li>
                                <li className="group relative w-fit">
                                    <Link href="/why-broker-tools" className="hover:text-brand-orange transition-colors" title="Our purpose, how we’re funded, and the ethics behind our platform.">Why Broker Tools</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
                        (c) 2025 BrokerTools. All rights reserved.
                    </div>
                </div>
            </footer>
            <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
            <SubscribeModal open={subscribeOpen} onOpenChange={setSubscribeOpen} />
        </div>
    );
};

export default MainLayout;
