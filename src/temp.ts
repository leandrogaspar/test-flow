import Context from "./core/context";
import { FlowConfig } from "./core/model";
import Flow from "./core/flow";

const flowConfig: FlowConfig = {
    startNode: {
        name: 'C:/gitwork/test-flow/functions/open.js',
        config: {},
        nextNodes: {
            default: 'C:/gitwork/test-flow/functions/typeWebdriver.js'
        }
    },
    nodeMap: {
        'C:/gitwork/test-flow/functions/typeWebdriver.js': {
            name: 'C:/gitwork/test-flow/functions/typeWebdriver.js',
            config: {},
            nextNodes: {
                default: 'C:/gitwork/test-flow/functions/checkTitle.js'
            }
        },
        'C:/gitwork/test-flow/functions/checkTitle.js': {
            name: 'C:/gitwork/test-flow/functions/checkTitle.js',
            config: {},
            nextNodes: {
                default: undefined
            }
        }
    }
}

const context = new Context();
context.loadFunctions('C:/gitwork/test-flow/functions');

context.buildDriver()
    .then(ok => {
        console.log('Selenium driver ok')
        const flow = new Flow(context, flowConfig);

        flow.run()
            .then(ok => console.log(`Worked? ${ok}`))
            .catch(e => console.log(`Run failed ${e}`));

        
    })
    .catch(e => console.log(`Could not build selenium: ${e}`));

