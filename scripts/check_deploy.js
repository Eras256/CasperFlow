const { CasperClient } = require('casper-js-sdk');
const fs = require('fs');

const deployHash = process.argv[2];
const rpcUrl = 'https://node.testnet.casper.network/rpc';

if (!deployHash) {
    console.error("Please provide a deploy hash.");
    process.exit(1);
}

async function checkDeploy() {
    const client = new CasperClient(rpcUrl);

    console.log(`Checking deploy ${deployHash} on ${rpcUrl}...`);

    let attempts = 0;
    while (attempts < 20) {
        try {
            const [deploy, result] = await client.getDeploy(deployHash);

            if (!result) {
                console.log("Deploy found, but no execution result yet. Waiting...");
            } else {
                console.log("Execution Result found!");
                fs.writeFileSync('deploy_result.json', JSON.stringify(result, null, 2));
                console.log("Saved result to deploy_result.json");
                return;
            }
        } catch (e) {
            console.log("Deploy not processed yet or RPC error:", e.message);
        }

        attempts++;
        await new Promise(r => setTimeout(r, 5000));
    }
    console.log("Timed out.");
}

checkDeploy();
