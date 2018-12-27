const { until } = require('selenium-webdriver');

async function check(driver) {
    await driver.wait(until.titleIs('webdriver - Google Search'), 1000);
}

module.exports = check;