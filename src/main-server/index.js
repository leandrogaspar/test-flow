const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const request = require('request-promise');

const { ws, selenium, rest } = require('test-flow-examples');

async function sendFlow(flow) {
  const options = {
    method: 'POST',
    uri: 'http://localhost:4001/run',
    body: flow,
    json: true,
  };
  return request(options);
}

// temp stuff
const flows = {
  ws,
  selenium,
  rest,
};

const app = new Koa();
const router = new KoaRouter();

router.get('/ws', async (ctx) => {
  try {
    const res = await sendFlow(flows.ws);
    ctx.body = res;
  } catch (e) {
    ctx.body = `Error${e}`;
  }
});

router.get('/selenium', async (ctx) => {
  try {
    const res = await sendFlow(flows.selenium);
    ctx.body = res;
  } catch (e) {
    ctx.body = `Error${e}`;
  }
});

router.get('/rest', async (ctx) => {
  try {
    const res = await sendFlow(flows.rest);
    ctx.body = res;
  } catch (e) {
    ctx.body = `Error${e}`;
  }
});

app.use(bodyParser());
app.use(router.routes());

app.listen(4000);

// eslint-disable-next-line no-console
console.log('Main server listening on port 4000');
