"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Copy, Wallet } from "lucide-react";
import { useCasper } from "@/components/providers";
import { useEffect, useState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { isConnected, activeKey, connect, disconnect } = useCasper();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Marketplace", href: "/marketplace" },
        { name: "Institutional", href: "/institutional" },
        { name: "Developers", href: "/developers" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-serif text-2xl font-bold text-flow-blue tracking-tight">FlowFi</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-flow-cyan ${pathname === link.href ? "text-flow-blue font-semibold" : "text-slate-500"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Wallet Connection */}
                <div>
                    {!isConnected ? (
                        <button
                            onClick={connect}
                            className="px-6 py-2.5 rounded-full border border-flow-blue text-flow-blue font-medium text-sm transition-all hover:bg-flow-blue hover:text-white hover:shadow-lg hover:shadow-flow-blue/20"
                        >
                            Connect Wallet
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-xs text-slate-400 font-medium">Connected</span>
                                <span className="text-xs font-mono text-flow-blue">
                                    {activeKey?.slice(0, 6)}...{activeKey?.slice(-4)}
                                </span>
                            </div>
                            <button
                                onClick={disconnect}
                                className="p-2 rounded-full bg-slate-100 text-flow-blue hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Disconnect"
                            >
                                <Wallet className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
