const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 3001
});

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        const request = JSON.parse(message);

        ws.send(JSON.stringify({ type: 'RESPONSE', request_id: request.request_id }));

        setTimeout(() => {
            ws.send(event('TEST'));
        }, 3000);
    });

    ws.send(event('OPEN'));
});

console.log('Ws server listening on port 3001!');


function event(event_type) {
    return JSON.stringify({ type: 'EVENT', event_type: event_type });
}