const request = require('request-promise');

async function getTest(context, nodeConfig) {
  await request('http://localhost:3000/get');

  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'requestExample',
  node: getTest,
};
