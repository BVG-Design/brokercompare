'use client';

import React from 'react';
import {
    Check,
    ArrowRight,
    Search,
    Target,
    Zap,
    Users,
    BarChart,
    Shield,
    FileText,
    TrendingUp,
    Calendar,
    ChevronRight,
    Layout,
    Database,
    MessageSquare,
    Settings
} from 'lucide-react';
import Link from 'next/link';

export default function WorkflowOptimisationPage() {
    const scrollToCalendar = () => {
        const calendarSection = document.getElementById('calendar-section');
        if (calendarSection) {
            calendarSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-brand-blue text-white font-body selection:bg-brand-orange selection:text-white">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-4 overflow-hidden">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                        Workflow Automations <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-green">for Brokers</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Less admin. More clarity. Better flow. <br />
                        Walk away with practical recommendations to simplify your CRM and a plan to automate the right parts of your workflow.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={scrollToCalendar}
                            className="bg-brand-orange hover:opacity-90 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2 group"
                        >
                            Book Assessment Session <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Process Section (The "Blueprint") */}
            <section className="py-24 relative bg-[#fffff0]">
                <div className="container mx-auto max-w-6xl px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-3">The Process</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-brand-blue">A Blueprint for Predictable Results</h3>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-blue/0 via-brand-blue/50 to-brand-blue/0 -translate-x-1/2"></div>

                        <div className="space-y-24">
                            {/* Step 1 */}
                            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                <div className="md:w-1/2 flex justify-center md:justify-end order-2 md:order-1">
                                    <div className="text-center md:text-right">
                                        <h4 className="text-2xl font-bold text-brand-blue mb-2">Analysis & Assessment</h4>
                                        <p className="text-gray-800 max-w-md">
                                            We explore your current workflow, systems, and CRM. We identify where admin piles up and where automations are breaking down.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue border-4 border-[#fffff0] shadow-[0_0_0_4px_rgba(20,31,51,0.1)] order-1 md:order-2">
                                    <Search className="text-brand-orange" size={24} />
                                </div>
                                <div className="md:w-1/2 order-3">
                                    <div className="bg-brand-blue p-6 rounded-2xl border border-gray-800/50 relative overflow-hidden group hover:border-brand-orange/50 transition-colors">
                                        <div className="flex gap-3 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                                            <div className="w-2 h-2 rounded-full bg-brand-green"></div>
                                        </div>
                                        <div className="space-y-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <div className="h-2 w-3/4 bg-gray-700 rounded full"></div>
                                            <div className="h-2 w-1/2 bg-gray-700 rounded full"></div>
                                            <div className="h-2 w-5/6 bg-gray-700 rounded full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                <div className="md:w-1/2 order-3 md:order-1">
                                    <div className="bg-brand-blue p-6 rounded-2xl border border-brand-blue/50 relative overflow-hidden group hover:border-brand-orange/50 transition-colors">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                <Target size={20} className="text-brand-orange" />
                                            </div>
                                            <div className="h-2 w-24 bg-white/10 rounded full"></div>
                                        </div>
                                        <div className="space-y-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <div className="flex justify-between text-xs text-white/50">
                                                <span>Goal</span>
                                                <span>Target</span>
                                            </div>
                                            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full w-2/3 bg-brand-orange"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue border-4 border-[#fffff0] shadow-[0_0_0_4px_rgba(20,31,51,0.1)] order-1 md:order-2">
                                    <Target className="text-brand-orange" size={24} />
                                </div>
                                <div className="md:w-1/2 flex justify-center md:justify-start order-2 md:order-3">
                                    <div className="text-center md:text-left">
                                        <h4 className="text-2xl font-bold text-brand-blue mb-2">Strategy & Clarity</h4>
                                        <p className="text-gray-800 max-w-md">
                                            We clarify what you’re trying to achieve—deal volume goals, team growth, and where you want more time freedom.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                                <div className="md:w-1/2 flex justify-center md:justify-end order-2 md:order-1">
                                    <div className="text-center md:text-right">
                                        <h4 className="text-2xl font-bold text-brand-blue mb-2">Recommendations & Growth</h4>
                                        <p className="text-gray-800 max-w-md">
                                            You get specific, practical guidance on what to automate, simplify, or ignore. A clear roadmap for your smarter system.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-brand-blue border-4 border-[#fffff0] shadow-[0_0_0_4px_rgba(20,31,51,0.1)] order-1 md:order-2">
                                    <TrendingUp className="text-brand-orange" size={24} />
                                </div>
                                <div className="md:w-1/2 order-3">
                                    <div className="bg-brand-blue p-6 rounded-2xl border border-brand-blue/50 relative overflow-hidden group hover:border-brand-orange/50 transition-colors">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                                                <div className="text-2xl font-bold text-white mb-1">3x</div>
                                                <div className="text-xs text-brand-orange">Efficiency</div>
                                            </div>
                                            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                                                <div className="text-2xl font-bold text-white mb-1">-5h</div>
                                                <div className="text-xs text-brand-green">Admin Time</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Toolkit Section (Alternating Features) */}
            <section className="py-32 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-bold text-white mb-4">Your Complete Toolkit for Success</h2>
                        <p className="text-gray-200 max-w-2xl mx-auto">
                            We address every aspect of your broker business logic, ensuring no stone is left unturned in your pursuit of efficiency.
                        </p>
                    </div>

                    <div className="space-y-32">
                        {/* Feature 1 */}
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <div className="bg-[#131825] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                                    {/* Abstract UI Mocks */}
                                    <div className="absolute top-0 right-0 p-4 opacity-20"> <Settings size={120} /> </div>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center gap-3 bg-[#1A2035] p-3 rounded-xl border border-gray-700/50 w-full max-w-xs">
                                            <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green"><Check size={16} /></div>
                                            <span className="text-sm font-medium text-gray-300">New Client Added</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-[#1A2035] p-3 rounded-xl border border-gray-700/50 w-full max-w-xs translate-x-8">
                                            <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange"><Zap size={16} /></div>
                                            <span className="text-sm font-medium text-gray-300">Welcome Email Sent (Auto)</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-[#1A2035] p-3 rounded-xl border border-gray-700/50 w-full max-w-xs translate-x-4">
                                            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-white"><FileText size={16} /></div>
                                            <span className="text-sm font-medium text-gray-300">Task Created for Team</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <h3 className="text-3xl font-bold text-white mb-6">Reduce Manual Admin & Double-Handling</h3>
                                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                                    Stop wasting time on data entry. We help you design workflows that automate lead capture, streamline document collection, and eliminate repetitive tasks.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Automate lead capture from website to CRM",
                                        "Streamline document collection & compliance",
                                        "Reduce data entry errors"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                            <div className="lg:w-1/2">
                                <div className="bg-[#131825] rounded-3xl p-8 border border-gray-800 shadow-2xl relative flex items-center justify-center aspect-video">
                                    <div className="w-32 h-32 rounded-full bg-brand-orange/10 flex items-center justify-center animate-pulse">
                                        <BarChart size={64} className="text-brand-orange" />
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-brand-orange/20 rounded-full"></div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-dashed border-brand-orange/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <h3 className="text-3xl font-bold text-white mb-6">Improve Pipeline Visibility</h3>
                                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                                    Never lose track of a deal again. We help you design a cleaner, faster CRM that gives you instant clarity on your pipeline stages and bottlenecks.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Clear deal stages that match your actual process",
                                        "Automated follow-up reminders for stalling deals",
                                        "Pipeline health retention reports"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <div className="bg-[#131825] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#1A2035] p-6 rounded-2xl flex flex-col items-center text-center">
                                            <Users className="text-brand-orange mb-3" size={32} />
                                            <span className="text-white font-bold">Team</span>
                                            <span className="text-xs text-gray-500 mt-1">Synced & Aligned</span>
                                        </div>
                                        <div className="bg-[#1A2035] p-6 rounded-2xl flex flex-col items-center text-center">
                                            <TrendingUp className="text-brand-green mb-3" size={32} />
                                            <span className="text-white font-bold">Growth</span>
                                            <span className="text-xs text-gray-500 mt-1">Without Burnout</span>
                                        </div>
                                        <div className="col-span-2 bg-brand-blue/10 p-4 rounded-xl border border-brand-blue/20 flex items-center justify-between">
                                            <span className="text-brand-orange text-sm font-medium">System Capacity</span>
                                            <div className="flex gap-1">
                                                <div className="w-2 h-4 bg-brand-orange rounded-sm"></div>
                                                <div className="w-2 h-4 bg-brand-orange rounded-sm"></div>
                                                <div className="w-2 h-4 bg-brand-orange rounded-sm"></div>
                                                <div className="w-2 h-4 bg-brand-orange/50 rounded-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <h3 className="text-3xl font-bold text-white mb-6">Scale Without Growing Pains</h3>
                                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                                    Build a business that can handle volume. Whether you are a solo broker wanting to hire, or a team wanting to scale, we design systems that grow with you.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Standard Operating Procedures (SOPs) built into your CRM",
                                        "Role clarity and task delegation workflows",
                                        "Onboarding systems for new staff"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Feature 4 (AI Enablement - New) */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                            <div className="lg:w-1/2">
                                <div className="bg-[#131825] rounded-3xl p-8 border border-gray-800 shadow-2xl relative flex items-center justify-center aspect-video overflow-hidden">
                                    {/* Abstract AI/Bot Pattern */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.1),transparent_70%)]"></div>
                                    <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-sm">
                                        {/* Bot Message */}
                                        <div className="bg-[#1A2035] p-4 rounded-t-xl rounded-br-xl rounded-bl-none border border-gray-700/50 self-start animate-fade-in-up">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center">
                                                    <MessageSquare size={12} className="text-brand-green" />
                                                </div>
                                                <span className="text-xs text-brand-green font-bold">AI Agent</span>
                                            </div>
                                            <div className="h-2 w-24 bg-gray-600 rounded mb-1"></div>
                                            <div className="h-2 w-16 bg-gray-600 rounded"></div>
                                        </div>

                                        {/* User Message */}
                                        <div className="bg-brand-orange/10 p-4 rounded-t-xl rounded-bl-xl rounded-br-none border border-brand-orange/20 self-end col-start-2 animate-fade-in-up delay-100">
                                            <div className="flex items-center justify-end gap-2 mb-2">
                                                <span className="text-xs text-brand-orange font-bold">Client</span>
                                                <div className="w-6 h-6 rounded-full bg-brand-orange/20 flex items-center justify-center">
                                                    <Users size={12} className="text-brand-orange" />
                                                </div>
                                            </div>
                                            <div className="h-2 w-20 bg-gray-600 rounded mb-1 ml-auto"></div>
                                        </div>

                                        {/* Stats/Summary */}
                                        <div className="col-span-2 bg-[#0B0F19] rounded-xl border border-gray-800 p-4 mt-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-400">Knowledge Base</span>
                                                <Database size={12} className="text-gray-500" />
                                            </div>
                                            <div className="flex gap-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="w-1/3 bg-brand-blue"></div>
                                                <div className="w-1/3 bg-brand-green"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <h3 className="text-3xl font-bold text-white mb-6">AI Enablement & Agent Support</h3>
                                <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                                    Future-proof your business by assessing where AI can genuinely help. We help you build client-facing chatbots, internal knowledge bases, and agent support tools.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Client-facing Chat Bots & Knowledge Bases",
                                        "Internal Agent Support & Summaries",
                                        "Assessment of AI opportunities for your specific model"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center flex-shrink-0">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Strategic Workshops / Why Us */}
            <section className="py-24 bg-[#FFFFF0] px-4">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-brand-blue mb-6">Why Broker Tools?</h2>
                            <p className="text-gray-800 text-lg mb-8">
                                We don’t sell software. We design workflow systems. We are independent and non-aggregator aligned, meaning our only goal is to make your business run better.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-green border border-brand-green shadow-lg">
                                    <Shield className="text-brand-blue flex-shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-brand-blue">Independent Advice</h4>
                                        <p className="text-sm text-brand-blue/80">No software bias or hidden commissions.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-green border border-brand-green shadow-lg">
                                    <Layout className="text-brand-blue flex-shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-brand-blue">Practical Design</h4>
                                        <p className="text-sm text-brand-blue/80">Built by people who understand compliance and deal flow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue to-purple-500 blur-2xl opacity-20 transform rotate-6 scale-90"></div>
                                <div className="bg-white p-2 rounded-lg -rotate-3 relative z-10 max-w-xs shadow-2xl">
                                    <div className="bg-[#F3F4F6] p-4 rounded text-gray-800">
                                        <div className="font-bold text-lg mb-2">Workflow Audit</div>
                                        <div className="space-y-2">
                                            <div className="h-2 bg-gray-300 rounded w-full"></div>
                                            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                                            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white">
                                                <Check size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#1F2937] p-4 rounded-lg rotate-3 absolute -bottom-6 -right-6 z-0 max-w-xs shadow-xl border border-gray-700">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs text-gray-300">System Live</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-brand-green"></div>
                                            <span className="text-xs text-gray-300">Automations Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section id="calendar-section" className="py-24 relative overflow-hidden bg-brand-blue px-4">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                <div className="container mx-auto max-w-7xl text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-orange mb-6">Ready to Optimise the Way you Work?</h2>
                    <p className="text-xl text-brand-green mb-12 max-w-2xl mx-auto">
                        Book a free Workflow Assessment today.
                        <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white">
                            No pressure. Just practical advice on how to optimise your broker business.</span>
                    </p>

                    <div className="bg-white rounded-xl max-w-6xl mx-auto min-h-[800px] overflow-hidden shadow-2xl">
                        <iframe
                            src="https://link.hubboss.io/widget/booking/Sx2Pgv0BzuVIHMo0PhHp"
                            style={{ width: '100%', height: '900px', border: 'none', overflow: 'hidden' }}
                            scrolling="no"
                            id="Sx2Pgv0BzuVIHMo0PhHp_1766275314756"
                        ></iframe>
                        <script src="https://link.hubboss.io/js/form_embed.js" type="text/javascript"></script>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-[#fffff0] px-4 border-t border-brand-blue/10">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-brand-blue mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "What happens during the assessment session?",
                                a: "We dive deep into your current processes to identify bottlenecks. You'll walk away with a clear roadmap of what to automate, what to delegate, and what to eliminate."
                            },
                            {
                                q: "Do I need to switch my current CRM?",
                                a: "No. We assess your current tech stack first. Often the issue isn't the tool but how it's set up. If a switch is needed for your growth goals, we'll explain why and how."
                            },
                            {
                                q: "Is the session really free?",
                                a: "Yes. It's a discovery call to see if we're a good fit. At the end of the day, there is nuances to every business and we need to understand your specific needs to provide the best possible solution."
                            },
                            {
                                q: "How long does a typical implementation take?",
                                a: "It depends on the complexity of your workflow. Simple optimizations can be done in days, while full CRM migrations and custom automation builds might take 8-12 weeks."
                            },
                            {
                                q: "Do you work with aggregators?",
                                a: (
                                    <>
                                        If the Aggregator software has an API, Webhook, Zapier or other way to integrate with them - then yes we build systems to integrate with your Aggregator.
                                        <br /><br />
                                        It's a big sticking point for most Brokers in automating their workflow and though AI Agents can do browser actions on your behalf, most Aggregators don't like this as it can introduce system vunerabilities. So we need to find a balance between automating the way you work and data safety.
                                    </>
                                )
                            },
                            {
                                q: "What is the difference between a Broker Coach and Broker Tools?",
                                a: (
                                    <>
                                        This really comes down to what does your business need. <br /><br />
                                        We are not coaches, if you need someone to keep you and your team accountable for your growth goals, view our <Link href="/search/coach" className="underline text-brand-blue hover:text-brand-orange">Broker Coaches/Mentors</Link>.
                                        <br /><br />
                                        Think of us like as short-term Project Managers, we help systemise and scale the way you work. Allowing you the chance to breathe and set your own growth trajectory. We design CRMs, Client Onboarding and Workflow Automations. Anything outside of that, we partner with your support team or one of our service provider partners.
                                    </>
                                )
                            }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-white rounded-xl border-2 border-gray-400 open:border-brand-blue transition-colors">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-lg font-medium text-brand-blue group-hover:text-brand-orange transition-colors">
                                    {faq.q}
                                    <ChevronRight className="transform group-open:rotate-90 transition-transform text-gray-400 group-open:text-brand-orange" />
                                </summary>
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Disclaimer */}
            <section className="py-8 bg-cream px-4 border-t border-brand-blue/10">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-4">
                        <h2 className="text-m font-bold text-brand-blue">Disclaimer</h2>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Broker Tools' Workflow Optimisation Program is designed to support brokers in reviewing their workflows, systems, and operational options. As part of the program, we may present a range of tools, services, or approaches and, where appropriate, share our perspective on how different options may fit common broker workflows.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            These insights are provided for decision support and educational purposes only. While we aim to offer thoughtful, experience-informed guidance, final decisions remain entirely yours. Broker Tools does not make decisions on your behalf, mandate specific tools, or assume responsibility for implementation choices.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Broker Tools does not provide financial, legal, tax, or compliance advice, and does not control or oversee any third-party providers. Outcomes will vary based on individual circumstances, business practices, and execution.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            You are encouraged to apply your own professional judgement and conduct appropriate due diligence before adopting or changing any systems or processes.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}
