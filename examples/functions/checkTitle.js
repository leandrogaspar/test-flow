const { until } = require('selenium-webdriver');

async function check(context, nodeConfig) {
  const driver = context.storage.get(nodeConfig.config.driver);

  await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'check',
  node: check,
};
