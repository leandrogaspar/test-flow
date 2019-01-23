const WebSocket = require('ws');

class Client {
    constructor(url, connectTimeout) {
        this.url = url;
        this.connectTimeout = connectTimeout;
        this.listeners = new Map();
        this.events = new Map();
        this.callbacks = new Map();
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.url);

            const timeout = setTimeout(() => {
                reject('Connection timeout');
            }, this.connectTimeout);

            this.ws.on('open', () => {
                clearTimeout(timeout);
                resolve();
            });

            this.ws.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });

            this.ws.on('message', (message) => {
                console.log('Received message=' + message);
                const messageObj = JSON.parse(message);
                if (messageObj.type === 'EVENT') {
                    this.onEvent(messageObj);
                } else {
                    this.onResponse(messageObj);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject('Close timeout');
            }, this.connectTimeout);

            this.ws.on('close', () => {
                clearTimeout(timeout);
                resolve();
            });

            this.ws.close();
        });
    }

    request(data) {
        return new Promise((resolve, reject) => {
            const request = {
                type: 'REQUEST',
                request_id: Date.now(),
                ...data
            };

            const timeout = setTimeout(() => {
                reject('Close timeout');
            }, this.connectTimeout);

            this.callbacks.set(request.request_id, (response) => {
                clearTimeout(timeout);
                resolve(response);
            });

            this.ws.send(JSON.stringify(request));
        });

    }

    onResponse(response) {
        console.log('on response' + response);
        this.callbacks.get(response.request_id)(response);
    }

    onEvent(event) {
        // There is a listener? Process right away
        const listener = this.listeners.get(event.event_type);
        if (listener) {
            return listener(event);
        }

        // No listener? Store for later..
        const eventArray = this.events.get(event.event_type);
        if (eventArray) {
            eventArray.push(event);
        } else {
            this.events.set(event.event_type, new Array(event));
        }
    }

    addListener(event_type, listener) {
        const eventArray = this.events.get(event_type);
        if (eventArray) {
            this.events.delete(event_type); // Clean the queue, we will process everybody
            for (event of eventArray) {
                console.log('Processing event=' + event);
                listener(event);
            }
        }
        this.listeners.set(event_type, listener);
    }
}

async function createWs(context, nodeConfig, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`nodeConfig ${JSON.stringify(nodeConfig)}`);

    const client = new Client(nodeConfig.config.url, nodeConfig.config.connectTimeout);
    context.defer(async () => { await client.close(); console.log('Client closed'); });
    context.storage.set(nodeConfig.config.clientName, client);

    await client.connect();

    return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
    name: "createWs",
    node: createWs
};
