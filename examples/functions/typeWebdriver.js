const { By, Key } = require('selenium-webdriver');

async function type(context, nodeConfig, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`nodeConfig ${JSON.stringify(nodeConfig)}`);

    const driver = context.get(nodeConfig.config.driver);

    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
    name: "type",
    node: type
};