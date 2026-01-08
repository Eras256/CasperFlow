const fs = require('fs');

const result = JSON.parse(fs.readFileSync('deploy_result.json', 'utf8'));

// Check for execution_results array
const execution_results = result.execution_results;

if (!execution_results || execution_results.length === 0) {
    console.log("No execution results found.");
    process.exit(1);
}

// Get the first result (usually only one for a deploy query)
const firstResult = execution_results[0];
const execution_result = firstResult.result;

if (execution_result.Failure) {
    console.log("Deployment failed:", JSON.stringify(execution_result.Failure, null, 2));
    process.exit(1);
}

const effects = execution_result.Success ? execution_result.Success.effect.transforms : null;

if (!effects) {
    console.log("No effects found.");
    process.exit(1);
}

let contractHash = null;
let contractPackageHash = null;

// Look for Write CLValue of type 'Key' that might be the contract hash
// Usually, we look for writes to Key::Hash or key under the account named arguments
// But easier: check for transforms where key has 'hash-' prefix and 'Look-up key' matches contract name? No.

// Better strategy: Print all Write keys that look like contract hashes (hash-...)
// The CEP-78 contract usually stores the contract hash in a named key in the installer's account.
// But wait, the standard deploy output usually shows the contract hash if we know the key name. Or we can just find the new Contract.

console.log("Scanning effects for created Contract...");

effects.forEach(transform => {
    const key = transform.key;
    // Inspect what was written
    if (transform.transform === "WriteContract") {
        console.log("Found WriteContract at key:", key);
        contractHash = key;
    }
    if (transform.transform === "WriteContractPackage") {
        console.log("Found WriteContractPackage at key:", key);
        contractPackageHash = key;
    }
});

// Also check for named keys update in the account
const accountUpdate = effects.find(t => t.key.startsWith('account-hash-'));
if (accountUpdate) {
    // We can't see the NamedKeys map update details directly in transforms easily without parsing CLValue... 
    // unless 'WriteCLValue' contains the whole Account object? It usually does for Account.
}

console.log("---------------------------------------------------");
console.log("POSSIBLE CONTRACT HASHES FOUND:");
if (contractHash) console.log("CONTRACT HASH: " + contractHash);
if (contractPackageHash) console.log("CONTRACT PACKAGE HASH: " + contractPackageHash);
console.log("---------------------------------------------------");
