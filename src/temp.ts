import Context from "./core/context";
import { FlowConfig } from "./core/model";
import Flow from "./core/flow";

const flowConfig: FlowConfig = {
    startNode: {
        name: 'open',
        config: {},
        nextNodes: {
            default: 'type'
        }
    },
    nodeMap: {
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

context.buildDriver()
    .then(ok => {
        console.log('Selenium driver ok')
        const flow = new Flow(context, flowConfig);

        flow.run()
            .then(ok => console.log(`Worked? ${ok}`))
            .catch(e => console.log(`Run failed ${e}`));


    })
    .catch(e => console.log(`Could not build selenium: ${e}`));

