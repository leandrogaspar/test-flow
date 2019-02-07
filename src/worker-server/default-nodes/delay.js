async function delay(context, nodeConfig) {
  const delay = nodeConfig.config.ms;
  const timeout = new Promise(resolve => setTimeout(resolve, delay));
  await timeout;
  return { nextNode: nodeConfig.nextNodes };
}

module.exports = {
  name: 'delay',
  node: delay,
};
