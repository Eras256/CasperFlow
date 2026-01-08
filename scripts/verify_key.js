const { Keys } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');

const pemPath = path.join(__dirname, '../keys/secret_key.pem');
const keys = Keys.Secp256K1.loadKeyPairFromPrivateFile(pemPath);
console.log("Public Key Hex:", keys.publicKey.toHex());
console.log("Account Hash:", keys.publicKey.toAccountHashStr());
