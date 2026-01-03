"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 lg:pt-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">

                        {/* Text Content */}
                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight text-flow-blue mb-6">
                                Liquidity at the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-flow-blue to-flow-cyan">Speed of AI.</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                Transform unpaid invoices into instant working capital using <span className="font-semibold text-flow-blue">Casper Network's</span> enterprise-grade security and <span className="font-semibold text-flow-blue">NodeOps AI</span> risk scoring.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/dashboard"
                                    className="px-8 py-4 bg-flow-blue text-white rounded-full font-medium hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-flow-blue/20 flex items-center gap-2"
                                >
                                    Get Funded <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/marketplace"
                                    className="px-8 py-4 bg-white text-flow-blue border border-flow-blue/20 rounded-full font-medium hover:bg-flow-blue/5 transition-all"
                                >
                                    Start Investing
                                </Link>
                            </div>
                        </motion.div>

                        {/* Visual: Tilted Glass Card */}
                        <motion.div
                            className="lg:w-1/2 flex justify-center perspective-1000"
                            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                            animate={{ opacity: 1, scale: 1, rotateY: -10 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ perspective: 1000 }}
                        >
                            <motion.div
                                className="relative w-80 h-[480px] glass rounded-2xl p-8 border border-white/40 shadow-2xl flex flex-col justify-between"
                                animate={{ rotateY: [-10, 10, -10], y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-flow-cyan/20 blur-3xl rounded-full -z-10" />

                                {/* Card Content */}
                                <div>
                                    <div className="w-12 h-12 rounded-full bg-flow-blue/10 flex items-center justify-center mb-6">
                                        <Zap className="text-flow-blue w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">Invoice #8821</h3>
                                    <p className="text-sm text-slate-500">Issued to: <span className="font-semibold text-slate-700">TechCorp Inc.</span></p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm text-slate-500">Value</div>
                                        <div className="text-3xl font-bold text-flow-blue font-mono">$10,000</div>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-flow-cyan"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "85%" }}
                                            transition={{ duration: 2, delay: 1 }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-flow-blue/70">
                                        <span>Risk Score: A+</span>
                                        <span>Tokenized</span>
                                    </div>
                                </div>

                                {/* Floating Elements simulated */}
                                <motion.div
                                    className="absolute -right-12 top-20 glass p-4 rounded-xl shadow-lg border border-white/50"
                                    animate={{ y: [0, 15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                >
                                    <span className="text-2xl font-bold text-green-500">+12% APY</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white/50 backdrop-blur-sm border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Zap, title: "Instant Liquidity", desc: "Skip the 90-day wait. Get paid in minutes, not months." },
                            { icon: ShieldCheck, title: "AI Risk Scoring", desc: "NodeOps AI analyzes thousands of data points to verify every invoice." },
                            { icon: TrendingUp, title: "RWA Yield", desc: "Earn consistent, high-yield returns backed by real-world assets." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="w-14 h-14 rounded-xl bg-flow-blue/5 flex items-center justify-center mb-6 text-flow-blue">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
