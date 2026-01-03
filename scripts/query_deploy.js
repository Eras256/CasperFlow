/**
 * Query Deploy Result and Extract Contract Hash
 */

const fs = require('fs');
const path = require('path');
const { CasperClient, CasperServiceByJsonRPC } = require("casper-js-sdk");

const NODE_URL = "https://node.testnet.casper.network/rpc";
const DEPLOY_HASH_FILE = path.resolve(__dirname, "../.deploy_hash");

async function queryDeploy() {
    const deployHash = fs.readFileSync(DEPLOY_HASH_FILE, 'utf8').trim();

    console.log("=================================================");
    console.log("  Querying Deploy Result");
    console.log("  Deploy Hash:", deployHash);
    console.log("=================================================\n");

    const client = new CasperServiceByJsonRPC(NODE_URL);

    try {
        const result = await client.getDeployInfo(deployHash);

        if (!result || !result.execution_results || result.execution_results.length === 0) {
            console.log("⏳ Deploy not yet processed. Try again in a minute...");
            return;
        }

        const execResult = result.execution_results[0].result;

        if (execResult.Failure) {
            console.error("❌ Deploy FAILED!");
            console.error("Error:", execResult.Failure.error_message);
            return;
        }

        console.log("✅ Deploy SUCCESS!\n");

        // Find the contract hash in the named keys
        const transforms = execResult.Success.effect.transforms;

        for (const transform of transforms) {
            const key = transform.key;
            if (key.startsWith("hash-")) {
                console.log("  Contract Hash:", key);

                // Save contract hash
                fs.writeFileSync(path.resolve(__dirname, "../.contract_hash"), key);
                console.log("  Saved to .contract_hash file.\n");
                break;
            }
        }

        // Also try to find from WriteContract
        for (const transform of transforms) {
            if (transform.transform && transform.transform.WriteContract) {
                console.log("  Contract Package:", transform.key);
            }
        }

        console.log("\nFull execution result saved for debugging.");
        fs.writeFileSync(
            path.resolve(__dirname, "../.deploy_result.json"),
            JSON.stringify(result, null, 2)
        );

    } catch (err) {
        console.error("Error querying deploy:", err.message);
    }
}

queryDeploy();
