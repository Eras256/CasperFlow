
const {
    CasperClient,
    DeployUtil,
    Keys,
} = require("casper-js-sdk");
const fs = require("fs");
const path = require("path");

// Use Fetch for reliable RPC calls with Auth
const AUTH_TOKEN = "019b9f79-2cd4-7e83-a46e-65f3bc6c51bd";
const RPC_URL = "https://node.testnet.cspr.cloud/rpc";
const NETWORK_NAME = "casper-test";
const KEY_PATH = path.resolve(__dirname, "../keys/temp_admin.pem");

const VENDORS = [
    "Quantum Hardware", "BioLife Pharma", "GreenEnergy Co", "Urban Construction",
    "SolarSystems Ltd", "MedTech Solutions", "AgriFuture Corp", "CyberShield Sec",
    "BlueOcean Logistics", "NanoTech Labs", "SpaceX Dynamics", "EcoBlock Materials",
    "FusionCore Energy", "GlobalNet Telecom", "SmartCity Infra", "AeroSpace Parts",
    "DeepBlue Marine", "Vertex Robotics", "CloudScale Data", "FutureFintech"
];

const SCORES = ["A+", "A", "A-", "B+", "B"];
const TERMS = ["15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];

function loadKeys() {
    try {
        return Keys.Secp256K1.loadKeyPairFromPrivateFile(KEY_PATH);
    } catch (_) {
        return Keys.Ed25519.loadKeyPairFromPrivateFile(KEY_PATH);
    }
}

async function sendDeploy(signedDeploy) {
    const deployJson = DeployUtil.deployToJson(signedDeploy);

    const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': AUTH_TOKEN
        },
        body: JSON.stringify({
            jsonrpc: "2.0",
            method: "account_put_deploy",
            params: deployJson,
            id: Date.now()
        })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.result.deploy_hash;
}

async function main() {
    console.log("🚀 Starting Bulk Transaction Generator (Slower)...");

    const keys = loadKeys();
    console.log(`📝 Using account: ${keys.publicKey.toHex()}`);

    const invoices = [];

    for (let i = 0; i < 20; i++) {
        const vendor = VENDORS[i];
        const amount = Math.floor(Math.random() * (150000 - 5000) + 5000);
        const score = SCORES[Math.floor(Math.random() * SCORES.length)];
        const yieldRate = (Math.random() * (18 - 8) + 8).toFixed(1) + "%";
        const term = TERMS[Math.floor(Math.random() * TERMS.length)];
        const isFunded = i < 8; // 40%

        // process.stdout.write(`⏳ Tx ${i + 1}/20 (${vendor})... `);
        console.log(`⏳ Tx ${i + 1}/20 (${vendor})... `);

        // Dynamic timestamp to avoid conflicts
        const now = Date.now();
        const deployParams = new DeployUtil.DeployParams(
            keys.publicKey,
            NETWORK_NAME,
            1,
            1800000,
            [],
            now + (i * 1000) // Force different timestamp in header
        );

        const session = DeployUtil.ExecutableDeployItem.newTransfer(
            2500000000,
            keys.publicKey,
            null,
            i + Date.now()
        );

        const payment = DeployUtil.standardPayment(100000000);
        const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        const signedDeploy = DeployUtil.signDeploy(deploy, keys);

        let deployHash;
        try {
            deployHash = await sendDeploy(signedDeploy);
            console.log(`✅ Hash: ${deployHash}`);
        } catch (err) {
            console.log(`❌ Failed: ${err.message}`);
            // Fallback only if really broken, but verifyable is key
            deployHash = null;
        }

        if (deployHash) {
            invoices.push({
                id: `INV-${3000 + i * 147}`,
                vendor,
                amount,
                score,
                yield: yieldRate,
                term,
                isNew: true,
                deployHash,
                owner: keys.publicKey.toHex(),
                isFunded
            });
        }

        // Increased Delay: 4 seconds explicitly to clear any rate limits or block constraints
        await new Promise(r => setTimeout(r, 4000));
    }

    // Save JSON
    const outputPath = path.resolve(__dirname, "../marketplace_data_full.json");
    fs.writeFileSync(outputPath, JSON.stringify(invoices, null, 2));
    console.log(`\n\n🎉 Data saved to ${outputPath}`);
}

main().catch(console.error);
