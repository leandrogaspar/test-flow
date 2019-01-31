async function sendWsRequest(context, nodeConfig) {
  const client = context.storage.get(nodeConfig.config.clientName);
  await client.request({ data: 1, data2: 2 });

  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'sendWsRequest',
  node: sendWsRequest,
};
