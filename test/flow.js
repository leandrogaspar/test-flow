/* eslint-disable */
const { expect } = require('chai');
const Flow = require('../src/worker-server/core/flow');
const { FlowEvents } = require('../src/worker-server/core/events');

class MockNodeMap {
  constructor() {
    this.nodeFn = () => { return { nextNode: null } };
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

    it('should run a flow', async () => {
      nodeMap.nodeFn = () => {
        nodeMap.nodeFn = () => ({});
        return { nextNode: 'second' };
      };
      await flow.run(flowConfig);
    });

    it('should call runDefer after the flow', async () => {
      nodeMap.nodeFn = () => {
        nodeMap.nodeFn = () => ({});
        return { nextNode: 'second' };
      };
      await flow.run(flowConfig);
      expect(context.deferCalled).to.be.true;
    });

    const events = [
      FlowEvents.START,
      FlowEvents.END,
      FlowEvents.DEFER_START,
      FlowEvents.DEFER_END,
    ];

    events.forEach(event => {
      it(`should emit event ${event}`, (done) => {
        nodeMap.nodeFn = () => {
          nodeMap.nodeFn = () => ({});
          return { nextNode: 'second' };
        };
        flow.on(event, () => done());
        flow.run(flowConfig).then();
      });
    });

    it('should emit error event on failures', (done) => {
      nodeMap.nodeFn = () => { throw new Error('flow error') };
      flow.on(FlowEvents.ERROR, () => done());
      flow.run(flowConfig).catch(e => null);
    });
  });

  describe('#runNode()', () => {
    const nodeConfig = {
      name: 'first',
      config: {},
    };

    it('should throw if the function is not found', async () => {
      try {
        await flow.runNode(nodeConfig);
        throw Error('Run node runned witouth function');
      } catch (e) { }
    });

    it('should run the node', async () => {
      const nodeOutput = { nextNode: 'second' };
      nodeMap.nodeFn = () => {
        nodeMap.nodeFn = () => ({});
        return nodeOutput;
      };
      const output = await flow.runNode(nodeConfig);
      expect(output).to.be.equal(nodeOutput);
    });

    const events = [
      FlowEvents.NODE_START,
      FlowEvents.NODE_END,
    ];

    events.forEach(event => {
      it(`should emit event ${event}`, (done) => {
        nodeMap.nodeFn = () => {
          nodeMap.nodeFn = () => ({});
          return { nextNode: 'second' };
        };
        flow.on(event, () => done());
        flow.runNode(nodeConfig).then();
      });
    });
  });
});
