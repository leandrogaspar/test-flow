async function waitTestEvent(context, nodeConfig, input) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`nodeConfig ${JSON.stringify(nodeConfig)}`);


    const client = context.storage.get(nodeConfig.config.clientName);
    const promise = new Promise((resolve, reject) => {

        const timeout = setTimeout(() => {
            reject('Event not received after 5s');
        }, 5000);

        client.addListener('TEST', (event) => {
            clearTimeout(timeout);
            resolve();
            console.log('Node processing test event=' + event);
        });
    });

    await promise;

    return { nextNode: nodeConfig.nextNodes.default };
}

module.exports = {
    name: "waitTestEvent",
    node: waitTestEvent
};
