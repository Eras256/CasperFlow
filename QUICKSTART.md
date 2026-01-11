# 🚀 FlowFi Quick Start Guide

Get FlowFi running locally in under 5 minutes.

## Prerequisites

- **Node.js** 18+ and **pnpm** (or npm)
- **Casper Wallet** browser extension ([Install](https://www.casperwallet.io/))
- (Optional) Python 3.9+ for backend AI engine

---

## 1. Clone & Install

```bash
git clone https://github.com/Eras256/FlowFi.git
cd FlowFi/frontend
pnpm install
```

---

## 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:

```env
# Required: CSPR.cloud token (get from https://console.cspr.build)
NEXT_PUBLIC_CSPR_CLOUD_ACCESS_TOKEN=your-token

# Optional: Gemini API for AI analysis
GEMINI_API_KEY=your-gemini-key

# Optional: Pinata for IPFS storage
NEXT_PUBLIC_PINATA_JWT=your-pinata-jwt
```

---

## 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Connect Casper Wallet

1. Click **"Connect Wallet"** in the navigation bar
2. Approve the connection in Casper Wallet extension
3. Ensure you're on **Casper Testnet**

> 💡 Get testnet CSPR from the [Casper Faucet](https://testnet.cspr.live/tools/faucet)

---

## 5. Using FlowFi

### As a Borrower (Dashboard)
1. Go to `/dashboard`
2. Upload an invoice PDF
3. Wait for AI risk analysis (~30 seconds)
4. Click **"Mint NFT"** to tokenize your invoice
5. Sign the transaction in Casper Wallet

### As an Investor (Marketplace)
1. Go to `/marketplace`
2. Browse available invoices
3. Click **"Invest"** on any invoice
4. Confirm the CSPR transfer in your wallet

---

## 6. Optional: Run Backend AI Engine

For local AI processing (instead of cloud fallback):

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Then update `NEXT_PUBLIC_API_URL=http://localhost:8000` in your `.env.local`.

---

## Smart Contract (CEP-78)

- **Contract Package**: [`113fd0f7...e4623`](https://testnet.cspr.live/contract-package/113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623)
- **Network**: Casper Testnet
- **Collection**: FlowFi Invoices (FLOW)

---

## Project Structure

```
FlowFi/
├── frontend/          # Next.js 14 application
│   ├── app/           # Pages (dashboard, marketplace, analytics)
│   ├── components/    # React components
│   └── lib/           # Casper SDK, CSPR.cloud, utilities
├── backend/           # Python FastAPI (FlowAI engine)
│   └── flowai/        # AI risk scoring models
├── contracts/         # CEP-78 WASM files
└── scripts/           # Deployment scripts
```

---

## Need Help?

- **Casper Discord**: [#hackathon channel](https://discord.gg/casper)
- **Documentation**: [docs.casper.network](https://docs.casper.network/)
- **CSPR.cloud Console**: [console.cspr.build](https://console.cspr.build/)

---

**Happy Building! 🎉**
