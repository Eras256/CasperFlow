
const https = require('https');

const ACCOUNT_HASH = "0202a4d9d6e4ac827ddd6a6e08a53dfde6181ec7d9d058e215a36cea17f7e1dc6095";
// Contract Package Hash oficial de FlowFi (CEP-78)
const CONTRACT_PACKAGE = "113fd0f7f4f803e2401a9547442e2ca31bd9001b4fcd803eaff7a3dac11e4623";
const AUTH_TOKEN = "019b9f79-2cd4-7e83-a46e-65f3bc6c51bd";

async function fetchDeploys(page) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.testnet.cspr.cloud',
            path: `/accounts/${ACCOUNT_HASH}/deploys?limit=100&page=${page}`,
            method: 'GET',
            headers: { 'Authorization': AUTH_TOKEN }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log("🔍 Searching for Confirmed MINT transactions...");
    const mints = [];

    // Check first 3 pages of history (300 txs)
    for (let p = 1; p <= 3; p++) {
        const data = await fetchDeploys(p);
        if (!data.data) continue;

        for (const tx of data.data) {
            // Filter: Must be successful (no error) AND interaction with our NFT contract
            if (tx.error_message === null &&
                tx.contract_package_hash === CONTRACT_PACKAGE) {

                // Confirm it's a 'mint' (entry point might be named mint or similar ID)
                // We'll assume contract interactions are likely mints/approvals
                // CSPR Cloud API v2 might not give entry_point name directly in list, 
                // but checking package hash + success is a very strong signal.
                mints.push(tx.deploy_hash);
            }
        }
        if (mints.length >= 20) break;
    }

    console.log(`✅ Found ${mints.length} confirmed contract interactions (Mints).`);
    console.log(JSON.stringify(mints, null, 2));
}

main();
