async function open(context, input, config) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`config ${JSON.stringify(config)}`);

    await context.driver.get('http://www.google.com/ncr');
    return { nextNode: config.nextNodes.default };
}

module.exports = open;