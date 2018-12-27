const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const tempFunctions = [
    'open.js',
    'typeWebdriver.js',
    'checkTitle.js'
];

function buildFunctions(functions) {
    let build = [];
    for (const func of functions) {
        build.push({
            name: func,
            function: require(`./functions/${func}`)
        });
    }
    return build;
}

async function run() {
    let driver;
    try {
        console.log('Building chrome driver');
        driver = await new Builder().forBrowser('chrome').build();
        console.log('Done building chrome driver');

        const functions = buildFunctions(tempFunctions);
        for (const func of functions) {
            console.log(`Running ${func.name}`);
            await func.function(driver);
        }

        console.log('Done running example');
    } finally {
        await driver.quit();
    }

}

console.log('Before run');
run();
console.log('After run');