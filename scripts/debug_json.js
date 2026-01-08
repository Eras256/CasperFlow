const fs = require('fs');

try {
    const content = fs.readFileSync('deploy_result.json', 'utf8');
    const result = JSON.parse(content);

    console.log("Keys in root:", Object.keys(result));

    if (result.execution_results) {
        console.log("Found execution_results array");
        console.log(JSON.stringify(result.execution_results, null, 2).substring(0, 500));
    } else if (result.execution_info) {
        console.log("Found execution_info");
        console.log(JSON.stringify(result.execution_info, null, 2).substring(0, 500));
    } else {
        console.log("No standard execution info found.");
    }
} catch (e) {
    console.error("Error parsing JSON:", e);
}
