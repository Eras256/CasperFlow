
const fs = require('fs');
const { Keys, DeployUtil, RuntimeArgs, CLValueBuilder } = require('casper-js-sdk');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const RAW_PRIVATE_KEY = process.env.CASPER_ADMIN_PRIVATE_KEY || "MHQCAQEEIDfv8TLmR5GMqNr9iUIQYfPZ1TzAi40k/X/OtXE0MDH9oAcGBSuBBAAKoUQDQgAEpNnW5KyCfd1qbgilPf3mGB7H2dBY4hWjbOoX9+HcYJUCirg09Xsw57T26r+ltoO4BmiA+Le42G1k/DYvqma7SA==";
const API_URL = 'http://localhost:3000/api';

function formatPem(base64Key, label) {
    let pem = `-----BEGIN ${label}-----\n`;
    for (let i = 0; i < base64Key.length; i += 64) {
        pem += base64Key.substring(i, i + 64) + '\n';
    }
    pem += `-----END ${label}-----\n`;
    return pem;
}

async function deployNewNFTContract() {
    console.log("🚀 DEPLOYING FRESH CEP-78 NFT CONTRACT...\n");

    // 1. Setup Keys
    const tempKeyPath = path.join(__dirname, 'temp_deploy_key.pem');
    fs.writeFileSync(tempKeyPath, formatPem(RAW_PRIVATE_KEY, "PRIVATE KEY"));

    let keys;
    try { keys = Keys.Ed25519.loadKeyPairFromPrivateFile(tempKeyPath); }
    catch { keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(tempKeyPath); }
    const publicKey = keys.publicKey;
    console.log("🔑 Installer Account:", publicKey.toHex());

    // 2. Load CORRECT WASM (469KB - valid)
    const wasmPath = '/home/vaiosvaios/CasperFlow-1/contracts/cep-78.wasm';
    const wasm = new Uint8Array(fs.readFileSync(wasmPath));
    console.log(`📦 Loaded WASM: ${wasm.length} bytes (${(wasm.length / 1024).toFixed(1)}KB)`);

    if (wasm.length < 1000) {
        console.error("❌ WASM file is corrupted or empty!");
        return;
    }

    // 3. Configure Arguments for PUBLIC MINTING
    // Key fix: minting_mode = 0 (Public) so ANYONE can mint
    const collectionName = `FlowFi Invoices ${Date.now().toString(36).toUpperCase()}`;

    const args = RuntimeArgs.fromMap({
        "collection_name": CLValueBuilder.string(collectionName),
        "collection_symbol": CLValueBuilder.string("FLOW"),
        "total_token_supply": CLValueBuilder.u64(100000), // 100K tokens max
        "ownership_mode": CLValueBuilder.u8(2), // 2 = Transferable
        "nft_kind": CLValueBuilder.u8(1), // 1 = Digital
        "identifier_mode": CLValueBuilder.u8(0), // 0 = Ordinal (auto-increment safe)
        "metadata_mutability": CLValueBuilder.u8(0), // 0 = Immutable
        "minting_mode": CLValueBuilder.u8(0), // *** 0 = PUBLIC (anyone can mint) ***
        "allow_minting": CLValueBuilder.bool(true),
        "nft_metadata_kind": CLValueBuilder.u8(2), // 2 = Raw/Custom JSON
        "json_schema": CLValueBuilder.string(JSON.stringify({
            properties: {
                name: { name: "name", description: "NFT name", required: true },
                symbol: { name: "symbol", description: "Token symbol", required: true },
                token_uri: { name: "token_uri", description: "IPFS URI", required: true }
            }
        }))
    });

    console.log(`📝 Collection: ${collectionName}`);
    console.log("⚙️  Minting Mode: PUBLIC (anyone can mint)");

    // 4. Create Deploy
    const deployParams = new DeployUtil.DeployParams(publicKey, 'casper-test');
    const session = DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, args);
    const payment = DeployUtil.standardPayment(500_000_000_000); // 500 CSPR
    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deploy, keys);

    // 5. Send via our serverless proxy
    const deployJson = DeployUtil.deployToJson(signedDeploy);
    console.log("\n🚀 Sending installation to Casper Testnet...");

    try {
        const res = await axios.post(`${API_URL}/deploy`, { deploy: deployJson });
        const hash = res.data.deploy_hash;

        console.log("\n✅ CONTRACT INSTALLATION SUBMITTED!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`📜 Deploy Hash: ${hash}`);
        console.log(`🔗 Monitor: https://testnet.cspr.live/deploy/${hash}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n⏳ Wait 2-3 minutes for finalization.");
        console.log("📌 Then find NEW CONTRACT HASH in 'execution_results' on explorer.");
        console.log("📌 Update your .env.local with the new hash!\n");

    } catch (e) {
        console.error("❌ Deployment Failed:", e.message);
        if (e.response) console.error(e.response.data);
    } finally {
        fs.unlinkSync(tempKeyPath);
    }
}

deployNewNFTContract();
