const fs = require('fs');
const path = require('path');
const {
    PrivateKey,
    KeyAlgorithm,
    Deploy,
    DeployHeader,
    ExecutableDeployItem,
    RuntimeArgs,
    CLValueBuilder,
    RpcClient,
    HttpHandler,
    Timestamp,
    Duration
} = require('casper-js-sdk');

// console.log("SDK Exports:", Object.keys(require('casper-js-sdk')));
// console.log("KeyAlgorithm:", require('casper-js-sdk').KeyAlgorithm);

// Configuration
const NODE_URL = process.env.NEXT_PUBLIC_CASPER_NODE_URL || 'http://localhost:11101/rpc';
const NETWORK_NAME = process.env.NEXT_PUBLIC_CASPER_CHAIN_NAME || 'casper-test';

// Keys
const KEYS_DIR = path.join(__dirname, '../../keys');
const SECRET_KEY_PATH = path.join(KEYS_DIR, 'secret_key.pem');

// WASM Path
const WASM_PATH = path.join(__dirname, '../../contracts/cep-78.wasm');

const main = async () => {
    try {
        // 1. Check if keys exist
        if (!fs.existsSync(SECRET_KEY_PATH)) {
            console.error(`Error: Private key not found at ${SECRET_KEY_PATH}`);
            process.exit(1);
        }

        // 2. Check if WASM exists
        if (!fs.existsSync(WASM_PATH)) {
            console.warn(`Warning: WASM not found at ${WASM_PATH}`);
            return;
        }

        console.log("Loading keys...");
        const pem = fs.readFileSync(SECRET_KEY_PATH, 'utf8');

        // Manual PKCS#8 Ed25519 Parsing (Workaround for SDK v5 issue with PKCS#8)
        let privateKey;
        const ED25519_ALG = 1; // Hardcoded KeyAlgorithm.ED25519

        // Skip SDK check to avoid crash/noise
        // try {
        //     // Try standard SDK first
        //     privateKey = PrivateKey.fromPem(pem, ED25519_ALG);
        // } catch (e) {
        //     console.log("SDK fromPem failed, trying manual PKCS#8 parsing...");
        //     const base64 = pem
        //         .replace(/-----BEGIN PRIVATE KEY-----/g, '')
        //         .replace(/-----END PRIVATE KEY-----/g, '')
        //         .replace(/\s+/g, '');
        //     console.log("Base64 length:", base64.length);
        //     const buffer = Buffer.from(base64, 'base64');
        //     console.log("Buffer length:", buffer.length);

        //     // Look for the private key octet string (0x04 0x20)
        //     // 0x04 = Octet String, 0x20 = 32 bytes length
        //     const idx = buffer.indexOf(Buffer.from([0x04, 0x20]));
        //     if (idx !== -1) {
        //         const keyBytes = buffer.subarray(idx + 2, idx + 2 + 32);
        //         console.log(`Found Private Key bytes at offset ${idx}. Length: ${keyBytes.length}`);
        //         const keyHex = keyBytes.toString('hex');
        //         // console.log("Key Hex:", keyHex); 
        //         privateKey = PrivateKey.fromHex(keyHex, ED25519_ALG);
        //     } else {
        //         throw new Error("Could not parse PKCS#8 Ed25519 key");
        //     }
        // }

        console.log("Starting Manual PKCS#8 parsing...");
        console.log("PEM Length:", pem.length);

        try {
            const base64 = pem
                .replace(/-----BEGIN PRIVATE KEY-----/g, '')
                .replace(/-----END PRIVATE KEY-----/g, '')
                .replace(/\s+/g, '');
            console.log("Base64 length:", base64.length);

            const buffer = Buffer.from(base64, 'base64');
            console.log("Buffer length:", buffer.length);

            // Look for the private key octet string (0x04 0x20)
            // 0x04 = Octet String, 0x20 = 32 bytes length
            const idx = buffer.indexOf(Buffer.from([0x04, 0x20]));
            if (idx !== -1) {
                const keyBytes = buffer.subarray(idx + 2, idx + 2 + 32);
                console.log(`Found Private Key bytes at offset ${idx}. Length: ${keyBytes.length}`);
                const keyHex = keyBytes.toString('hex');
                privateKey = PrivateKey.fromHex(keyHex, ED25519_ALG);
            } else {
                throw new Error("Could not parse PKCS#8 Ed25519 key");
            }
        } catch (e) {
            console.error("Manual parsing failed:", e);
            throw e;
        }
        const publicKey = privateKey.publicKey;
        console.log(`Public Key: ${publicKey ? publicKey.toHex() : 'undefined'}`);

        console.log("Reading WASM...");
        const wasm = new Uint8Array(fs.readFileSync(WASM_PATH));
        console.log(`WASM size: ${wasm.length} bytes`);

        // 3. CEP-78 Install Arguments
        console.log("Preparing Args...");
        const args = RuntimeArgs.fromMap({
            collection_name: CLValueBuilder.string("FlowFi Invoices"),
            collection_symbol: CLValueBuilder.string("FLOW"),
            total_token_supply: CLValueBuilder.u64(10000),
            ownership_mode: CLValueBuilder.u8(2), // Transferable
            nft_kind: CLValueBuilder.u8(1), // Digital
            holder_mode: CLValueBuilder.u8(2), // Mixed
            whitelist_mode: CLValueBuilder.u8(0), // None
            minting_mode: CLValueBuilder.u8(1), // Public (for Demo) - or 0 if strict
            nft_metadata_kind: CLValueBuilder.u8(0), // CEP78
            identifier_mode: CLValueBuilder.u8(0), // Ordinal
            metadata_mutability: CLValueBuilder.u8(0), // Immutable
            events_mode: CLValueBuilder.u8(1), // CES
        });

        // 4. Construct Deploy
        console.log("Constructing Deploy Object...");

        // Session (ModuleBytes for Installation)
        const session = ExecutableDeployItem.newModuleBytes(wasm, args);
        console.log("Session created.");

        // Payment
        // 300 CSPR = 300 * 10^9 motes
        const paymentAmount = 300000000000n;
        const payment = ExecutableDeployItem.newStandardPayment(paymentAmount);
        console.log("Payment created.");

        // Header
        const header = new DeployHeader(
            NETWORK_NAME,
            [], // dependencies
            1, // gasPrice
            new Timestamp(new Date()),
            new Duration(1800000), // 30min
            publicKey,
            undefined // bodyHash
        );
        console.log("Header created.");

        let deploy = Deploy.makeDeploy(header, payment, session);
        console.log("Deploy created.");

        // 5. Sign
        console.log("Signing Deploy...");
        deploy.sign([privateKey]);

        // 6. Send
        console.log("Sending to Network...");
        const handler = new HttpHandler(NODE_URL);
        const client = new RpcClient(handler);

        // putDeploy returns a PutDeployResult which has 'deploy_hash'
        const result = await client.putDeploy(deploy);
        // Handle result structure variations
        const deployHash = (result && result.deploy_hash) ? result.deploy_hash :
            (typeof result === 'string' ? result : JSON.stringify(result));

        console.log("--------------------------------------------------");
        console.log(`✅ DEPLOY SUCCESS!`);
        console.log(`Deploy Hash: ${deployHash}`);
        console.log(`Explorer: https://testnet.cspr.live/deploy/${deployHash}`);
        console.log("--------------------------------------------------");
        console.log("NEXT STEP:");
        console.log("Wait for execution (approx 1-2 mins), then find the 'Contract Hash'.");
        console.log("Add it to frontend/.env.local as NEXT_PUBLIC_CASPER_INVOICE_HASH");
        console.log("--------------------------------------------------");

    } catch (error) {
        console.error("Deployment Failed:", error);
    }
};

main();
