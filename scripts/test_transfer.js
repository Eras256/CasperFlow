const { CasperClient, DeployUtil, Keys, CLPublicKey } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../contracts/src/.env.local') });

async function testTransfer() {
    // Setup
    const nodeUrl = 'https://node.testnet.casper.network/rpc';
    const chainName = process.env.CASPER_CHAIN_NAME || 'casper-test';

    // Keys
    const privateKeyBase64 = process.env.CASPER_ADMIN_PRIVATE_KEY;
    const pem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`;
    const pemPath = path.join(__dirname, 'temp_transfer_key.pem');
    fs.writeFileSync(pemPath, pem);

    let keys;
    try {
        keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(pemPath);
    } catch (e) {
        keys = Keys.Ed25519.loadKeyPairFromPrivateFile(pemPath);
    } finally {
        fs.unlinkSync(pemPath);
    }

    console.log("From:", keys.publicKey.toHex());

    // Params
    const deployParams = new DeployUtil.DeployParams(keys.publicKey, chainName, 1, 1800000);

    // Transfer 2.5 CSPR (2.5 * 10^9 motes)
    const toPublicKey = keys.publicKey; // Send to self
    const amount = 2500000000;
    const id = 123456;

    const session = DeployUtil.ExecutableDeployItem.newTransfer(
        amount,
        toPublicKey,
        null,
        id
    );

    const payment = DeployUtil.standardPayment(100000000); // 0.1 CSPR for transfer

    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
    const signedDeploy = DeployUtil.signDeploy(deploy, keys);

    console.log("Sending Transfer...");
    const client = new CasperClient(nodeUrl);

    try {
        const deployHash = await client.putDeploy(signedDeploy);
        console.log("Success! Hash:", deployHash);
        console.log("https://testnet.cspr.live/deploy/" + deployHash);
    } catch (e) {
        console.error("Transfer Failed:", e.message);
        console.log("Details:", JSON.stringify(e, Object.getOwnPropertyNames(e)));
    }
}

testTransfer();
