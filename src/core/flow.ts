import { NodeConfig, NodeOutput, FlowConfig } from "./model";
import Context from "./context";

export default class Flow {

    private context: Context;
    private startNode: NodeConfig;
    private nodeMap: Object;

    constructor(context: Context, config: FlowConfig) {
        this.context = context;
        this.startNode = config.startNode;
        this.nodeMap = config.nodeMap;
    }

    async run() {
        let running = true;
        let currentNode = this.startNode;
        let input;

        while (running) {
            if (!currentNode) {
                return Promise.reject('Undefined node before flow end was reached');
            }

            console.log(`Running node ${currentNode.name}`);
            const fn = this.context.getNode(currentNode.name);

            let nodeOutput: NodeOutput;
            try {
                nodeOutput = await fn(this.context, currentNode, input);
            } catch (e) {
                return Promise.reject(`Node ${currentNode.name} execution error: ${e}`);
            }

            console.log(`Node ${currentNode.name} done.`);

            if (nodeOutput.nextNode) {
                currentNode = this.nodeMap[nodeOutput.nextNode];
                input = nodeOutput.data;
            } else {
                running = false;
            }
        }

        console.log('Flow ended');
    }
}
