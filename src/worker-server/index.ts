import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { createContainer, InjectionMode, asClass, asValue } from 'awilix';

import { Context } from './core/context';
import { NodeMap } from './core/node-map';
import { Flow } from './core/flow';

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

// temp stuff
const flows = [
    require('../../examples/flows/ws-flow.json'),
    require('../../examples/flows/selenium-flow.json'),
    require('../../examples/flows/rest-flow.json')
];

const app = new Koa();
const router = new KoaRouter();

router.get('/ws', async ctx => {
    const flow = ctx.scope.resolve('flow') as Flow;
    try {
        await flow.run(flows[0]);
        ctx.body = 'Ws ok!';
    } catch (e) {
        ctx.body = 'Error' + e;
    }
});

router.get('/selenium', async ctx => {
    const flow = ctx.scope.resolve('flow') as Flow;
    try {
        await flow.run(flows[1]);
        ctx.body = 'Selenium ok!';
    } catch (e) {
        ctx.body = 'Error' + e;
    }
});

router.get('/rest', async ctx => {
    const flow = ctx.scope.resolve('flow') as Flow;
    try {
        await flow.run(flows[2]);
        ctx.body = 'Rest ok!';
    } catch (e) {
        ctx.body = 'Error' + e;
    }
});

app.use((ctx, next) => {
    ctx.scope = container.createScope();
    return next();
});

app.use(router.routes());

app.listen(4000);


console.log('Worker server listening on port 4000');
