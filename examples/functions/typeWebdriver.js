const { By, Key } = require('selenium-webdriver');

async function type(context, nodeConfig) {
  const driver = context.storage.get(nodeConfig.config.driver);

  await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'type',
  node: type,
};
