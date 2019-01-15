const { until } = require('selenium-webdriver');

async function check(context, nodeConfig, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`nodeConfig ${JSON.stringify(nodeConfig)}`);

    const driver = context.get(nodeConfig.config.driver);

    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
    name: "check",
    node: check
};