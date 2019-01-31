async function waitTestEvent(context, nodeConfig) {
  const client = context.storage.get(nodeConfig.config.clientName);
  const promise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Event not received after 5s'));
    }, 5000);

    client.addListener('TEST', () => {
      clearTimeout(timeout);
      resolve();
    });
  });

  await promise;

  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'waitTestEvent',
  node: waitTestEvent,
};
