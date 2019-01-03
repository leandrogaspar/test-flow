async function open(context, nodeConfig, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`nodeConfig ${JSON.stringify(nodeConfig)}`);

    const driver = context.get(nodeConfig.config.driver);

    await driver.get('http://www.google.com/ncr');
    return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
    name: "open",
    node: open
};