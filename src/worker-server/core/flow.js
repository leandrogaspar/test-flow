const EventEmitter = require('events');
const { Events, LogLevel } = require('../common/events');

module.exports = class Flow extends EventEmitter {
  constructor(nodeMap, context) {
    super();
    this.context = context;
    this.nodeMap = nodeMap;
  }

  async run(flow) {
    this.log(LogLevel.DEBUG, `Starting flow ${flow.name}`);

    let running = true;
    let currentNode = flow.nodes[flow.startNode];
    let input;

    while (running) {
      if (!currentNode) {
        throw Error('Reached undefined node before flow end.');
      }

      // eslint-disable-next-line no-await-in-loop
      const nodeOutput = await this.runNode(currentNode, input);

      if (nodeOutput.nextNode) {
        currentNode = flow.nodes[nodeOutput.nextNode];
        input = nodeOutput.data;
      } else {
        running = false;
      }
    }

    this.log(LogLevel.DEBUG, `Executing defer functions on flow ${flow.name}`);
    await this.context.runDefer();
    this.log(LogLevel.DEBUG, `Finished flow ${flow.name}`);
  }

  /**
   * Run a node
   * @param {string} nodeName - The node to be runned
   * @param {object} input - Node input
   * @returns {object} NodeOutput
   */
  async runNode(currentNode, input) {
    this.log(LogLevel.DEBUG, `Starting node ${currentNode.name}`);

    try {
      const fn = this.nodeMap.getNode(currentNode.name);

      const nodeOutput = await fn(this.context, currentNode, input);

      this.log(LogLevel.DEBUG, `Finished node ${currentNode.name}`);
      return nodeOutput;
    } catch (e) {
      this.log(LogLevel.ERROR, `Error while running node ${currentNode.name}} ${e}`);
      throw Error(`Node ${currentNode.name} execution error: ${e}`);
    }
  }

  /**
   * Emits a log event
   * @param {any} data
   */
  log(level, msg) {
    this.emit(Events.FLOW_LOG, {
      level,
      msg,
    });
  }
};
