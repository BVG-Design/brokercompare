import type { Metadata } from 'next';
import Image from 'next/image';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import Link from 'next/link';

type SlideProps = {
    id: string;
    number?: string;
    title: string;
    children: ReactNode;
    tone?: 'dark' | 'muted' | 'gold' | 'green';
};

export const metadata: Metadata = {
    title: 'Why Broker Tools | Decision Frameworks for Brokers',
    description:
        'Discover the decision lenses, methodologies, and ethical rules behind Broker Tools. Learn how we guide brokers with JTBD, ROI, MoSCoW, and lean experimentation.',
    keywords: [
        'why broker tools',
        'broker workflow',
        'mortgage broker software',
        'broker decision frameworks',
        'JTBD for brokers',
        'MoSCoW prioritisation',
        'lean experiments',
        'broker ROI',
        'broker tech stack',
        'ethical broker recommendations',
    ],
    openGraph: {
        title: 'Why Broker Tools | Decision Frameworks for Brokers',
        description:
            'We operate on clear methodologies to help brokers pick and prove the tools that speed up settlement. Explore our five decision lenses and how we test safely.',
        url: 'https://brokertools.com.au/why-broker-tools',
        siteName: 'Broker Tools',
        type: 'website',
    },
};

function Slide({ id, number, title, children, tone = 'dark' }: SlideProps) {
    return (
        <section id={id} aria-labelledby={`${id}-title`} className="relative scroll-m-24">
            {number ? (
                <div className="absolute left-0 top-6 hidden -translate-x-6 rounded-full border border-brand-orange/60 bg-brand-blue px-2 py-1 text-sm font-semibold text-brand-cream sm:block">
                    {number}
                </div>
            ) : null}
            <div
                className={clsx(
                    'rounded-3xl border p-6 shadow-xl ring-1',
                    tone === 'dark' && 'border-brand-blue/25 bg-brand-blue text-brand-cream ring-brand-blue/30',
                    tone === 'muted' && 'border-brand-blue/15 bg-brand-grey text-brand-blue ring-brand-blue/20',
                    tone === 'gold' && 'border-brand-orange/40 bg-brand-orange text-brand-blue ring-brand-orange/40',
                    tone === 'green' && 'border-brand-green/50 bg-brand-green text-brand-blue ring-brand-green/40'
                )}
            >
                <h2
                    id={`${id}-title`}
                    className={clsx(
                        'text-3xl font-bold tracking-tight',
                        tone === 'dark' ? 'text-brand-cream' : 'text-brand-blue'
                    )}
                >
                    {title}
                </h2>
                <div
                    className={clsx(
                        'mt-4 space-y-4 text-base leading-relaxed',
                        tone === 'dark' ? 'text-brand-cream/90' : 'text-brand-blue/90'
                    )}
                >
                    {children}
                </div>
            </div>
        </section>
    );
}

