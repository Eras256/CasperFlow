import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <span className="font-serif text-2xl font-bold text-white tracking-tight">FlowFi</span>
                        <p className="mt-4 text-slate-400 max-w-sm leading-relaxed">
                            Democratizing access to institutional-grade invoice factoring.
                            Powered by <span className="text-flow-cyan font-semibold">Casper Network</span> and secured by <span className="text-flow-cyan font-semibold">NodeOps AI</span>.
                        </p>
                    </div>

                    {/* Column 1 */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/dashboard" className="hover:text-flow-cyan transition-colors">Borrow</Link></li>
                            <li><Link href="/marketplace" className="hover:text-flow-cyan transition-colors">Invest</Link></li>
                            <li><Link href="/institutional" className="hover:text-flow-cyan transition-colors">Institutional</Link></li>
                            <li><Link href="#" className="hover:text-flow-cyan transition-colors">Tokenomics</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/developers" className="hover:text-flow-cyan transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-flow-cyan transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-flow-cyan transition-colors">Whitepaper</Link></li>
                            <li><Link href="#" className="hover:text-flow-cyan transition-colors">Community</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="hover:text-flow-cyan transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-flow-cyan transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-flow-cyan transition-colors">Compliance</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; 2026 FlowFi Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>Built for Casper Hackathon Finals</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
