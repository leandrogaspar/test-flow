const EventEmitter = require('events');
const uuid = require('uuid/v4');
const { FlowEvents, emit } = require('../common/events');

module.exports = class Flow extends EventEmitter {
  constructor(nodeMap, context) {
    super();
    this.context = context;
    this.nodeMap = nodeMap;
    this.running = false;
    this.id = uuid();
    this.event = emit.bind(this);
  }

  async run(flow) {
    try {
      this.event(FlowEvents.START);

      this.running = true;
      let currentNode = flow.nodes[flow.startNode];
      let input;

      while (this.running) {
        if (!currentNode) {
          throw Error('Reached undefined node before flow end.');
        }

        // eslint-disable-next-line no-await-in-loop
        const nodeOutput = await this.runNode(currentNode, input);

        if (nodeOutput.nextNode) {
          currentNode = flow.nodes[nodeOutput.nextNode];
          input = nodeOutput.data;
        } else {
          this.running = false;
        }
      }

      this.event(FlowEvents.DEFER_START);
      await this.context.runDefer();
      this.event(FlowEvents.END);
    } catch (e) {
      this.event(FlowEvents.ERROR, { msg: `Error ${e}` });
      throw e;
    }
  }

  /**
   * Run a node
   * @param {string} nodeName - The node to be runned
   * @param {object} input - Node input
   * @returns {object} NodeOutput
   */
  async runNode(currentNode, input) {
    this.event(FlowEvents.NODE_START, { nodeName: currentNode.name });

    try {
      const node = this.nodeMap.getNode(currentNode.name);
      const nodeOutput = await node(this.context, currentNode, input);

      this.event(FlowEvents.NODE_END, { nodeName: currentNode.name });
      return nodeOutput;
    } catch (e) {
      throw Error(`Node ${currentNode.name} execution error: ${e}`);
    }
  }
};
