import Context from "./core/context";
import { FlowConfig } from "./core/model";
import Flow from "./core/flow";

const flowConfig: FlowConfig = {
    startNode: {
        name: 'createWs',
        config: {
            url: 'ws://localhost:3001',
            connectTimeout: 10000,
            clientName: 'client'
        },
        nextNodes: {
            default: 'sendWsRequest'
        }
    },
    nodeMap: {
        'sendWsRequest': {
            name: 'sendWsRequest',
            config: {
                clientName: 'client'
            },
            nextNodes: {
                default: 'waitTestEvent'
            }
        },
        'waitTestEvent': {
            name: 'waitTestEvent',
            config: {
                clientName: 'client'
            },
            nextNodes: {
                default: undefined
            }
        },
    }
}

export default function wsFlow() {
    const context = new Context();
    context.loadNodes('C:/gitwork/test-flow/functions');

    const flow = new Flow(context, flowConfig);

    flow.run()
        .then(() => console.log('WebSocket flow done'))
        .catch(e => console.log(`Run failed ${e}`));
}
