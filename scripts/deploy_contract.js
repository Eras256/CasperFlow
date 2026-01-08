const fs = require('fs');
const path = require('path');
const { Keys, CasperClient, DeployUtil, CLPublicKey, RuntimeArgs, CLValueBuilder } = require("casper-js-sdk");

// Configuration
const NODE_URL = "http://localhost:11101/rpc"; // Using local testnet or NCTL
const CHAIN_NAME = "casper-test";
// Assuming you have a keys directory with secret_key.pem
const KEY_PATH = path.resolve(__dirname, "../keys/secret_key.pem");
// Path to the compiled wasm
const WASM_PATH = path.resolve(__dirname, "../contracts/contract.wasm");

async function deploy() {
    console.log(`Attempting to deploy to ${CHAIN_NAME} at ${NODE_URL}`);

    // 1. Load Keys
    let keys;
    try {
        keys = Keys.Ed25519.loadKeyPairFromPrivateFile(KEY_PATH);
        console.log("Loaded keys for:", keys.publicKey.toHex());
    } catch (e) {
        console.error("Error loading keys. Make sure 'keys/secret_key.pem' exists.");
        console.error(e);
        return;
    }

    // 2. Client Setup
    const client = new CasperClient(NODE_URL);

    // 3. Prepare Deploy
    // Standard Install Deploy
    let deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
            keys.publicKey,
            CHAIN_NAME,
            1, // Gas Price
            1800000 // TTL
        ),
        DeployUtil.ExecutableDeployItem.newModuleBytes(
            getBinary(WASM_PATH),
            RuntimeArgs.fromMap({
                // Add init args if any
                "name": CLValueBuilder.string("FlowFi"),
            })
        ),
        DeployUtil.standardPayment(50 * 1000000000) // 50 CSPR payment
    );

    // 4. Sign
    deploy = client.signDeploy(deploy, keys);

    // 5. Send
    try {
        const deployHash = await client.putDeploy(deploy);
        console.log("Deploy Hash:", deployHash);
        console.log(`Check status: https://testnet.cspr.live/deploy/${deployHash}`);
    } catch (e) {
        console.error("Deployment Failed:", e);
    }
}

function getBinary(pathToBinary) {
    return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
}

if (require.main === module) {
    deploy();
}

module.exports = { deploy };
