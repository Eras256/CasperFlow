import { Building2, Lock, Scale } from "lucide-react";
import Link from "next/link";

export default function Institutional() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-flow-blue text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-flow-cyan/5 -skew-x-12 transform origin-top-right" />
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6">For Asset Managers</h1>
                    <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                        Deploy capital into compliant, high-yield Real World Assets with the security of Casper Network's permissioned infrastructure.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-16 relative z-20">
                <div className="grid md:grid-cols-3 gap-8 text-slate-800">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                        <Building2 className="w-10 h-10 text-flow-blue mb-4" />
                        <h3 className="text-xl font-bold mb-3">Institutional Grade</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Designed for treasuries and family offices. FlowFi offers bankruptcy-remote structures and audited smart contracts.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                        <Lock className="w-10 h-10 text-flow-blue mb-4" />
                        <h3 className="text-xl font-bold mb-3">Permissioned Pools</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Leverage Casper's upgradable contracts and permissioned access controls to ensure KYC/AML compliance at the protocol level.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                        <Scale className="w-10 h-10 text-flow-blue mb-4" />
                        <h3 className="text-xl font-bold mb-3">Regulatory First</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Built with upcoming MiCA and SEC guidelines in mind. Real-time reporting and transparent on-chain auditing.
                        </p>
                    </div>
                </div>

                <div className="py-24 text-center">
                    <h2 className="text-3xl font-serif font-bold text-flow-blue mb-6">Join the Pilot Program</h2>
                    <p className="text-slate-600 mb-8">Exclusive access for qualified institutional partners.</p>
                    <Link
                        href="mailto:institutional@flowfi.com"
                        className="inline-block px-8 py-4 bg-flow-blue text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        Contact Sales
                    </Link>
                </div>
            </div>
        </div>
    );
}
