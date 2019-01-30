import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { createContainer, InjectionMode, asClass, asValue } from 'awilix';

import { Context } from './core/context';
import { NodeMap } from './core/node-map';
import { Flow } from './core/flow';
import { FlowConfig } from '../common';

// Create the DI container
const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
});

// Register the classes
container.register({
    NODES_PATH: asValue('C:/gitwork/test-flow/examples/functions'),
    context: asClass(Context),
    nodeMap: asClass(NodeMap).singleton(),
    flow: asClass(Flow)
});

const app = new Koa();
const router = new KoaRouter();

router.post('/run', async ctx => {
    const flow = ctx.scope.resolve('flow') as Flow;
    try {
        const flowConfig: FlowConfig = ctx.request.body;
        await flow.run(flowConfig);
        ctx.body = `Flow ok!\nFlow runned: \n${JSON.stringify(flowConfig, undefined, 2)}`;
    } catch (e) {
        ctx.body = 'Error' + e;
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

console.log('Worker server listening on port 4001');
