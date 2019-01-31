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
        reject(new Error('Connection timeout'));
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
        reject(new Error('Close timeout'));
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
        ...data,
      };

      const timeout = setTimeout(() => {
        reject(new Error('Close timeout'));
      }, this.connectTimeout);

      this.callbacks.set(request.request_id, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });

      this.ws.send(JSON.stringify(request));
    });
  }

  onResponse(response) {
    this.callbacks.get(response.request_id)(response);
  }

  onEvent(event) {
    // There is a listener? Process right away
    const listener = this.listeners.get(event.event_type);
    if (listener) {
      listener(event);
      return;
    }

    // No listener? Store for later..
    const eventArray = this.events.get(event.event_type);
    if (eventArray) {
      eventArray.push(event);
    } else {
      this.events.set(event.event_type, new Array(event));
    }
  }

  addListener(eventType, listener) {
    const eventArray = this.events.get(eventType);
    if (eventArray) {
      this.events.delete(eventType); // Clean the queue, we will process everybody
      eventArray.forEach((event) => {
        listener(event);
      });
    }
    this.listeners.set(eventType, listener);
  }
}

async function createWs(context, nodeConfig) {
  const client = new Client(nodeConfig.config.url, nodeConfig.config.connectTimeout);
  context.defer(async () => { await client.close(); });
  context.storage.set(nodeConfig.config.clientName, client);

  await client.connect();

  return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
  name: 'createWs',
  node: createWs,
};
