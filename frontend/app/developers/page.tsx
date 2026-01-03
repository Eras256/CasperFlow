export default function Developers() {
    return (
        <div className="container mx-auto px-6 py-24">
            <div className="flex flex-col lg:flex-row gap-16">
                <div className="lg:w-1/2">
                    <h1 className="font-serif text-5xl font-bold text-flow-blue mb-6">Build on FlowFi</h1>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        Integrate real-world asset liquidity into your dApp using the FlowFi SDK.
                        Our developer tools provide easy access to invoice tokenization, risk scoring data, and secondary market liquidity.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Casper Native</h3>
                            <p className="text-slate-500">Optimized for Casper Network's CSPR execution layer.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-2">Oracle Integration</h3>
                            <p className="text-slate-500">Consume NodeOps AI risk scores directly on-chain.</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <button className="px-8 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors">
                            Read the Docs
                        </button>
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs text-slate-500 font-mono">example.ts</span>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                                {`import { FlowFiSDK, Network } from '@flowfi/sdk';

// Initialize SDK
const flowfi = new FlowFiSDK({
  network: Network.CASPER_TESTNET,
  apiKey: process.env.FLOWFI_KEY
});

async function mintInvoice() {
  // 1. Upload & Analyze
  const verification = await flowfi.ai.analyze('./invoice.pdf');
  
  if (verification.score >= 90) {
    // 2. Mint as NFT
    const tx = await flowfi.rwa.mint({
        valuation: verification.valuation,
        ipfsHash: verification.hash,
        owner: 'cspr...user'
    });
    
    console.log("Minted Invoice:", tx.deployHash);
  }
}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
