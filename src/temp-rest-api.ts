import Context from "./core/context";
import { FlowConfig } from "./core/model";
import Flow from "./core/flow";

const flowConfig: FlowConfig = {
    startNode: {
        name: 'requestExample',
        config: {},
        nextNodes: {
            default: undefined
        }
    },
    nodeMap: {}
}

export default function restApiFlow() {
    const context = new Context();
    context.loadNodes('C:/gitwork/test-flow/functions');

    const flow = new Flow(context, flowConfig);

    flow.run()
        .then(() => console.log('rest api flow done'))
        .catch(e => console.log(`Run failed ${e}`));
}
