const { CasperClient, Keys } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');

const pemPath = path.join(__dirname, '../keys/secret_key.pem');

const rpcList = [
    'https://node.testnet.casper.network/rpc',
    'https://testnet-rpc.casper.live/rpc',
    'http://95.216.67.162:7777/rpc',
    'http://135.181.209.130:7777/rpc'
];

async function checkBalance() {
    let keys;
    try {
        keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(pemPath);
    } catch (e) {
        keys = Keys.Ed25519.loadKeyPairFromPrivateFile(pemPath);
    }
    const publicKey = keys.publicKey;
    console.log("Checking balance for:", publicKey.toHex());

    for (const rpc of rpcList) {
        try {
            console.log("Trying", rpc);
            const client = new CasperClient(rpc);
            const balance = await client.balanceOfByPublicKey(publicKey);
            console.log("Balance on", rpc, ":", balance.toString());
            if (balance.gt(0)) return;
        } catch (e) {
            console.log("Error on", rpc, ":", e.message.substring(0, 100));
        }
    }
}

checkBalance();
