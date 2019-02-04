const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const io = require('socket.io-client');

const { ws, selenium, rest } = require('test-flow-examples');

function sendFlow(flow) {
  return new Promise((resolve, reject) => {
    const socket = io('http://localhost:4001');

    socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('main connect');

      socket.emit('run', flow, (status) => {
        resolve(status);
        socket.close();
      });

      socket.on('connect_failed', () => {
        reject(new Error('Could not connect to worker'));
      });
    });
  });
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
