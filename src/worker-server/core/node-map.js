/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const fs = require('fs');
const defaultNodes = require('../default-nodes');

/**
 * This implementation loads all modules from a path and the default nodes
 */
module.exports = class NodeMap {
  constructor(NODES_PATH) {
    this.nodeMap = new Map();
    this.loadFolder(NODES_PATH);
  }

  /**
     * Get a specified node function from it's name
     *
     * @param name The function name
     * @returns The specified function
     */
  getNode(name) {
    return this.nodeMap.get(name);
  }

  loadFolder(path) {
    fs.readdirSync(path).forEach((file) => {
      const fnPath = `${path}/${file}`;
      const nodeModule = require(fnPath);

      if (defaultNodes.get(nodeModule.name)) {
        throw new Error(`Node name ${nodeModule.name} is reserved and cannot be used for custom nodes.`);
      }

      this.nodeMap.set(nodeModule.name, nodeModule.node);
    });

    this.nodeMap = new Map([...this.nodeMap, ...defaultNodes]);
  }
};
