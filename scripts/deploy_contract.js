/**
 * Deploy CEP-78 NFT Contract using casper-cep78-js-client
 * For Casper Hackathon 2026
 * 
 * FIX: Remove json_schema entirely since CEP78 metadata kind (0) doesn't need it
 */

const fs = require('fs');
const path = require('path');
const { Keys, CasperClient, DeployUtil, CLPublicKey } = require("casper-js-sdk");
const { CEP78Client } = require("casper-cep78-js-client");

// Configuration
const NODE_URL = "https://node.testnet.casper.network/rpc";
const CHAIN_NAME = "casper-test";
const KEY_PATH = path.resolve(__dirname, "../keys/secret_key.pem");

async function deploy() {
    console.log("=================================================");
    console.log("  CEP-78 NFT Contract Deployment (Hackathon 2026)");
    console.log("  Using casper-cep78-js-client v1.5.1");
    console.log("  FIX: Removed json_schema for CEP78 metadata");
    console.log("=================================================\n");

    // 1. Load Keys
    console.log("[1/4] Loading keys from:", KEY_PATH);
    let keys;
    try {
        keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
        console.log("      Key Type: Secp256K1");
    } catch (e) {
        try {
            keys = Keys.Ed25519.loadKeyPairFromPrivateFile(KEY_PATH);
            console.log("      Key Type: Ed25519");
        } catch (e2) {
            console.error("ERROR: Could not load keys.");
            process.exit(1);
        }
    }
    console.log("      Public Key:", keys.publicKey.toHex());

    // 2. Initialize CEP78 Client
    console.log("\n[2/4] Initializing CEP-78 Client...");
    const cep78Client = new CEP78Client(NODE_URL, CHAIN_NAME);

    // 3. Prepare Installation Deploy
    // NOTE: For nft_metadata_kind = 0 (CEP78), json_schema is NOT required
    console.log("\n[3/4] Preparing installation deploy...");

    const installDeploy = cep78Client.install(
        {
            collectionName: "FlowFi Invoices",
            collectionSymbol: "FLOW",
            totalTokenSupply: "10000",
            ownershipMode: 2,         // Transferable
            nftKind: 1,               // Digital
            nftMetadataKind: 0,       // CEP78 (no json_schema needed)
            identifierMode: 0,        // Ordinal
            metadataMutability: 0,    // Immutable


        },
        "1000000000000", // 500 CSPR payment
        keys.publicKey
    );

    console.log("      Collection: FlowFi Invoices (FLOW)");
    console.log("      Supply: 10,000 NFTs");
    console.log("      Metadata: CEP78 (builtin)");

    // 4. Sign and Send
    console.log("\n[4/4] Signing and sending deploy...");
    const signedDeploy = DeployUtil.signDeploy(installDeploy, keys);

    try {
        const client = new CasperClient(NODE_URL);
        const result = await client.putDeploy(signedDeploy);

        console.log("\n=================================================");
        console.log("  ✅ DEPLOY SUBMITTED SUCCESSFULLY!");
        console.log("=================================================");
        console.log("  Deploy Hash:", result);
        console.log("  Explorer:    https://testnet.cspr.live/deploy/" + result);
        console.log("=================================================\n");
        console.log("⏳ Wait ~2-3 minutes for the deploy to be processed.\n");

        // Save deploy hash
        fs.writeFileSync(path.resolve(__dirname, "../.deploy_hash"), result);
        console.log("   Deploy hash saved to .deploy_hash file.\n");

    } catch (err) {
        console.error("\n❌ DEPLOY FAILED!");
        console.error("Error:", err.message || err);
        process.exit(1);
    }
}

deploy();
