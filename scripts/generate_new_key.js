const { Keys } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');

try {
    const keys = Keys.Secp256K1.new();
    const privPath = path.join(__dirname, '../keys/new_user_secret_key.pem');
    const pubPath = path.join(__dirname, '../keys/new_user_public_key.hex');

    const pem = keys.exportPrivateKeyInPem();
    fs.writeFileSync(privPath, pem);
    const hex = keys.publicKey.toHex();
    fs.writeFileSync(pubPath, hex);
    console.log("New Public Key:", hex);
} catch (e) {
    console.error(e);
}
