/* eslint-disable no-console */
const WebSocket = require('ws');

function event(eventType) {
  return JSON.stringify({ type: 'EVENT', event_type: eventType });
}

const wss = new WebSocket.Server({
  port: 3001,
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const request = JSON.parse(message);

    ws.send(JSON.stringify({ type: 'RESPONSE', request_id: request.request_id }));

    setTimeout(() => {
      ws.send(event('TEST'));
    }, 3000);
  });

  ws.send(event('OPEN'));
});

console.log('Ws server listening on port 3001!');
