async function open(context, config, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`config ${JSON.stringify(config)}`);

    const driver = context.get('driver');

    await driver.get('http://www.google.com/ncr');
    return { nextNode: config.nextNodes.default };
}

module.exports = {
    name: "open",
    node: open
};