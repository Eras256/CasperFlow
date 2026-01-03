# 🌊 FlowFi: AI-Powered Invoice Factoring on Casper

> **Hackathon Track:** Main Track (DeFi / RWA) + NodeOps Bounty
> **Tagline:** "Instant Liquidity for SMBs via AI Risk Audits & Casper Blockchain."

![FlowFi Banner](https://via.placeholder.com/1200x400?text=FlowFi+Dashboard)

## 🏆 The Problem
Small businesses wait 30-90 days for invoices to be paid. Traditional factoring is slow, manual, and expensive.

## 🚀 The Solution
**FlowFi** is a decentralized application (dApp) that:
1.  **AI Audit**: Uses a **NodeOps AI Agent** (powered by Gemini) to instantly parse and score PDF invoices.
2.  **RWA Tokenization**: Mints a "Proof of Invoice" on the **Casper Network** (Testnet).
3.  **Instant Market**: Allows investors to fund these verified invoices instantly.

## 🛠 Tech Stack
*   **Blockchain**: Casper Network (Casper JS SDK v5).
*   **AI Agent**: Python (FastAPI) + Google Gemini Pro + NodeOps Infrastructure.
*   **Frontend**: Next.js 14, Tailwind CSS, Framer Motion (Glassmorphism UI).
*   **Wallet**: Casper Wallet (Connected via `window.casperWalletProvider`).

## ✨ Key Features
*   **Dynamic Risk Scoring**: Upload a PDF, get a real-time risk score ("A", "B", "C") and valuation.
*   **Casper Integration**: 
    *   Authenticates users via Casper Wallet.
    *   Signs and deploys real transactions to `casper-test`.
    *   Uses native transfers as "Anchor Proofs" (Proof of Existence).
*   **NodeOps Ready**: Includes `Dockerfile` and `nodeops.yaml` for one-click deployment on NodeOps Console.

## 📦 Installation & Local Run

### Prerequisites
*   Node.js & NPM
*   Python 3.9+
*   Casper Wallet Extension (Chrome)

### 1. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### 2. AI Backend (Python)
```bash
cd backend
pip install -r requirements.txt
# Create .env file with your GEMINI_API_KEY
python -m uvicorn main:app --reload
# API runs at http://localhost:8000
```

### 3. Smart Contract (Real-World Assets)
We use the official **Casper CEP-78 Enhanced NFT Standard** for robustness and compliance.

1.  **Download Standard Contract**:
    *   Download `cep-78-wasm` from the [Official Release](https://github.com/casper-ecosystem/cep-78-enhanced-nft/releases/latest).
    *   Rename it to `cep-78.wasm` and place it in the `contracts/` folder.
    *   *(Note: This ensures you use the audited, secure standard).*

2.  **Deploy to Testnet**:
    Run the deployment script (uses your `keys/secret_key.pem`):
    ```bash
    cd frontend
    node scripts/deploy_cep78.js
    ```

3.  **Configure Frontend**:
    *   Copy the `Deploy Hash` from the output.
    *   Wait for the block to finalize on cspr.live.
    *   Get the `Contract Hash` (begins with `hash-...`).
    *   Add it to `frontend/.env.local`:
        ```
        NEXT_PUBLIC_CASPER_INVOICE_HASH=hash-YOUR_HASH_HERE
        ```
    *   Now the "Mint" button will interact with the Real CEP-78 Contract!

## 📜 License
MIT License. Built for Casper Hackathon 2026.
