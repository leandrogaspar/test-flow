const { By, Key } = require('selenium-webdriver');

async function type(driver) {
    await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
}

module.exports = type;