/* eslint-disable */
const { expect } = require('chai');

const fs = require('fs');
const NodeMap = require('../src/worker-server/core/node-map');

describe('NodeMap', () => {
  let nodeMap;
  const FOLDER_PATH = `${__dirname}/tmp-node-map`;
  const FILE = 'tmp-node.js';
  const FULL_PATH = `${FOLDER_PATH}/${FILE}`;
  const FILE_CONTENT = `
        async function test(context, nodeConfig, input) {
            console.log('hey');
            return { nextNode: nodeConfig.nextNodes.default };
        }
        
        module.exports = {
            name: "test",
            node: test
        };
    `;

  before(() => {
    fs.mkdirSync(FOLDER_PATH);
    fs.writeFileSync(FULL_PATH, FILE_CONTENT);
  });

  after(() => {
    fs.unlinkSync(FULL_PATH);
    fs.rmdirSync(FOLDER_PATH);
  });

  beforeEach(() => {
    nodeMap = new NodeMap(FOLDER_PATH);
  });

  it('should instantiate a NodeMap', () => {
    expect(nodeMap).to.exist;
  });

  describe('#getNode()', () => {
    it('should return loaded function', () => {
      expect(nodeMap.getNode('test')).to.be.an('function');
    });
  });
});
