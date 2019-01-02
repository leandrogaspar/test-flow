const { until } = require('selenium-webdriver');

async function check(context, config, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`config ${JSON.stringify(config)}`);

    const driver = context.get('driver');

    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
    return { nextNode: config.nextNodes.default };
}

module.exports = {
    name: "check",
    node: check
};