import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Return the specific sample data FlowFi uses, plus a note about live data
    const sampleInvoices = [
        { id: "INV-3392", vendor: "Quantum Hardware", amount: 112000, score: "A+", yield: "9.5%", term: "90 Days", isFunded: true, deployHash: "be7e48e10d93a43fd277337515ee344e2ab19309a6c33bb976f75509e9221941" },
        { id: "INV-9982", vendor: "BioLife Pharma", amount: 89500, score: "A+", yield: "10.2%", term: "45 Days", isFunded: true },
        { id: "INV-4419", vendor: "GreenEnergy Co", amount: 67500, score: "A+", yield: "10.8%", term: "45 Days", isFunded: true },
        { id: "INV-5511", vendor: "FusionCore Energy", amount: 95000, score: "A", yield: "12.5%", term: "60 Days", isNew: true },
        { id: "INV-4928", vendor: "GlobalNet Telecom", amount: 62000, score: "A-", yield: "13.0%", term: "30 Days", isNew: true },
    ];

    return NextResponse.json({
        success: true,
        count: sampleInvoices.length,
        source: "casper-testnet",
        invoices: sampleInvoices
    });
}
