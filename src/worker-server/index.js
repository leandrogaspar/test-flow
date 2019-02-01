
const {
  createContainer, InjectionMode, asClass, asValue,
} = require('awilix');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
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
  NODES_PATH: asValue(path.join(__dirname, '../../', 'examples/functions')),
  context: asClass(Context),
  nodeMap: asClass(NodeMap).singleton(),
  flow: asClass(Flow),
});

const app = new Koa();
const router = new KoaRouter();

router.post('/run', async (ctx) => {
  const flow = ctx.scope.resolve('flow');
  try {
    const flowConfig = ctx.request.body;
    await flow.run(flowConfig);
    ctx.body = `Flow ok!\nFlow runned: \n${JSON.stringify(flowConfig, undefined, 2)}`;
  } catch (e) {
    ctx.body = `Error${e}`;
  }
});

// Midlewares
app.use(bodyParser());
app.use((ctx, next) => {
  ctx.scope = container.createScope();
  return next();
});
app.use(router.routes());

app.listen(4001);

// eslint-disable-next-line no-console
console.log('Worker server listening on port 4001');
