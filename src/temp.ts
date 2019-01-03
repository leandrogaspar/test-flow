import Context from "./core/context";
import { FlowConfig } from "./core/model";
import Flow from "./core/flow";

const flowConfig: FlowConfig = {
    startNode: {
        name: 'createDriver',
        config: {
            browser: 'chrome',
            driverName: 'browser1'
        },
        nextNodes: {
            default: 'open'
        }
    },
    nodeMap: {
        'open': {
            name: 'open',
            config: {
                driver: 'browser1'
            },
            nextNodes: {
                default: 'type'
            }
        },
        'type': {
            name: 'type',
            config: {
                driver: 'browser1'
            },
            nextNodes: {
                default: 'check'
            }
        },
        'check': {
            name: 'check',
            config: {
                driver: 'browser1'
            },
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
    .then(() => console.log('done'))
    .catch(e => console.log(`Run failed ${e}`));

