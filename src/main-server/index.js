const Koa = require('koa');
const KoaRouter = require('koa-router');
const bodyParser = require('koa-bodyparser');
const io = require('socket.io-client');

const { ws, selenium, rest } = require('test-flow-examples');

function sendFlow(flow) {
  return new Promise((resolve, reject) => {
    const socket = io('http://localhost:4001');

    const events = [];
    socket.on('connect', () => {
      socket.on('message', (data) => {
        events.push(data);
      });

      socket.on('connect_failed', () => {
        reject(new Error('Could not connect to worker'));
      });

      socket.emit('run', flow, (status) => {
        // eslint-disable-next-line no-console
        console.log(status);
        resolve(events);
        socket.close();
      });
    });
  });
}

function tempTemplate(flow, events) {
  let eventsTable = '';
  events.forEach((event) => {
    eventsTable += `<tr><td>${JSON.stringify(event)}</td></tr>`;
  });
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${flow.name}</title>
    </head>
    <body>
      <pre>${JSON.stringify(flow, null, 2)}</pre>
      <table>
        <thead><tr><td>Events</td></tr></thead>
        <tbody>${eventsTable}</tbody>
      </table>
    </body>
  </html>
  `;
}

const app = new Koa();
const router = new KoaRouter();

router.get('/ws', async (ctx) => {
  try {
    const events = await sendFlow(ws);
    ctx.body = tempTemplate(ws, events);
  } catch (e) {
    ctx.body = `Error${e}`;
  }
});

router.get('/selenium', async (ctx) => {
  try {
    const events = await sendFlow(selenium);
    ctx.body = tempTemplate(selenium, events);
  } catch (e) {
    ctx.body = `Error${e}`;
  }
});

router.get('/rest', async (ctx) => {
  try {
    const events = await sendFlow(rest);
    ctx.body = tempTemplate(rest, events);
  } catch (e) {
    ctx.body = `Error${e}`;
  }
});

app.use(bodyParser());
app.use(router.routes());

app.listen(4000);

// eslint-disable-next-line no-console
console.log('Main server listening on port 4000');
