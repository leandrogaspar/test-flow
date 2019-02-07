async function delay(context, nodeConfig) {
  const { ms } = nodeConfig.config;
  const timeout = new Promise(resolve => setTimeout(resolve, ms));
  await timeout;
  return { nextNode: nodeConfig.nextNodes };
}

module.exports = {
  name: 'delay',
  node: delay,
};
