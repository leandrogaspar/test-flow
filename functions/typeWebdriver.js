const { By, Key } = require('selenium-webdriver');

async function type(context, input, config) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`config ${JSON.stringify(config)}`);

    await context.driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN);
    return { nextNode: config.nextNodes.default };
}

module.exports = type;