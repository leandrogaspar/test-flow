async function open(context, nodeConfig) {
  const driver = context.storage.get(nodeConfig.config.driver);

  await driver.get('http://www.google.com/ncr');
  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'open',
  node: open,
};
