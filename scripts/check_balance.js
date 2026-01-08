const { CasperClient, Keys } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../contracts/src/.env.local') });

const rpcUrl = 'https://node.testnet.casper.network/rpc';
const privateKeyBase64 = process.env.CASPER_ADMIN_PRIVATE_KEY;

async function checkBalance() {
    const client = new CasperClient(rpcUrl);

    // Load keys
    const pem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64}\n-----END PRIVATE KEY-----`;
    const pemPath = path.join(__dirname, 'temp_key_bal.pem');
    let keys;
    try {
        fs.writeFileSync(pemPath, pem);
        keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(pemPath);
    } catch (e) {
        keys = Keys.Ed25519.loadKeyPairFromPrivateFile(pemPath);
    } finally {
        if (fs.existsSync(pemPath)) fs.unlinkSync(pemPath);
    }

    const publicKey = keys.publicKey;
    console.log("Checking balance for:", publicKey.toHex());

    try {
        const balance = await client.balanceOfByPublicKey(publicKey);
        console.log("Balance:", balance.toString());
    } catch (e) {
        console.error("Error checking balance:", e.message);
    }
}

checkBalance();
