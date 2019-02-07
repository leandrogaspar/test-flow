const delay = require('./delay');

const defaultNodes = new Map();
defaultNodes.set(delay.name, delay.node);

module.exports = defaultNodes;