export default function WhyBrokerToolsPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-brand-cream text-brand-blue">
            <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-16 lg:px-8">
                <Slide id="methodology" >
                    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                        <div className="overflow-hidden rounded-2xl border border-brand-blue/20 bg-brand-blue/10 shadow-inner shadow-black/10">
                            <Image
                                src="https://images.unsplash.com/photo-1529119368496-2dfda6ec2804?auto=format&fit=crop&w=900&q=80"
                                alt="Team reviewing a methodology board"
                                width={900}
                                height={640}
                                className="h-full w-full object-cover"
                                priority
                            />
                        </div>
                        <div className="flex flex-col justify-between gap-6 rounded-2xl bg-brand-blue p-6 shadow-inner shadow-black/20 ring-1 ring-brand-blue/30">
                            <div className="space-y-3 text-xl leading-relaxed">
                                <h3 className="text-2xl font-bold text-brand-white">How do you decide what tools, software or services to use in your Broker business?</h3>
                                <br /><p className="font-italic text-brand-cream">
                                    The job of a being Broker is the same for everyone -- However, the operating systems, aggregator requirements and processes change based on size, goals and interest in technology.
                                </p><br />
                                <p className="text-brand-cream/90">
                                    At Broker Tools, we use five lenses, inspired by the product design world, adapted to the Mortage, Asset and Commercial finance industries. <br /><br /><p>
                                        These form the Methodologies we use to recommendation products, services and software. </p>
                                </p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-brand-green/100 bg-brand-green/100 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    We optimise so workflows feel light, fast, and intuitive.
                                </div>
                                <div className="rounded-xl border border-brand-cream/100 bg-brand-cream/100 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    We test in low-risk ways before asking you to invest heavily.
                                </div>
                                <div className="rounded-xl border border-brand-orange/100 bg-brand-orange/100 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    We are explicit about how decisions are made - no hidden agendas.
                                </div>
                            </div>
                        </div>
                    </div>
                </Slide>

                <Slide id="why-us" number="01" title="Why Broker Tools" tone="muted">
                    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                        <div className="space-y-4">
                            <p className="font-semibold text-brand-blue">We love systems and processes that optimise the way you work.</p>
                            <p>
                                There is a little buzz we get from leveraging your current systems and processes with AI and Workflow Automations. This allows us to remove any headaches, bottlenecks, or clunky Broker processes - by streamlining your CRM Design. <br /> <br />We achieve this through taking a practical approach to researching, planning and recommending products and service that work well for you.
                            </p>
                            <p className="font-semibold text-brand-orange">
                                Do we use AI to recommend the workflow or services? No.
                            </p>
                            <p className="font-italic text-brand-blue"> Not because we don't want to but in our test so far, it hasn't been reliable in giving the "right" recommendation. See our test here: Why AI can't recommend your broker tool stack - yet!</p>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-brand-blue/15 bg-brand-cream shadow-inner shadow-black/5">
                            <Image
                                src="https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=840&q=80"
                                alt="Collaborative meeting between brokers and analysts"
                                width={840}
                                height={520}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </Slide>

                <Slide id="lenses" number="02" title="Our Five Decision Lenses" tone="gold">
                    <p className="text-m font-italic text-brand-blue">
                        Every recommendation is stress-tested through five lenses. Together they reveal if a tool meets the businesses needs, creates focus and supports your long term goals.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            { title: 'Jobs To Be Done (JTBD)', desc: "Does the product solve the broker's real job to be done?" },
                            { title: 'Energy ROI', desc: 'Does it give more energy back than it consumes?' },
                            { title: 'Focus & Leverage', desc: 'Does it amplify the scarce resources that matter most?' },
                            { title: 'Requirements Clarity (MoSCoW)', desc: 'Is what you need explicit before we shortlist options?' },
                            { title: 'Safe Testing (Lean Experiments)', desc: 'Can we prove value fast, without heavy risk?' },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-brand-blue/15 bg-brand-cream px-4 py-3 text-sm shadow-inner shadow-black/5"
                            >
                                <p className="text-sm font-semibold text-brand-blue">{item.title}</p>
                                <p className="mt-2 text-brand-blue/80">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </Slide>

                <Slide id="jtbd" number="03" title="Lens 1: Jobs To Be Done (JTBD)">
                    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-stretch">
                        <div className="h-full min-h-[360px] rounded-2xl border border-brand-blue/15 bg-brand-cream p-5 shadow-inner shadow-black/5">
                            <Image
                                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80"
                                alt="image looking out to the mountain view of jobs to be done"
                                width={900}
                                height={900}
                                className="h-full w-full rounded-xl object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="font-bold text-brand-white">The TOP 3 JOBS to be done are:</p>
                            <p>
                                1. Lead Nurturing <br />
                                2. Data Capturing <br />
                                3. Credit Assessment and Submission <br /> <br /> Followed by settlement confirmation, finalisation and ongoing maintence. How do you achieve this?
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-brand-green/100 bg-brand-green/100 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    1. CRMs: they manage lead intake, deal momentum, data clarity, client updates.
                                </div>
                                <div className="rounded-xl border border-brand-orange/100 bg-brand-orange/100 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    2. Fact Finds & Doc Collection: support data gathering forms and compliance matching
                                </div>
                            </div>
                            <div className="rounded-xl border border-brand-cream/100 bg-brand-cream/100 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                3. AI Recommendation Summaries, Virtual Assistants (human) and Bank Partnerships
                            </div>
                        </div>
                    </div>
                </Slide>

                <Slide id="energy-roi" number="04" title="Lens 2: Energy ROI">
                    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                        <div className="space-y-4">
                            <p className="font-semibold text-brand-white">How much time do you have to process all of this?</p>
                            <p>
                                We prioritise tools that remove fatigue - fewer clicks, clearer dashboards, faster client updates, and less double-handling.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-brand-cream/80 bg-brand-cream/90 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    Criteria: speed to settlement, lift in customer satisfaction, less back-and-forth, clearer notes.
                                </div>
                                <div className="rounded-xl border border-brand-orange/60 bg-brand-orange/80 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    The payoff: workflows that give brokers more time and headspace.
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-brand-blue/15 bg-brand-blue p-5 shadow-inner shadow-black/5">
                            <Image
                                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=760&q=80"
                                alt="Broker walking confidently through an office"
                                width={360}
                                height={220}
                                className="h-full w-full rounded-xl object-cover"
                            />
                        </div>
                    </div>
                </Slide>

                <Slide id="focus-leverage" number="05" title="Lens 3: Focus & Leverage" tone="green">
                    <p className="text-brand-blue/90">Does the solution optimise the way the broker works?</p>
                    <div className="grid gap-4 md:grid-cols-3">
                        {[
                            { title: 'Client Experience', desc: 'Real-time updates, mobile access and visibility of progress that builds trust.' },
                            { title: 'Bottleneck Removal', desc: 'Remove double data entry, automate system notifications, and shorten approval times.' },
                            { title: 'Revenue Momentum', desc: 'Faster lead-to-settlement cycles with smarter prioritisation and automation.' },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-brand-blue/15 bg-brand-cream px-4 py-3 text-sm shadow-inner shadow-black/5"
                            >
                                <p className="text-sm font-semibold text-brand-blue">{item.title}</p>
                                <p className="mt-2 text-brand-blue/80">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-xl border border-brand-orange/60 bg-brand-orange/90 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                        This lens keeps every recommendation centred on client delight, time saved and revenue - while using "cool tech" if needed.
                    </div>
                </Slide>

                <Slide id="moscow" number="06" title="Lens 4: Requirements Clarity (MoSCoW)">
                    <div className="space-y-4">
                        <p className="font-semibold text-brand-white">
                            Features: What we need for the software or service to be a win? What can wait? What gets rejected?
                        </p>
                        <p>
                            We write MoSCoW statements before shortlisting services or programs. It keeps demos honest and stop-checks scope creep so you buy only what you need.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { label: 'Must Have', text: 'Non-negotiables for compliance, data quality, and speed to settlement.' },
                                { label: 'Should Have', text: 'Valuable features that unlock efficiency within 90 days.' },
                                { label: 'Could Have', text: 'Nice-to-have capabilities for later phases or team expansion.' },
                                { label: 'Would Be Nice', text: 'Future bets that we keep on the radar without delaying the rollout.' },
                                { label: 'Must Not Have', text: 'Habits or add-ons that slow the broker or create busy work.' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-brand-orange/20 bg-brand-cream px-4 py-3 text-sm shadow-inner shadow-black/5"
                                >
                                    <p className="font-semibold text-brand-blue">{item.label}</p>
                                    <p className="mt-2 text-brand-blue/80">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl border border-brand-green/40 bg-brand-green/80 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                            We use MoSCoW to score, rate and prioritised what matters most to you
                        </div>
                    </div>
                </Slide>

                <Slide id="lean-testing" number="07" title="Lens 5: Safe Testing (Lean Experiments)">
                    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch">
                        <div className="space-y-4">
                            <p className="font-semibold text-brand-white">
                                Test and tweak, how quickly can we confirm the software or service is the right one for you?
                            </p>
                            <p>We design lean experiments with a clear hypothesis, a small operational test, and a single success metric.</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-brand-green/80 bg-brand-green/80 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    Workflows: run pipeline demos, test data capture structure, and observable before/after comparisons.
                                </div>
                                <div className="rounded-xl border border-brand-green/80 bg-brand-green/80 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                    Success Metrics: speed-to-yes, admin time saved, commitment to service, or error reduction.
                                </div>
                            </div>
                            <div className="rounded-xl border border-brand-orange/80 bg-brand-orange/80 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                Confirm a rollout plan, select a systems advocate and build an operations knowledge base.
                            </div>
                        </div>
                        <div className="h-full min-h-[360px] rounded-2xl border border-brand-blue/15 bg-brand-cream p-5 shadow-inner shadow-black/5">
                            <Image
                                src="https://images.unsplash.com/photo-1528784351875-d797d86873a1?auto=format&fit=crop&w=900&q=80"
                                alt="image bike on beach representing safe testing"
                                width={900}
                                height={900}
                                className="h-full w-full rounded-xl object-cover"
                            />
                        </div>
                    </div>
                </Slide>

                <Slide id="why-it-matters" number="08" title="Why This Matters for Brokers">
                    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-3">
                            <p>When we apply the five lenses, brokers experience:</p>
                            <ul className="space-y-3 text-brand-white/90">
                                {[
                                    'Fewer tools, better adoption, and lower fatigue.',
                                    'Cleaner data and faster settlements.',
                                    'Confident service agreements with crystal-clear requirements.',
                                    'Experiments that prove value before committing budget.',
                                    'Stronger client trust through consistent updates and outcomes.',
                                ].map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-brand-orange" aria-hidden />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-brand-blue/15 bg-brand-cream p-5 shadow-inner shadow-black/5">
                            <div className="rounded-xl border border-brand-green/40 bg-brand-green/20 px-4 py-3 text-sm font-semibold text-brand-blue shadow">
                                Our approach: aligned incentives, transparent criteria, and decisions grounded in the broker's reality.
                            </div>
                            <p className="font-bold text-brand-orange">
                                The result: systems that make brokers more profitable, clients more confident, and teams more energised.
                            </p>
                        </div>
                    </div>
                </Slide>

                <Slide id="workflow-review" title="Ready to update your work process?" tone="muted">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4 max-w-3xl">
                            <p className="text-lg font-semibold text-brand-blue">
                                Book a Workflow Review
                            </p>
                            <p className="text-brand-blue/80">
                                Let's map the jobs to be done, set the MoSCoW, and design systems that proves ROI.
                            </p>
                        </div>
                        <Link
                            href="/workflow-optimisation"
                            className="inline-flex items-center justify-center rounded-xl bg-brand-blue px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-blue/40 transition hover:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                        >
                            Book a Workflow Review
                        </Link>
                    </div>
                </Slide>
            </div>
        </main>
    );
}
