/* eslint-disable */
const { expect } = require('chai');

const fs = require('fs');
const NodeMap = require('../src/worker-server/core/node-map');

describe('NodeMap', () => {
  let nodeMap;
  const FOLDER_PATH = `${__dirname}/tmp-node-map`;
  const FILE = 'tmp-node.js';
  const FULL_PATH = `${FOLDER_PATH}/${FILE}`;

  const fileContent = function fileContent(nodeName) {
    return `
      async function ${nodeName}(context, nodeConfig, input) {
          console.log('hey');
          return { nextNode: nodeConfig.nextNodes.default };
      }
      
      module.exports = {
          name: "${nodeName}",
          node: ${nodeName}
      };`;
  }

  beforeEach((done) => {
    fs.mkdir(FOLDER_PATH, err => {
      if (err) {
        done(err);
      }
      fs.writeFile(FULL_PATH, fileContent('test'), err => {
        if (err) {
          done(err);
          return;
        }
        nodeMap = new NodeMap(FOLDER_PATH);
        done();
      })
    });
  });

  afterEach((done) => {
    fs.readdir(FOLDER_PATH, (err, files) => {
      if (err) { return done(err); }
      files.forEach(file => {
        const fullPath = `${FOLDER_PATH}/${file}`;
        fs.unlinkSync(fullPath);
      });
      fs.rmdir(FOLDER_PATH, err => done(err));
    });
  });

  it('should instantiate a NodeMap', () => {
    expect(nodeMap).to.exist;
  });

  it('should fail if custom node matches default node name', (done) => {
    const path = `${FOLDER_PATH}/delay.js`;
    const content = fileContent('delay');
    let success = false;
    fs.writeFile(path, content, (err) => {
      if (err) {
        done(err);
      }
      try {
        nodeMap = new NodeMap(FOLDER_PATH);
        done(new Error('No error'));
      } catch (e) {
        done();
      }
    });
  });

  describe('#getNode()', () => {
    it('should return loaded function', () => {
      expect(nodeMap.getNode('test')).to.be.an('function');
    });
  });
});
