async function sendWsRequest(context, nodeConfig, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`nodeConfig ${JSON.stringify(nodeConfig)}`);


    const client = context.get(nodeConfig.config.clientName);
    await client.request({ data: 1, data2: 2 });

    return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
    name: "sendWsRequest",
    node: sendWsRequest
};
