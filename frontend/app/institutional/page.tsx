"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
    Building2,
    Landmark,
    PieChart,
    ShieldCheck,
    TrendingUp,
    Users,
    Lock,
    Globe,
    BarChart3,
    FileCheck,
    Wallet,
    ArrowRight,
    CheckCircle,
    ExternalLink
} from "lucide-react";
import { Card3D, GlowingCard, StatsCard } from "@/components/immersive/cards";
import AnimatedText, {
    AnimatedWords,
    AnimatedCounter,
    FadeInSection,
    AnimatedLine
} from "@/components/immersive/animated-text";
import { MagneticButton, StaggerContainer, ScaleOnScroll } from "@/components/immersive/smooth-scroll";

export default function Institutional() {
    const heroRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const stats = [
        { label: "Volume Traded", val: 142, suffix: "M+", prefix: "$", icon: PieChart },
        { label: "Avg. Default Rate", val: 0.08, suffix: "%", decimals: 2, icon: ShieldCheck },
        { label: "Active Investors", val: 500, suffix: "+", icon: Users },
        { label: "Avg. Processing", val: 30, suffix: "sec", icon: TrendingUp },
    ];

    const features = [
        {
            title: "KYC/AML Compliance",
            desc: "Full regulatory compliance with automated identity verification for all participants via CasperID. SOC2 Type II certified.",
            icon: ShieldCheck,
            color: "var(--flow-cyan)",
        },
        {
            title: "Real-time Auditing",
            desc: "On-chain proof of every invoice with AI-powered fraud detection. Complete audit trail from minting to settlement.",
            icon: Landmark,
            color: "var(--flow-purple)",
        },
        {
            title: "Smart Portfolio Management",
            desc: "Automated rebalancing and yield optimization across invoice pools with risk-adjusted returns targeting 12-16% APY.",
            icon: TrendingUp,
            color: "var(--flow-green)",
        },
        {
            title: "Institutional API Access",
            desc: "Full JSON-RPC and REST API access for seamless integration with your existing trading systems and TMS platforms.",
            icon: Building2,
            color: "var(--flow-pink)",
        },
        {
            title: "Segregated Custody",
            desc: "Multi-signature wallet infrastructure with institutional-grade cold storage. Assets never commingled.",
            icon: Lock,
            color: "var(--flow-orange)",
        },
        {
            title: "Global Settlement",
            desc: "T+0 settlement on Casper Network. Multi-currency support with built-in FX hedging options.",
            icon: Globe,
            color: "var(--flow-blue)",
        },
    ];

    const investorTypes = [
        {
            title: "Banks & Asset Managers",
            description: "Allocate to verified trade finance assets with institutional-grade security and compliance.",
            icon: Landmark,
        },
        {
            title: "Hedge Funds",
            description: "Access uncorrelated, high-yield RWA opportunities with programmatic trading support.",
            icon: BarChart3,
        },
        {
            title: "Family Offices",
            description: "Diversify portfolios with short-duration, secured receivables from verified counterparties.",
            icon: Wallet,
        },
        {
            title: "Pension Funds",
            description: "Generate stable yield with low volatility through AI-scored invoice pools.",
            icon: Users,
        },
    ];

    return (
        <div className="relative overflow-hidden">
            {/* ===== HERO SECTION ===== */}
            <section
                ref={heroRef}
                className="relative min-h-[80vh] flex items-center overflow-hidden"
            >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--flow-purple)]/20 via-[var(--flow-bg-primary)] to-[var(--flow-bg-primary)]" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-grid opacity-30" />

                {/* Floating Orbs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--flow-purple)] opacity-10 blur-[150px] rounded-full animate-orb-float" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[var(--flow-cyan)] opacity-10 blur-[150px] rounded-full animate-orb-float" style={{ animationDelay: '-5s' }} />

                <motion.div
                    className="container mx-auto px-6 relative z-10"
                    style={{ y: heroY, opacity: heroOpacity }}
                >
                    <div className="max-w-4xl">
                        <FadeInSection>
                            <span className="badge-premium mb-6 inline-block">Institutional</span>
                        </FadeInSection>

                        <AnimatedWords className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-8 leading-tight">
                            Institutional Grade RWA Liquidity
                        </AnimatedWords>

                        <FadeInSection delay={0.3}>
                            <p className="text-xl text-[var(--flow-text-secondary)] mb-10 max-w-2xl leading-relaxed">
                                FlowFi provides banks, hedge funds, and family offices with direct access to
                                short-term, high-yield trade finance assets on Casper Network's enterprise-grade infrastructure.
                            </p>
                        </FadeInSection>

                        <FadeInSection delay={0.5}>
                            <div className="flex flex-wrap gap-4">
                                <MagneticButton>
                                    <button className="btn-primary flex items-center gap-2">
                                        Request Access <ArrowRight className="w-4 h-4" />
                                    </button>
                                </MagneticButton>
                                <MagneticButton>
                                    <button className="btn-secondary flex items-center gap-2">
                                        Download Whitepaper <ExternalLink className="w-4 h-4" />
                                    </button>
                                </MagneticButton>
                            </div>
                        </FadeInSection>
                    </div>
                </motion.div>
            </section>

            {/* ===== STATS SECTION ===== */}
            <section className="relative py-8 -mt-20 z-20">
                <div className="container mx-auto px-6">
                    <ScaleOnScroll>
                        <div className="grid md:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <FadeInSection key={i} delay={i * 0.1}>
                                    <GlowingCard className="rounded-2xl h-full">
                                        <div className="bg-[var(--flow-bg-secondary)] p-8 rounded-2xl h-full">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--flow-cyan)]/20 to-[var(--flow-purple)]/20 flex items-center justify-center text-[var(--flow-cyan)]">
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <p className="text-4xl font-bold text-gradient mb-1">
                                                <AnimatedCounter
                                                    to={stat.val}
                                                    suffix={stat.suffix}
                                                    prefix={stat.prefix || ""}
                                                    decimals={stat.decimals || 0}
                                                />
                                            </p>
                                            <p className="text-sm text-[var(--flow-text-muted)]">{stat.label}</p>
                                        </div>
                                    </GlowingCard>
                                </FadeInSection>
                            ))}
                        </div>
                    </ScaleOnScroll>
                </div>
            </section>

            {/* ===== INVESTOR TYPES ===== */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <FadeInSection>
                            <span className="badge-success mb-4 inline-block">Who We Serve</span>
                        </FadeInSection>
                        <AnimatedWords className="section-title mb-6">
                            Built for Sophisticated Investors
                        </AnimatedWords>
                        <FadeInSection delay={0.2}>
                            <p className="section-subtitle mx-auto">
                                From traditional asset managers to crypto-native funds, FlowFi serves institutional capital seeking yield in verified real-world assets.
                            </p>
                        </FadeInSection>
                    </div>

                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
                        {investorTypes.map((type, i) => (
                            <div key={i} data-stagger-item>
                                <Card3D className="h-full">
                                    <div className="glass rounded-2xl p-8 h-full border border-white/10 group hover:border-[var(--flow-cyan)]/30 transition-all">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--flow-cyan)]/20 to-[var(--flow-purple)]/20 flex items-center justify-center mb-6 text-[var(--flow-cyan)] group-hover:scale-110 transition-transform">
                                            <type.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-3">{type.title}</h3>
                                        <p className="text-sm text-[var(--flow-text-secondary)] leading-relaxed">{type.description}</p>
                                    </div>
                                </Card3D>
                            </div>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-32 relative">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--flow-purple)]/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <FadeInSection>
                            <span className="badge-premium mb-4 inline-block">Enterprise Features</span>
                        </FadeInSection>
                        <AnimatedWords className="section-title mb-6">
                            Enterprise Infrastructure
                        </AnimatedWords>
                        <FadeInSection delay={0.2}>
                            <p className="section-subtitle mx-auto">
                                Built on Casper's upgradable smart contracts and NodeOps' secure AI pipelines with institutional-grade compliance.
                            </p>
                        </FadeInSection>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <FadeInSection key={i} delay={i * 0.1}>
                                <div className="flex gap-5">
                                    <div
                                        className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${feature.color}20`,
                                            color: feature.color,
                                        }}
                                    >
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                        <p className="text-[var(--flow-text-secondary)] leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COMPLIANCE SECTION ===== */}
            <section className="py-32">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <FadeInSection direction="left">
                            <span className="badge-success mb-4 inline-block">Compliance First</span>
                            <h2 className="section-title mb-6">
                                Regulatory Ready Infrastructure
                            </h2>
                            <p className="text-[var(--flow-text-secondary)] mb-8 leading-relaxed">
                                FlowFi is built with compliance at its core. Our infrastructure meets the stringent requirements of institutional investors and regulators worldwide.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "SOC2 Type II Certified Infrastructure",
                                    "GDPR and CCPA Compliant Data Handling",
                                    "AML/CFT Screening via CasperID",
                                    "Automated Tax Reporting (1099-K Ready)",
                                    "Multi-jurisdiction Legal Framework",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-[var(--flow-green)]" />
                                        <span className="text-white">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </FadeInSection>

                        <FadeInSection direction="right">
                            <Card3D>
                                <div className="glass rounded-3xl p-10 border border-white/10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--flow-cyan)] to-[var(--flow-purple)] flex items-center justify-center">
                                            <FileCheck className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Schedule a Demo</h3>
                                            <p className="text-[var(--flow-text-muted)]">See FlowFi in action</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <input
                                            type="text"
                                            placeholder="Company Name"
                                            className="input-glass"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Work Email"
                                            className="input-glass"
                                        />
                                        <select className="input-glass bg-white/5">
                                            <option value="">Select AUM Range</option>
                                            <option value="10m">$10M - $50M</option>
                                            <option value="50m">$50M - $100M</option>
                                            <option value="100m">$100M - $500M</option>
                                            <option value="500m">$500M+</option>
                                        </select>
                                    </div>

                                    <button className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white hover:opacity-90 transition-opacity">
                                        Request Demo
                                    </button>
                                </div>
                            </Card3D>
                        </FadeInSection>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <ScaleOnScroll>
                        <div className="glass rounded-3xl p-12 md:p-16 text-center border border-white/10 relative overflow-hidden">
                            {/* Gradient Decoration */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--flow-cyan)] via-[var(--flow-purple)] to-[var(--flow-pink)]" />

                            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[var(--flow-cyan)] opacity-10 blur-[100px] rounded-full" />
                            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[var(--flow-purple)] opacity-10 blur-[100px] rounded-full" />

                            <div className="relative z-10">
                                <h2 className="section-title mb-6 max-w-3xl mx-auto">
                                    Ready to Allocate to Real-World Assets?
                                </h2>
                                <p className="text-xl text-[var(--flow-text-secondary)] mb-10 max-w-2xl mx-auto">
                                    Join leading institutions already generating yield on verified trade finance assets.
                                </p>
                                <MagneticButton>
                                    <button className="btn-primary text-lg px-12 py-5">
                                        Contact Our Team
                                    </button>
                                </MagneticButton>
                            </div>
                        </div>
                    </ScaleOnScroll>
                </div>
            </section>
        </div>
    );
}
