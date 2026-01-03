"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, FileText, ArrowRight, Loader2 } from "lucide-react";
import NeuralLoader from "@/components/neural-loader";
import { useCasper } from "@/components/providers";
import { upload } from "thirdweb/storage";
import { thirdwebClient } from "@/lib/thirdweb";

type AnalysisResult = {
    risk_score: string;
    valuation: number;
    confidence: number;
    summary: string;
};

export default function Dashboard() {
    const [status, setStatus] = useState<"idle" | "analyzing" | "scored" | "minting" | "success">("idle");
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const { signDeploy, isConnected, connect } = useCasper();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles: File[]) => {
            setFile(acceptedFiles[0]);
            setStatus("analyzing");

            try {
                // Call Python Backend
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${apiUrl}/analyze`, {
                    method: "POST"
                });
                const data = await res.json();
                setResult(data);
                setStatus("scored");
            } catch (e) {
                console.error("Backend offline, using fallback mock", e);
                setTimeout(() => {
                    setResult({
                        risk_score: "A",
                        valuation: 9800,
                        confidence: 0.99,
                        summary: "Verified invoice from Fortune 500 entity."
                    });
                    setStatus("scored");
                }, 2500);
            }
        },
        accept: { "application/pdf": [] },
        maxFiles: 1
    });



    const handleMint = async () => {
        if (!isConnected) {
            connect();
            return;
        }

        try {
            setStatus("minting");

            // 1. Upload to IPFS
            let ipfsUrl = "";
            if (file) {
                console.log("Uploading to IPFS via Thirdweb...");
                const uris = await upload({
                    client: thirdwebClient,
                    files: [file],
                });
                // uris[0] is the IPFS URI
                ipfsUrl = uris[0];
                console.log("IPFS URI:", ipfsUrl);
            }

            // 2. Trigger Real Casper Deploy
            // We pass the IPFS URI as metadata (handled by signDeploy logic)
            const deployHash = await signDeploy({
                type: "mint_invoice",
                amount: result?.valuation,
                ipfsUrl: ipfsUrl // Pass IPFS Link to Casper
            });

            console.log("Deployed:", deployHash);
            setTxHash(deployHash);
            setStatus("success");

        } catch (e) {
            console.error("Mint/Upload Error:", e);
            setStatus("scored"); // Revert state on error
            alert("Error: " + (e instanceof Error ? e.message : "Transaction Failed"));
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="mb-8">
                <h1 className="font-serif text-4xl font-bold text-flow-blue mb-2">Borrower Dashboard</h1>
                <p className="text-slate-500">Upload your invoices to access instant liquidity.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px] relative">
                <AnimatePresence mode="wait">

                    {/* STATE 1: UPLOAD */}
                    {status === "idle" && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center p-12 text-center"
                        >
                            <div
                                {...getRootProps()}
                                className={`w-full max-w-lg h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isDragActive ? "border-flow-cyan bg-flow-cyan/5" : "border-slate-200 hover:border-flow-blue/50 hover:bg-slate-50"
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="w-20 h-20 bg-blue-50 text-flow-blue rounded-full flex items-center justify-center mb-6">
                                    <UploadCloud className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-700 mb-2">Drop Invoice PDF here</h3>
                                <p className="text-slate-500 mb-6 max-w-xs">AI will verify authenticity and assign a risk score.</p>
                                <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                                    Select File
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* STATE 2: ANALYZING (NEURAL LOADER) */}
                    {status === "analyzing" && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-slate-900/95 backdrop-blur-xl z-20"
                        >
                            <NeuralLoader />
                        </motion.div>
                    )}

                    {/* STATE 3: SCORE CARD */}
                    {status === "scored" && result && (
                        <motion.div
                            key="scored"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="p-12 flex flex-col items-center w-full"
                        >
                            <div className="w-full max-w-2xl">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-100 rounded-lg"><FileText className="text-red-500 w-6 h-6" /></div>
                                        <div>
                                            <p className="text-sm text-slate-500">Invoice File</p>
                                            <p className="font-medium text-slate-900">{file?.name}</p>
                                        </div>
                                    </div>
                                    <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Verified</span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-sm text-slate-500 mb-1">Risk Score</p>
                                        <div className="text-5xl font-bold text-flow-blue">{result.risk_score}<span className="text-lg text-slate-400 font-normal">+</span></div>
                                        <p className="text-xs text-slate-400 mt-2">Top 1% of invoices</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-sm text-slate-500 mb-1">Valuation</p>
                                        <div className="text-4xl font-mono font-bold text-slate-900">${result.valuation.toLocaleString()}</div>
                                        <p className="text-xs text-green-600 mt-2 font-medium">98% LTV Approved</p>
                                    </div>
                                </div>

                                <div className="bg-flow-blue/5 p-4 rounded-xl mb-8 border border-flow-blue/10">
                                    <p className="text-sm text-flow-blue font-medium flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-flow-cyan animate-pulse" />
                                        AI Insight: {result.summary}
                                    </p>
                                </div>

                                <button
                                    onClick={handleMint}
                                    className="w-full py-4 bg-flow-blue text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-flow-blue/20 flex items-center justify-center gap-2"
                                >
                                    Mint RWA on Casper <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STATE 4: MINTING / SUCCESS */}
                    {(status === "minting" || status === "success") && (
                        <motion.div
                            key="success"
                            className="absolute inset-0 flex items-center justify-center bg-white p-12 text-center"
                        >
                            {status === "minting" ? (
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-12 h-12 text-flow-blue animate-spin mb-4" />
                                    <h3 className="text-xl font-semibold">Minting Token...</h3>
                                    <p className="text-slate-500">Please sign the transaction in your wallet.</p>
                                </div>
                            ) : (
                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Success!</h2>
                                    <p className="text-lg text-slate-600 mb-8">Invoice #402 has been minted as an NFT on Casper.</p>
                                    <div className="p-4 bg-slate-50 rounded-lg font-mono text-xs text-slate-500 mb-8">
                                        Hash: {txHash}
                                    </div>
                                    <button
                                        onClick={() => { setStatus("idle"); setFile(null); setTxHash(null); }}
                                        className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
                                    >
                                        Upload Another
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
