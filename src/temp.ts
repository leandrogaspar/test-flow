import Context from "./core/context";
import { FlowConfig } from "./core/model";
import Flow from "./core/flow";

const flowConfig: FlowConfig = {
    startNode: {
        name: 'createDriver',
        config: {
            browser: 'chrome'
        },
        nextNodes: {
            default: 'open'
        }
    },
    nodeMap: {
        'open': {
            name: 'open',
            config: {},
            nextNodes: {
                default: 'type'
            }
        },
        'type': {
            name: 'type',
            config: {},
            nextNodes: {
                default: 'check'
            }
        },
        'check': {
            name: 'check',
            config: {},
            nextNodes: {
                default: undefined
            }
        }
    }
}

const context = new Context();
context.loadNodes('C:/gitwork/test-flow/functions');

const flow = new Flow(context, flowConfig);

flow.run()
    .then(ok => console.log(`Worked? ${ok}`))
    .catch(e => console.log(`Run failed ${e}`));

