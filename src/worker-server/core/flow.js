module.exports = class Flow {
  constructor(nodeMap, context) {
    this.context = context;
    this.nodeMap = nodeMap;
  }

  async run(flow) {
    let running = true;
    let currentNode = flow.startNode;
    let input;

    while (running) {
      if (!currentNode) {
        throw Error('Reached undefined node before flow end.');
      }

      const fn = this.nodeMap.getNode(currentNode.name);

      let nodeOutput;
      try {
        // eslint-disable-next-line no-await-in-loop
        nodeOutput = await fn(this.context, currentNode, input);
      } catch (e) {
        throw Error(`Node ${currentNode.name} execution error: ${e}`);
      }

      if (nodeOutput.nextNode) {
        currentNode = flow.nodes[nodeOutput.nextNode];
        input = nodeOutput.data;
      } else {
        running = false;
      }
    }
    await this.context.runDefer();
  }
};
