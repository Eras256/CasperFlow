
const NODE_URL = "http://65.21.235.219:7777/rpc";
const CHAIN_NAME = "casper-test";

// Casper SDK v5 specific imports
const {
    RpcClient,
    HttpHandler,
    Deploy,
    DeployHeader,
    ExecutableDeployItem,
    PublicKey,
    Timestamp,
    Duration,
    CLValueBuilder,
    RuntimeArgs
} = require("casper-js-sdk");

const fs = require('fs');
const path = require('path');
const { BigNumber } = require('@ethersproject/bignumber');

// Private key setup
const privateKeyPem = `-----BEGIN PRIVATE KEY-----
MHQCAQEEIDfv8TLmR5GMqNr9iUIQYfPZ1TzAi40k/X/OtXE0MDH9oAcGBSuBBAAK
oUQDQgAEpNnW5KyCfd1qbgilPf3mGB7H2dBY4hWjbOoX9+HcYJUCirg09Xsw57T2
6r+ltoO4BmiA+Le42G1k/DYvqma7SA==
-----END PRIVATE KEY-----`;

async function deploy() {
    console.log("Starting Deploy Script (SDK v5)...");

    // 1. Setup Client
    const handler = new HttpHandler(NODE_URL);
    const client = new RpcClient(handler);

    // 2. Load Keys
    console.log("Loading keys...");
    // In v5, we might need a different way if "Keys" helper is gone, 
    // but usually PublicKey.fromHex or standard crypto libs are used.
    // Let's try to parse the PEM using a temporary file if SDK supports it,
    // or use Ed25519 directly if available.

    // HACK: Since Ed25519 helper class seems missing in root exports in v5, 
    // let's try to use the key pair from the known hex if possible, 
    // OR just assume we can sign if we had the KeyPair class. 
    // BUT we don't see KeyPair.
    // Let's rely on standard 'casper-js-sdk' to hopefully have 'Keys' in a commonjs require if we look deeper?
    // No, the previous check failed.

    // v5 has 'PublicKey' class.
    // We need to sign. Signing usually requires a KeyPair object.
    // Let's try to find where KeyPair/Ed25519 lives.
    // If we can't find it, we might be stuck on signing logic.

    // Alternate approach: The user provided a PEM. 
    // We can try to manually create the signature if we extracted the raw private key.

    // Let's assume for a moment we can't easily sign without the helper.
    // Wait, `Deploy.setSignature` exists. 

    // Let's try to import Keys from dist if possible or check common subpaths?
    // No, let's look at what we DO have. 
    // We have `transferDeployItem`, `ExecutableDeployItem`, etc.

    // Let's try to use the raw private key to sign using `tweetnacl` or similar if built in, 
    // but better to find the SDK way.

    // Let's try to require 'casper-js-sdk/dist/lib/Keys' maybe?
    let Keys;
    try {
        // Keys might be under a namespace or different export
        // In v5.0.0+, it seems cryptographic keys were refactored.
        // Try import { Ed25519 } from 'casper-js-sdk'; -> undefined

        // Let's try exploring `Values` or similar? 
        // actually, let's try to use a CLI tool approach if SDK fails, but CLI failed too.
    } catch (e) { }

    // CRITICAL: We need to sign. 
    // Let's try to use the key pair we have.
    // The public key is in the PEM: 01 24 d9 d6 e4 ac 82 7d dd 6a 6e 08 a5 3d...
    // That matches the one in the PEM dump (oUQDQgAE...).

    // Let's try to instantiate a keypair simply using `casper-client-sdk` if valid?
    // Let's assume we can't assume v5 structure entirely yet.

    // FALLBACK: Use a naive "Hello World" style deploy just to prove we can talk to the chain.
    // We need to create a deploy object first.

    const formattedPublicKey = PublicKey.fromHex("0124d9d6e4ac827ddd6a6e08a53dfded6181ec7d9d058e215a36cea17f7e1dc609");

    // 3. Read WASM
    const wasm = new Uint8Array(fs.readFileSync(path.resolve("contracts/cep-78.wasm")));

    // 4. Create Deploy Params
    const args = RuntimeArgs.fromMap({
        "collection_name": CLValueBuilder.string("FlowFi Invoices"),
        "collection_symbol": CLValueBuilder.string("FLOW"),
        "total_token_supply": CLValueBuilder.u64(1000),
        "ownership_mode": CLValueBuilder.u8(0),
        "nft_kind": CLValueBuilder.u8(1),
        "allow_minting": CLValueBuilder.bool(true),
        "owner_reverse_lookup_mode": CLValueBuilder.u8(0),
        "identifier_mode": CLValueBuilder.u8(0),
        "metadata_mutability": CLValueBuilder.u8(0),
        "events_mode": CLValueBuilder.u8(0)
    });

    const session = ExecutableDeployItem.newModuleBytes(wasm, args);
    const payment = ExecutableDeployItem.standardPayment(BigNumber.from(300000000000)); // 300 CSPR

    const header = new DeployHeader(
        CHAIN_NAME,
        [], // dependencies
        1, // gasPrice
        new Timestamp(new Date()),
        new Duration(1800000), // 30min
        formattedPublicKey,
        undefined // bodyHash
    );

    const deployObj = Deploy.makeDeploy(header, payment, session);

    console.log("Deploy object created. Now attempting signature...");

    // Since we are struggling to find the "Keys" class in this SDK version allow me to use a crypto library directly
    // or valid workaround. 
    // Actually, let's try to just dump the deploy JSON and tell the user we'd sign it if we could.
    // BUT we want to actually deploy.

    // NOTE: For v5, cryptographic primitives might be in `@casper/sdk` or similar if split?
    // No, `casper-js-sdk` is the main one.

    // Let's try to find `Ed25519` via require loop?
    // Actually, 'casper-js-sdk' usually exports { Keys }...
    // If it returned undefined, maybe it's a specific sub-path import?

    // Workaround: We will use a raw crypto signature if we have to.
    // But let's try one more check for the key class. 
    // Maybe it's `SDK.DeployUtil`? No.

    console.log("Aborted auto-deploy due to missing Keys SDK class. Please use casper-client CLI if available or wait for fix.");
}

deploy().catch(console.error);
