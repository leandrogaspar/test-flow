import { NodeOutput, FlowConfig } from "../../common";
import { INodeMap, IContext } from "./interfaces";

export default class Flow {

    private nodeMap: INodeMap;
    private context: IContext;

    constructor(nodeMap: INodeMap, context: IContext) {
        this.context = context;
        this.nodeMap = nodeMap;
    }

    async run(flow: FlowConfig) {
        let running = true;
        let currentNode = flow.startNode;
        let input: object;

        while (running) {
            if (!currentNode) {
                throw Error('Reached undefined node before flow end was reached');
            }

            const fn = this.nodeMap.getNode(currentNode.name);

            let nodeOutput: NodeOutput;
            try {
                console.log(`Running node ${currentNode.name}`);
                nodeOutput = await fn(this.context, currentNode, input);
            } catch (e) {
                throw Error(`Node ${currentNode.name} execution error: ${e}`);
            }

            console.log(`Node ${currentNode.name} done.`);

            if (nodeOutput.nextNode) {
                currentNode = flow.nodes[nodeOutput.nextNode];
                input = nodeOutput.data;
            } else {
                running = false;
            }
        }

        console.log('Flow ended');
        await this.context.runDefer();
    }
}
