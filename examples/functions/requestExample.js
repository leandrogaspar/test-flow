const request = require('request-promise');

async function getTest(context, nodeConfig, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`nodeConfig ${JSON.stringify(nodeConfig)}`);

    const test = await request('http://localhost:3000/get');
    console.log(test);

    return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
    name: "requestExample",
    node: getTest
};