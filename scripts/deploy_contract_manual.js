// Manual CEP-78 deployment using low‑level Casper SDK (no client library)
// This avoids the serialization bug that caused "Invalid Deploy".

const fs = require('fs');
const path = require('path');
const {
    Keys,
    CasperClient,
    DeployUtil,
    RuntimeArgs,
    CLValueBuilder,
} = require('casper-js-sdk');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------
const NODE_URL = 'https://node.testnet.casper.network/rpc';
const CHAIN_NAME = 'casper-test';
const KEY_PATH = path.resolve(__dirname, '../keys/secret_key.pem');
const WASM_PATH = path.resolve(__dirname, '../contracts/contract.wasm'); // official CEP‑78 v1.5.1

// -----------------------------------------------------------------------------
// Helper: load key pair (Secp256K1 first, then Ed25519)
// -----------------------------------------------------------------------------
function loadKeys() {
    try {
        const kp = Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
        console.log('🔑 Loaded Secp256K1 key');
        return kp;
    } catch (_) {
        const kp = Keys.Ed25519.loadKeyPairFromPrivateFile(KEY_PATH);
        console.log('🔑 Loaded Ed25519 key');
        return kp;
    }
}

async function main() {
    console.log('🚀 Starting manual CEP‑78 deployment');
    const keys = loadKeys();

    // ---------------------------------------------------------------------------
    // 1️⃣ Load the contract Wasm
    // ---------------------------------------------------------------------------
    const wasmBytes = new Uint8Array(fs.readFileSync(WASM_PATH));
    console.log(`📦 WASM size: ${(wasmBytes.length / 1024).toFixed(2)} KB`);

    // ---------------------------------------------------------------------------
    // 2️⃣ Build RuntimeArgs – all 12 modality arguments are required for v1.5.1
    // ---------------------------------------------------------------------------
    const args = RuntimeArgs.fromMap({
        collection_name: CLValueBuilder.string('FlowFi Invoices'),
        collection_symbol: CLValueBuilder.string('FLOW'),
        total_token_supply: CLValueBuilder.u64(10000),
        // Modalities (U8)
        ownership_mode: CLValueBuilder.u8(2), // Transferable
        holder_mode: CLValueBuilder.u8(2), // Mixed (accounts & contracts can hold)
        whitelist_mode: CLValueBuilder.u8(0), // Unlocked
        minting_mode: CLValueBuilder.u8(0), // Installer only can mint
        nft_kind: CLValueBuilder.u8(1), // Digital
        nft_metadata_kind: CLValueBuilder.u8(0), // CEP78 – requires json_schema
        identifier_mode: CLValueBuilder.u8(0), // Ordinal
        metadata_mutability: CLValueBuilder.u8(0), // Immutable
        burn_mode: CLValueBuilder.u8(1), // Burnable
        events_mode: CLValueBuilder.u8(1), // CEP47 events
        owner_reverse_lookup_mode: CLValueBuilder.u8(0), // No lookup
        // Empty json_schema – the SDK will serialize it as an empty string
        json_schema: CLValueBuilder.string(''),
    });

    // ---------------------------------------------------------------------------
    // 3️⃣ Create the Deploy (payment = 1000 CSPR = 1_000_000_000_000 motes)
    // ---------------------------------------------------------------------------
    const paymentAmount = '1000000000000'; // 1000 CSPR
    const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(keys.publicKey, CHAIN_NAME),
        DeployUtil.ExecutableDeployItem.newModuleBytes(wasmBytes, args),
        DeployUtil.standardPayment(paymentAmount)
    );

    // ---------------------------------------------------------------------------
    // 4️⃣ Sign & send
    // ---------------------------------------------------------------------------
    const signed = DeployUtil.signDeploy(deploy, keys);
    const client = new CasperClient(NODE_URL);
    try {
        const deployHash = await client.putDeploy(signed);
        console.log('\n✅ Deploy submitted!');
        console.log('🔗 Explorer:', `https://testnet.cspr.live/deploy/${deployHash}`);
        // Save hash locally for later reference
        fs.writeFileSync(path.resolve(__dirname, '../.deploy_hash'), deployHash);
        console.log('💾 Deploy hash saved to .deploy_hash');
    } catch (e) {
        console.error('\n❌ Deploy failed');
        console.error(e.message || e);
        process.exit(1);
    }
}

main();
