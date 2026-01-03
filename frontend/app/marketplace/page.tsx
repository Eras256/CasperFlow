"use client";

import { useCasper } from "@/components/providers";
import { Loader2, TrendingUp, DollarSign, Activity } from "lucide-react";
import { useState } from "react";

export default function Marketplace() {
    const { signDeploy, isConnected, connect } = useCasper();
    const [buyingId, setBuyingId] = useState<string | null>(null);

    const stats = [
        { label: "Total Value Locked", value: "$4.2M", icon: DollarSign, color: "text-blue-500" },
        { label: "APY Average", value: "12%", icon: TrendingUp, color: "text-green-500" },
        { label: "Invoices Active", value: "142", icon: Activity, color: "text-purple-500" },
    ];

    const invoices = [
        { id: "INV-8821", originator: "TechCorp Inc.", amount: 10000, yield: "12%", risk: "A+", scoreColor: "text-green-600 bg-green-50" },
        { id: "INV-9203", originator: "Logistics LLC", amount: 45000, yield: "11.5%", risk: "A", scoreColor: "text-green-600 bg-green-50" },
        { id: "INV-1022", originator: "Apex Retail", amount: 8200, yield: "14%", risk: "B+", scoreColor: "text-yellow-600 bg-yellow-50" },
        { id: "INV-3391", originator: "SolarInstall", amount: 125000, yield: "10%", risk: "AAA", scoreColor: "text-flow-blue bg-blue-50" },
    ];

    const handleBuy = async (id: string) => {
        if (!isConnected) {
            connect();
            return;
        }
        setBuyingId(id);
        try {
            await new Promise(r => setTimeout(r, 1500)); // Sim network
            await signDeploy({ type: "fund_invoice", id });
            alert(`Successfully invested in ${id}!`);
        } catch (e) {
            console.error(e);
        } finally {
            setBuyingId(null);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-flow-blue mb-2">RWA Liquid Market</h1>
                    <p className="text-slate-500">Invest in real-world verified invoices.</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="p-6 font-semibold text-sm text-slate-600">ID</th>
                            <th className="p-6 font-semibold text-sm text-slate-600">Originator</th>
                            <th className="p-6 font-semibold text-sm text-slate-600">Amount</th>
                            <th className="p-6 font-semibold text-sm text-slate-600">Yield (APY)</th>
                            <th className="p-6 font-semibold text-sm text-slate-600">Risk Score</th>
                            <th className="p-6 font-semibold text-sm text-slate-600 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-6 font-mono text-sm font-medium text-slate-900">{inv.id}</td>
                                <td className="p-6 text-slate-600">{inv.originator}</td>
                                <td className="p-6 font-medium text-slate-900">${inv.amount.toLocaleString()}</td>
                                <td className="p-6 text-green-600 font-semibold">{inv.yield}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.scoreColor}`}>
                                        {inv.risk}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => handleBuy(inv.id)}
                                        disabled={buyingId === inv.id}
                                        className="px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-flow-blue disabled:opacity-50 transition-colors inline-flex items-center gap-2"
                                    >
                                        {buyingId === inv.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {buyingId === inv.id ? "Processing" : "Buy Now"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
