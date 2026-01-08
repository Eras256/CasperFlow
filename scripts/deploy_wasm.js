const { CasperClient, Contracts, RuntimeArgs, CLValueBuilder, Keys, DeployUtil, CLList, CLKeyType, CLU8Type, CLKey, CLAccountHash } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../contracts/src/.env.local') });

async function deploy() {
    console.log("🚀 Starting deployment of CEP-78 Contract (ACL Mode)...");

    const rpcList = [
        'https://node.testnet.casper.network/rpc',
        'https://rpc.testnet.casper.network/rpc',
        'http://3.136.227.9:7777/rpc'
    ];

    const chainName = process.env.CASPER_CHAIN_NAME || 'casper-test';
    const privateKeyBase64 = process.env.CASPER_ADMIN_PRIVATE_KEY;

    if (!privateKeyBase64) {
        throw new Error("CASPER_ADMIN_PRIVATE_KEY not found in .env.local");
    }

    // Load keys
    let keys;
    const pem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`;
    const pemPath = path.join(__dirname, 'temp_key.pem');
    try {
        fs.writeFileSync(pemPath, pem);
        try {
            keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(pemPath);
        } catch (e) {
            keys = Keys.Ed25519.loadKeyPairFromPrivateFile(pemPath);
        }
    } finally {
        if (fs.existsSync(pemPath)) fs.unlinkSync(pemPath);
    }

    console.log("Using Public Key:", keys.publicKey.toHex());

    // Prepare WASM
    const wasmPath = path.join(__dirname, '../contracts/cep-78.wasm');
    if (!fs.existsSync(wasmPath)) throw new Error("CEP-78 WASM not found at " + wasmPath);
    const wasm = new Uint8Array(fs.readFileSync(wasmPath));

    // Prepare Payment
    const deployParams = new DeployUtil.DeployParams(keys.publicKey, chainName, 1, 3600000);
    const payment = DeployUtil.standardPayment(600000000000); // 600 CSPR (Increased buffer)

    // --- STRATEGY: Use Non-Empty Lists to bypass SDK serialization bugs ---

    // 1. Create a Key List containing the installer's key (for ACL whitelist)
    // Keys.publicKey.toAccountHash() returns Uint8Array.
    const myAccountHash = new CLAccountHash(keys.publicKey.toAccountHash());
    const myKey = new CLKey(myAccountHash);
    const aclWhiteListPopulated = CLValueBuilder.list([myKey]);

    // 2. Create a U8 List (for metadata). Using [0] (CEP78 Kind) as a safe dummy value.
    // Adding '0' to required/optional metadata harmlessly reiterates the base standard.
    const metadataListPopulated = CLValueBuilder.list([CLValueBuilder.u8(0)]);

    // Prepare Deploy Arguments
    const deployArgs = RuntimeArgs.fromMap({
        // Core collection info
        "collection_name": CLValueBuilder.string("FlowFi Invoices"),
        "collection_symbol": CLValueBuilder.string("FLOW"),
        "total_token_supply": CLValueBuilder.u64(1000000),

        // Modes configuration
        "ownership_mode": CLValueBuilder.u8(2),        // Transferable
        "nft_kind": CLValueBuilder.u8(1),              // Digital
        "holder_mode": CLValueBuilder.u8(2),           // Mixed
        "whitelist_mode": CLValueBuilder.u8(0),        // Unlocked (Whitelist ignored for public, but used if ACL)

        // CRITICAL: Set Minting Mode to ACL (2) so providing a whitelist is VALID.
        "minting_mode": CLValueBuilder.u8(2),          // ACL Mode

        "burn_mode": CLValueBuilder.u8(0),             // Burnable
        "owner_reverse_lookup_mode": CLValueBuilder.u8(1), // Complete
        "events_mode": CLValueBuilder.u8(1),           // CEP47

        // ACL settings
        "allow_minting": CLValueBuilder.bool(true),
        "acl_whitelist": aclWhiteListPopulated,        // Non-empty list!
        "acl_package_mode": CLValueBuilder.bool(false),

        // Receipt/package
        "receipt_name": CLValueBuilder.string("flowfi_receipt"),
        "cep78_package_key": CLValueBuilder.string(""),

        // Metadata settings
        "nft_metadata_kind": CLValueBuilder.u8(0),     // CEP78
        "base_metadata_kind": CLValueBuilder.u8(0),    // CEP78
        "optional_metadata": metadataListPopulated,    // Non-empty list!
        "additional_required_metadata": metadataListPopulated, // Non-empty list!
        "json_schema": CLValueBuilder.string("{}"),

        // Identifier & mutability
        "identifier_mode": CLValueBuilder.u8(0),       // Ordinal
        "metadata_mutability": CLValueBuilder.u8(1)    // Mutable
    });

    const session = DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, deployArgs);
    const deployObj = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deployObj, keys);

    // Try sending to RPCs
    for (const rpc of rpcList) {
        try {
            console.log(`Trying to send deploy to ${rpc}... (Wait ~30s)`);
            const client = new CasperClient(rpc);
            const deployHash = await client.putDeploy(signedDeploy);
            console.log("\n✅ DEPLOY SUCCESSFUL!");
            console.log("-----------------------------------------");
            console.log("Deploy Hash:", deployHash);
            console.log("Explorer Link: https://testnet.cspr.live/deploy/" + deployHash);
            console.log("-----------------------------------------");
            console.log("PLEASE WAIT 1-2 MINUTES FOR THE CONTRACT TO INITIALIZE.");
            return;
        } catch (e) {
            console.warn(`❌ Failed on ${rpc}: ${e.message}`);
        }
    }

    throw new Error("All RPC endpoints failed.");
}

deploy().catch(err => {
    console.error("\n💥 DEPLOYMENT ERROR:", err.message);
    process.exit(1);
});
