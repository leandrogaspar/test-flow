/* eslint-disable */
const { expect } = require('chai');
const Flow = require('../src/worker-server/core/flow');

class MockNodeMap {
  constructor() {
    this.nodeFn = null;
  }

  getNode(node) {
    return this.nodeFn;
  }
}

class MockContext {
  constructor() {
    this.deferCalled = false;
  }

  async runDefer() { this.deferCalled = true; }
}

describe('Flow', () => {
  let flow;
  let nodeMap;
  let context;

  before(() => {
  });

  after(() => {
  });

  beforeEach(() => {
    nodeMap = new MockNodeMap();
    context = new MockContext();
    flow = new Flow(nodeMap, context);
  });

  it('should instantiate a Flow', () => {
    expect(flow).to.exist;
  });

  describe('#run()', () => {
    it('should run a flow', async () => {
      const flowConfig = {
        startNode: "first",
        nodes: {
          first: {
            name: 'first',
            config: {},
            nextNodes: 'second',
          },
          second: {
            name: 'second',
            config: {},
            nextNodes: {},
          },
        },
      };
      nodeMap.nodeFn = () => {
        nodeMap.nodeFn = () => ({});
        return { nextNode: 'second' };
      };
      await flow.run(flowConfig);
    });

    it('should call runDefer after the flow', async () => {
      const flowConfig = {
        startNode: "first",
        nodes: {
          first: {
            name: 'first',
            config: {},
            nextNodes: 'second',
          },
          second: {
            name: 'second',
            config: {},
            nextNodes: {},
          },
        },
      };
      nodeMap.nodeFn = () => {
        nodeMap.nodeFn = () => ({});
        return { nextNode: 'second' };
      };
      await flow.run(flowConfig);
      expect(context.deferCalled).to.be.true;
    });
  });
});
