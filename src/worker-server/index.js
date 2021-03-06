
const {
  createContainer, InjectionMode, asClass, asValue,
} = require('awilix');
const io = require('socket.io')();
const path = require('path');

const Context = require('./core/context');
const NodeMap = require('./core/node-map');
const Flow = require('./core/flow');
const { FlowEvents } = require('./core/events');

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

io.on('connection', (client) => {
  const scope = container.createScope();

  client.on('run', async (flowConfig, done) => {
    const flow = scope.resolve('flow');

    Object.values(FlowEvents).forEach((event) => {
      flow.on(event, (data) => {
        client.send(data);
      });
    });

    try {
      await flow.run(flowConfig);
      done('Flow ok!');
    } catch (e) {
      done(`Error${e}`);
    }
  });
});
io.listen(4001);

// eslint-disable-next-line no-console
console.log('Worker server listening on port 4001');
