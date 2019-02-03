
const {
  createContainer, InjectionMode, asClass, asValue,
} = require('awilix');

const path = require('path');

const Context = require('./core/context');
const NodeMap = require('./core/node-map');
const Flow = require('./core/flow');

// Create the DI container
const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

// Register the classes
container.register({
  NODES_PATH: asValue(path.join(__dirname, '../../', 'node_modules/test-flow-examples/lib/nodes')),
  context: asClass(Context),
  nodeMap: asClass(NodeMap).singleton(),
  flow: asClass(Flow),
});


const io = require('socket.io')();
io.on('connection', function (client) {
  console.log('worker connection');

  client.scope = container.createScope();

  client.on('run', async function (flowConfig, done) {
    const flow = client.scope.resolve('flow');
    try {
      await flow.run(flowConfig);
      done(`Flow ok!\nFlow runned: \n${JSON.stringify(flowConfig, undefined, 2)}`);
    } catch (e) {
      done(`Error${e}`);
    }
  });

  client.on('disconnect', function () {
    console.log('disconnected');
  });
});
io.listen(4001);

// eslint-disable-next-line no-console
console.log('Worker server listening on port 4001');
