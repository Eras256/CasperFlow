"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2,
    Cpu,
    Database,
    Globe,
    Layers,
    Terminal,
    Copy,
    Check,
    ExternalLink,
    ChevronRight,
    Zap,
    Shield,
    GitBranch,
    BookOpen,
    ArrowRight,
    Download
} from "lucide-react";
import { Card3D, GlowingCard } from "@/components/immersive/cards";
import AnimatedText, {
    AnimatedWords,
    FadeInSection,
    AnimatedLine
} from "@/components/immersive/animated-text";
import { MagneticButton, StaggerContainer, ScaleOnScroll } from "@/components/immersive/smooth-scroll";

export default function Developers() {
    const [copied, setCopied] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"api" | "sdk" | "contracts">("api");

    const copyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const quickStart = [
        {
            title: "NodeOps AI Agent",
            description: "Deploy our risk scoring agent to your own NodeOps cluster in one click.",
            icon: Terminal,
            code: "nodeops deploy flowfi-agent",
            gradient: "from-[var(--flow-cyan)] to-[var(--flow-blue)]",
        },
        {
            title: "Casper SDK",
            description: "Interact with minted invoices using our unified TypeScript client.",
            icon: Code2,
            code: "npm install @flowfi/sdk",
            gradient: "from-[var(--flow-purple)] to-[var(--flow-pink)]",
        },
    ];

    const apiEndpoints = [
        {
            title: "Analyze Invoice",
            method: "POST",
            path: "/api/analyze",
            description: "Upload and analyze a PDF invoice with AI risk scoring",
            icon: Cpu,
        },
        {
            title: "Mint NFT",
            method: "POST",
            path: "/api/contract/mint",
            description: "Mint a verified invoice as a CEP-78 NFT on Casper",
            icon: Database,
        },
        {
            title: "List Invoices",
            method: "GET",
            path: "/api/contract/list",
            description: "Retrieve all minted invoices from the registry",
            icon: Layers,
        },
        {
            title: "Get Risk Score",
            method: "GET",
            path: "/api/risk/:id",
            description: "Fetch the AI-generated risk score for a specific invoice",
            icon: Shield,
        },
        {
            title: "Deploy Transaction",
            method: "POST",
            path: "/api/deploy",
            description: "Send a signed deploy to the Casper Network",
            icon: Globe,
        },
        {
            title: "Check Status",
            method: "GET",
            path: "/api/deploy/:hash",
            description: "Check the status of a submitted transaction",
            icon: Zap,
        },
    ];

    const sdkExamples = [
        {
            title: "Initialize Client",
            code: `import { FlowFi } from '@flowfi/sdk';

const client = new FlowFi({
  network: 'casper-test',
  contractHash: 'YOUR_CONTRACT_HASH',
});`,
        },
        {
            title: "Analyze Invoice",
            code: `const analysis = await client.analyze({
  file: invoicePDF,
  options: {
    useQuantumScore: true,
    model: 'gemini-pro',
  }
});

console.log(analysis.riskScore); // "A+"
console.log(analysis.valuation);  // 12500`,
        },
        {
            title: "Mint NFT",
            code: `const result = await client.mint({
  invoiceId: 'INV-8821',
  metadata: {
    riskScore: 'A+',
    valuation: 12500,
    vendor: 'TechCorp Inc.',
  },
  signer: casperWallet,
});

console.log(result.deployHash);`,
        },
    ];

    const contractMethods = [
        { name: "mint", params: "(token_owner: Key, token_meta_data: String)" },
        { name: "transfer", params: "(token_id: u64, source_key: Key, target_key: Key)" },
        { name: "burn", params: "(token_id: u64)" },
        { name: "approve", params: "(spender: Key, token_id: u64)" },
        { name: "balance_of", params: "(owner: Key) -> u64" },
        { name: "owner_of", params: "(token_id: u64) -> Key" },
    ];

    const resources = [
        {
            title: "GitHub Repository",
            description: "View source code, report issues, and contribute",
            icon: GitBranch,
            href: "#",
        },
        {
            title: "API Documentation",
            description: "Complete reference for all endpoints",
            icon: BookOpen,
            href: "#",
        },
        {
            title: "Casper Testnet",
            description: "View deployed contracts on explorer",
            icon: Globe,
            href: "https://testnet.cspr.live",
        },
    ];

    return (
        <div className="min-h-screen relative">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--flow-purple)] opacity-5 blur-[200px] rounded-full" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--flow-cyan)] opacity-5 blur-[200px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="max-w-4xl mb-16">
                    <FadeInSection>
                        <span className="badge-premium mb-4 inline-block">Developer Resources</span>
                    </FadeInSection>

                    <AnimatedWords className="text-5xl md:text-6xl font-bold font-display mb-6">
                        Build on FlowFi
                    </AnimatedWords>

                    <FadeInSection delay={0.2}>
                        <p className="text-xl text-[var(--flow-text-secondary)] max-w-2xl leading-relaxed">
                            Integrate AI-scored RWA liquidity into your own dApps. Use our SDK, APIs,
                            and Casper smart contracts to build the next generation of trade finance applications.
                        </p>
                    </FadeInSection>
                </div>

                {/* Quick Start Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-20">
                    {quickStart.map((item, i) => (
                        <FadeInSection key={i} delay={i * 0.1}>
                            <Card3D className="h-full">
                                <div className={`rounded-2xl p-8 h-full bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
                                    {/* Pattern Overlay */}
                                    <div className="absolute inset-0 bg-grid opacity-20" />

                                    <div className="relative z-10">
                                        <item.icon className="w-12 h-12 text-white mb-6" />
                                        <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                        <p className="text-white/80 mb-6">{item.description}</p>

                                        <div className="flex items-center gap-2 p-4 rounded-xl bg-black/30 backdrop-blur-sm">
                                            <code className="flex-grow font-mono text-sm text-white">{item.code}</code>
                                            <button
                                                onClick={() => copyCode(item.code, item.title)}
                                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            >
                                                {copied === item.title ? (
                                                    <Check className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-white/60" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card3D>
                        </FadeInSection>
                    ))}
                </div>

                {/* Tabs Navigation */}
                <div className="mb-12">
                    <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 inline-flex">
                        {[
                            { key: "api", label: "REST API" },
                            { key: "sdk", label: "SDK" },
                            { key: "contracts", label: "Smart Contracts" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === tab.key
                                        ? "bg-gradient-to-r from-[var(--flow-cyan)] to-[var(--flow-purple)] text-white"
                                        : "text-[var(--flow-text-secondary)] hover:text-white"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* API Tab */}
                    {activeTab === "api" && (
                        <motion.div
                            key="api"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">API Reference</h2>

                            {apiEndpoints.map((api, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <GlowingCard className="rounded-xl overflow-hidden">
                                        <div className="bg-[var(--flow-bg-secondary)] p-6 flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[var(--flow-cyan)]">
                                                <api.icon className="w-6 h-6" />
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-white">{api.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${api.method === "POST"
                                                            ? "bg-[var(--flow-cyan)]/20 text-[var(--flow-cyan)]"
                                                            : "bg-[var(--flow-green)]/20 text-[var(--flow-green)]"
                                                        }`}>
                                                        {api.method}
                                                    </span>
                                                </div>
                                                <code className="text-sm text-[var(--flow-text-muted)] font-mono">{api.path}</code>
                                                <p className="text-sm text-[var(--flow-text-secondary)] mt-2">{api.description}</p>
                                            </div>

                                            <button className="flex items-center gap-2 text-sm text-[var(--flow-cyan)] hover:underline">
                                                Docs <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </GlowingCard>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* SDK Tab */}
                    {activeTab === "sdk" && (
                        <motion.div
                            key="sdk"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">SDK Examples</h2>

                            {sdkExamples.map((example, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="rounded-2xl overflow-hidden border border-white/10">
                                        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                                            <h3 className="font-bold text-white">{example.title}</h3>
                                            <button
                                                onClick={() => copyCode(example.code, example.title)}
                                                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-[var(--flow-text-muted)]"
                                            >
                                                {copied === example.title ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-[var(--flow-green)]" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className="p-6 bg-[var(--flow-bg-primary)]">
                                            <pre className="text-sm font-mono text-[var(--flow-text-secondary)] overflow-x-auto">
                                                <code>{example.code}</code>
                                            </pre>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Contracts Tab */}
                    {activeTab === "contracts" && (
                        <motion.div
                            key="contracts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">CEP-78 Smart Contract</h2>

                            <GlowingCard className="rounded-2xl mb-8">
                                <div className="bg-[var(--flow-bg-secondary)] p-8 rounded-2xl">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-bold text-white mb-4">Contract Info</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: "Contract Type", value: "CEP-78 Enhanced NFT" },
                                                    { label: "Collection Name", value: "FlowFi Invoices" },
                                                    { label: "Symbol", value: "FLOW" },
                                                    { label: "Network", value: "Casper Testnet" },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex justify-between">
                                                        <span className="text-[var(--flow-text-muted)]">{item.label}</span>
                                                        <span className="text-white font-mono">{item.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-white mb-4">Entry Points</h3>
                                            <div className="space-y-2">
                                                {contractMethods.map((method, i) => (
                                                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                                        <code className="text-sm">
                                                            <span className="text-[var(--flow-cyan)]">{method.name}</span>
                                                            <span className="text-[var(--flow-text-muted)]">{method.params}</span>
                                                        </code>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </GlowingCard>

                            {/* Contract Hash Display */}
                            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--flow-text-muted)]">Contract Package Hash</span>
                                    <button
                                        onClick={() => copyCode("113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623", "hash")}
                                        className="text-[var(--flow-cyan)] hover:underline text-sm flex items-center gap-1"
                                    >
                                        {copied === "hash" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        Copy
                                    </button>
                                </div>
                                <code className="text-sm font-mono text-white break-all">
                                    113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623
                                </code>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Resources Section */}
                <section className="mt-20 pt-20 border-t border-white/10">
                    <FadeInSection>
                        <h2 className="section-title mb-8">Resources</h2>
                    </FadeInSection>

                    <StaggerContainer className="grid md:grid-cols-3 gap-6" stagger={0.1}>
                        {resources.map((resource, i) => (
                            <div key={i} data-stagger-item>
                                <Card3D className="h-full">
                                    <a
                                        href={resource.href}
                                        target={resource.href.startsWith("http") ? "_blank" : undefined}
                                        rel={resource.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        className="glass rounded-2xl p-8 h-full border border-white/10 flex flex-col group hover:border-[var(--flow-cyan)]/30 transition-all"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--flow-cyan)]/20 to-[var(--flow-purple)]/20 flex items-center justify-center mb-6 text-[var(--flow-cyan)] group-hover:scale-110 transition-transform">
                                            <resource.icon className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                            {resource.title}
                                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-sm text-[var(--flow-text-secondary)]">{resource.description}</p>
                                    </a>
                                </Card3D>
                            </div>
                        ))}
                    </StaggerContainer>
                </section>

                {/* CTA */}
                <section className="mt-20">
                    <ScaleOnScroll>
                        <div className="glass rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--flow-cyan)] via-[var(--flow-purple)] to-[var(--flow-pink)]" />

                            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build?</h2>
                            <p className="text-[var(--flow-text-secondary)] mb-8 max-w-lg mx-auto">
                                Join our developer community and start integrating FlowFi into your applications today.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <MagneticButton>
                                    <button className="btn-primary flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Download SDK
                                    </button>
                                </MagneticButton>
                                <MagneticButton>
                                    <button className="btn-secondary flex items-center gap-2">
                                        Join Discord
                                    </button>
                                </MagneticButton>
                            </div>
                        </div>
                    </ScaleOnScroll>
                </section>
            </div>
        </div>
    );
}
