async function open(driver) {
    await driver.get('http://www.google.com/ncr');
}

module.exports = open;