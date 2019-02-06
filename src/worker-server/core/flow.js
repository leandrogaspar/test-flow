const EventEmitter = require('events');
const { FlowEvents, event } = require('./events');

module.exports = class Flow extends EventEmitter {
  /**
   * Flow constructor
   * @param {NodeMap} nodeMap
   * @param {Context} context
   */
  constructor(nodeMap, context) {
    super();
    this.context = context;
    this.nodeMap = nodeMap;
    this.running = false;
    this.event = event.bind(this);
  }

  /**
   * @typedef {object} FlowConfig
   * @property {string} name - the flow name
   * @property {string} startNode - the name of first node
   * @property {object} nodes - map with all the NodeConfig objects
   */

  /**
   * Run the flow
   * @param {FlowConfig} flow - the flow config json
   * @returns {Promise<any>} resolves when it is done running
   */
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
      this.event(FlowEvents.DEFER_END);

      this.event(FlowEvents.END);
    } catch (e) {
      this.event(FlowEvents.ERROR, { msg: `Error ${e}` });
      throw e;
    }
  }

  /**
   * @typedef {object} NodeConfig
   * @property {string} name - the node name
   * @property {object} config - the node configuration object
   * @property {object} nextNodes - possible next nodes
   */

  /**
   * @typedef {object} NodeOutput
   * @property {string} nextNode - the name of the next node to be runned
   * @property {object} data - the output data object
   */

  /**
   * Run a node
   * @param {NodeConfig} currentNode - the node config json
   * @param {object} input - node input data
   * @returns {Promise<NodeOutput>} NodeOutput
   */
  async runNode(currentNode, input) {
    try {
      const node = this.nodeMap.getNode(currentNode.name);

      this.event(FlowEvents.NODE_START, { nodeName: currentNode.name });
      const nodeOutput = await node(this.context, currentNode, input);
      this.event(FlowEvents.NODE_END, { nodeName: currentNode.name });

      return nodeOutput;
    } catch (e) {
      throw Error(`Node ${currentNode.name} execution error: ${e}`);
    }
  }
};
