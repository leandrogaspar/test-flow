const createDriver = require('./create-driver');

const defaultNodes = new Map();

defaultNodes.set('createDriver', createDriver);

module.exports = defaultNodes;
