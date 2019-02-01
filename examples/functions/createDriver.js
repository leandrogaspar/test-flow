/* eslint-disable no-console */
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

// This shouldn't be executed everytime the node is callled
// Not sure if it is the best place but will be here for now
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function createDriver(context, nodeConfig) {
  console.log(`Creating selenium driver ${nodeConfig.config.driverName} browser ${nodeConfig.config.browser}`);

  if (nodeConfig.config.browser === 'chrome') {
    const driver = await new Builder().forBrowser('chrome').build();
    context.storage.set(nodeConfig.config.driverName, driver);

    context.defer(async () => { await driver.quit(); console.log('Driver quit'); });
  } else {
    throw Error('Not suported yet');
  }

  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'createDriver',
  node: createDriver,
};
