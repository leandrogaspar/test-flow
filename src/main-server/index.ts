import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as request from 'request-promise';
import * as bodyParser from 'koa-bodyparser';

async function sendFlow(flow) {
    const options = {
        method: 'POST',
        uri: 'http://localhost:4001/run',
        body: flow,
        json: true
    };
    return request(options);
}

// temp stuff
const flows = {
    ws: require('../../examples/flows/ws-flow.json'),
    selenium: require('../../examples/flows/selenium-flow.json'),
    rest: require('../../examples/flows/rest-flow.json')
};

const app = new Koa();
const router = new KoaRouter();

router.get('/ws', async ctx => {
    try {
        const res = await sendFlow(flows.ws);
        ctx.body = res;
    } catch (e) {
        ctx.body = 'Error' + e;
    }
});

router.get('/selenium', async ctx => {
    try {
        const res = await sendFlow(flows.selenium);
        ctx.body = res;
    } catch (e) {
        ctx.body = 'Error' + e;
    }
});

router.get('/rest', async ctx => {
    try {
        const res = await sendFlow(flows.rest);
        ctx.body = res;
    } catch (e) {
        ctx.body = 'Error' + e;
    }
});

app.use(bodyParser());
app.use(router.routes());

app.listen(4000);

console.log('Main server listening on port 4000');
