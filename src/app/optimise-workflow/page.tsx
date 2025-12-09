'use client';

import React from 'react';
import {
    Check,
    ArrowRight,
    Settings,
    Zap,
    Users,
    Shield,
    TrendingUp,
    Clock,
    AlertCircle,
    BarChart,
    FileText,
    Search,
    Layout,
    Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function OptimiseWorkflowPage() {
    const scrollToCalendar = () => {
        const calendarSection = document.getElementById('calendar-section');
        if (calendarSection) {
            calendarSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-brand-blue relative overflow-hidden pt-24 pb-20 px-4">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-green rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Ready to <span className="text-brand-green">Optimise</span> the Way you Work?
                    </h1>

                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-10 max-w-3xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-4">Book a Workflow Assessment Session</h2>
                        <p className="text-lg text-white/90 mb-6">
                            Walk away with practical recommendations to simplify your CRM, a plan to automate the right parts of your workflow, and remove any of the blockers that slows your growth.
                        </p>
                        <div className="text-brand-green font-bold text-xl mb-8">
                            Less admin. More clarity. Better flow.
                        </div>

                        <button
                            onClick={scrollToCalendar}
                            className="bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg shadow-orange-900/20 transition-all inline-flex items-center gap-2"
                        >
                            Book My Workflow Assessment Session <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Curve */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
                    <svg className="relative block w-full h-[40px] md:h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,120 L0,0 Q600,120 1200,0 L1200,120 Z" fill="#ffffff" />
                    </svg>
                </div>
            </section>

            {/* Pain Points Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-brand-blue mb-4">If you’re like most brokers, you want to:</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={24} />
                            </div>
                            <h3 className="font-bold text-brand-blue">Focus on gaining new clients</h3>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-orange-100 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-bold text-brand-blue">Reduce manual admin</h3>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="font-bold text-brand-blue">Improve deal flow</h3>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap size={24} />
                            </div>
                            <h3 className="font-bold text-brand-blue">And scale without burning out</h3>
                        </div>
                    </div>

                    <div className="bg-brand-cream rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-brand-blue mb-6">
                            But with too many tools, disconnected systems, and unclear workflows, it’s hard to know what to fix first.
                        </h3>
                        <p className="text-lg text-gray-700 mb-8">
                            This Free Workflow Assessment Session is designed to uncover:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                                    <AlertCircle size={14} />
                                </div>
                                <span className="font-medium text-brand-blue">What’s slowing you down</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-1">
                                    <AlertCircle size={14} />
                                </div>
                                <span className="font-medium text-brand-blue">What’s overcomplicated</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Check size={14} />
                                </div>
                                <span className="font-medium text-brand-blue">And what your smartest next system process should be</span>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="font-bold text-xl text-brand-blue">
                                Gain a clear Guide on how to optimise the way you work.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Explore Section */}
            <section className="py-20 bg-gray-50 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-brand-orange font-bold uppercase tracking-wider text-sm">The Process</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mt-2">Here’s What We Explore Together During This Session</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Part 1 */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-brand-blue">
                            <h3 className="text-xl font-bold text-brand-blue mb-2">PART 1</h3>
                            <h4 className="text-lg font-semibold text-gray-700 mb-6">We explore your current workflow</h4>
                            <p className="text-sm text-gray-500 mb-4 font-bold">We review:</p>
                            <ul className="space-y-3">
                                {[
                                    "Your current CRM and systems",
                                    "How you capture, track and manage leads",
                                    "Where admin piles up",
                                    "Where automations break down",
                                    "What’s working well and what’s quietly costing you time and money"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                        <Search size={16} className="text-brand-blue mt-1 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Part 2 */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-brand-orange">
                            <h3 className="text-xl font-bold text-brand-blue mb-2">PART 2</h3>
                            <h4 className="text-lg font-semibold text-gray-700 mb-6">We clarify what you’re trying to achieve</h4>
                            <p className="text-sm text-gray-500 mb-4 font-bold">We discuss:</p>
                            <ul className="space-y-3">
                                {[
                                    "Your deal volume goals",
                                    "Growth plans (solo → team → scale)",
                                    "Lead sources",
                                    "Bottlenecks in processing, compliance or follow-ups",
                                    "Where you want more time freedom or control"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                        <TargetIcon size={16} className="text-brand-orange mt-1 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Part 3 */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-brand-green">
                            <h3 className="text-xl font-bold text-brand-blue mb-2">PART 3</h3>
                            <h4 className="text-lg font-semibold text-gray-700 mb-6">We give you specific recommendations</h4>
                            <p className="text-sm text-gray-500 mb-4 font-bold">You’ll get practical guidance on:</p>
                            <ul className="space-y-3">
                                {[
                                    "What to automate first",
                                    "What to simplify",
                                    "What to ignore",
                                    "And what systems actually suit your business stage"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                        <Check size={16} className="text-brand-green mt-1 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ideas Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="bg-brand-blue rounded-3xl p-8 md:p-16 text-white text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12">You’ll Get Ideas On How To:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-left">
                            {[
                                "Design a cleaner, faster CRM",
                                "Automate lead capture and client follow-ups",
                                "Streamline document collection & compliance",
                                "Reduce double-handling and manual processing",
                                "Improve pipeline visibility",
                                "Build post-settlement retention systems",
                                "Use AI safely inside your workflow",
                                "Scale without hiring too early"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                        <Check size={18} className="text-brand-green" />
                                    </div>
                                    <span className="text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <p className="text-white/80 mb-8 italic">...and more.</p>
                            <p className="text-xl leading-relaxed max-w-3xl mx-auto">
                                At the end of the session, we’ll send you a summary of your most valuable workflow improvements and system opportunities.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 text-center max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-brand-blue mb-6">You’re free to:</h3>
                        <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
                            <div className="bg-gray-50 px-6 py-4 rounded-lg flex items-center gap-3 text-brand-blue font-medium">
                                <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                                Implement this plan on your own
                            </div>
                            <div className="bg-gray-50 px-6 py-4 rounded-lg flex items-center gap-3 text-brand-blue font-medium">
                                <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                                Use your existing team
                            </div>
                        </div>
                        <p className="text-xl font-bold text-brand-orange mb-4">
                            Or — if you choose — have us help you implement it for you
                        </p>
                        <p className="text-gray-600">
                            There’s no pressure or obligation.<br />
                            This is simply a fast, practical way to get a clear Workflow Roadmap for your business.
                        </p>
                    </div>
                </div>
            </section>

            {/* Who This Is For Section */}
            <section className="py-20 bg-brand-cream px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-brand-blue mb-12">Who This Is For</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            "Mortgage Brokers",
                            "Asset & Equipment Finance Brokers",
                            "Commercial & SME Finance Brokers",
                            "Small to Mid Size Teams"
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100/50 hover:shadow-md transition-all">
                                <div className="w-10 h-10 bg-brand-blue/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-blue">
                                    <Users size={20} />
                                </div>
                                <h3 className="font-bold text-brand-blue text-sm">{item}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3 Ways to Help Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-brand-blue mb-2">Our 3 Ways to Help After the Session</h2>
                    <span className="inline-block bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full mb-10">(Optional)</span>

                    <p className="text-lg text-gray-700 mb-10">
                        If you’d like support beyond the session, we offer:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="border border-gray-200 rounded-xl p-6 hover:border-brand-green transition-colors">
                            <div className="text-5xl font-bold text-brand-blue/20 mb-4 h-12 flex items-center justify-center">1</div>
                            <h3 className="font-bold text-brand-blue mb-2">DIY Workflow Playbooks & Templates</h3>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 hover:border-brand-green transition-colors">
                            <div className="text-5xl font-bold text-brand-blue/20 mb-4 h-12 flex items-center justify-center">2</div>
                            <h3 className="font-bold text-brand-blue mb-2">Done-For-You CRM & Automation Builds</h3>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 hover:border-brand-green transition-colors">
                            <div className="text-5xl font-bold text-brand-blue/20 mb-4 h-12 flex items-center justify-center">3</div>
                            <h3 className="font-bold text-brand-blue mb-2">Independent Software, Service & AI Recommendations</h3>
                        </div>
                    </div>

                    <p className="text-gray-600 italic">
                        You choose what level of help you want — or none at all.
                    </p>
                </div>
            </section>

            {/* Why Broker Tools Section */}
            <section className="py-20 bg-brand-green text-brand-blue px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6">Why Broker Tools?</h2>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <Shield className="text-brand-blue" size={24} />
                                    <span className="text-lg">Independent & non-aggregator aligned</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Shield className="text-brand-blue" size={24} />
                                    <span className="text-lg">No paid software bias</span>
                                </li>
                            </ul>
                            <div className="mt-8 pt-8 border-t border-brand-blue/10">
                                <h3 className="text-xl font-bold mb-4 text-white">We don’t sell “software.”</h3>
                                <h3 className="text-xl font-bold">We design Workflow Systems that help you scale</h3>
                            </div>
                        </div>

                        <div className="md:w-1/2 bg-white/5 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-lg font-bold mb-6 border-b border-brand-blue/10 pb-4">Built by people who understand:</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
                                    <span>Compliance pressure</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
                                    <span>Deal flow</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
                                    <span>CRM design</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse"></div>
                                    <span>Automation logic</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calendar Section */}
            <section id="calendar-section" className="py-24 bg-white px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <span className="text-brand-orange font-bold text-sm uppercase tracking-widest mb-4 block">Let's Get Started</span>
                    <h2 className="text-4xl font-bold text-brand-blue mb-4">Request Your Workflow Assessment Session Now</h2>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Get a workflow, CRM and/or AI automation recommendation specific for your business – book your free session below.
                    </p>

                    {/* Calendar Placeholder */}
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl min-h-[600px] flex flex-col items-center justify-center p-8 text-gray-400">
                        <Calendar size={64} className="mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-gray-500 mb-2">Calendar Loading...</h3>
                        <p>[CALENDAR FORM EMBED GOES HERE]</p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-brand-blue mb-12 text-center">FAQ</h2>
                    <div className="text-center text-gray-500 italic">
                        {/* Placeholder for FAQ content as none was provided */}
                        <p>Frequently Asked Questions will be displayed here.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Icon component needed for the list in Part 2
function TargetIcon({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}
