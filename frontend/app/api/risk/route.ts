import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // Deterministic simulation of the AI Risk Score
    const randomScore = Math.floor(85 + Math.random() * 14);

    return NextResponse.json({
        invoice_id: id || "INV-SAMPLE",
        risk_score: 95,
        rating: "A+",
        confidence: 0.98,
        ai_model: "FlowFi-Ensemble-v2",
        factors: [
            "Verified on-chain history",
            "Strong vendor liquidity",
            "Consistent repayment record"
        ]
    });
}
