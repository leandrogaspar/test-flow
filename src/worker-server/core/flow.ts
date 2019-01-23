import { NodeOutput, FlowConfig } from "../../common";
import { Context } from "./context";
import { NodeMap } from "./node-map";

export class Flow {

    private nodeMap: NodeMap;
    private context: Context;

    constructor(nodeMap: NodeMap, context: Context) {
        this.context = context;
        this.nodeMap = nodeMap;
    }

    async run(flow: FlowConfig) {
        let running = true;
        let currentNode = flow.startNode;
        let input: object;

        while (running) {
            if (!currentNode) {
                throw Error('Reached undefined node before flow end.');
            }

            const fn = this.nodeMap.getNode(currentNode.name);

            let nodeOutput: NodeOutput;
            try {
                nodeOutput = await fn(this.context, currentNode, input);
            } catch (e) {
                throw Error(`Node ${currentNode.name} execution error: ${e}`);
            }

            if (nodeOutput.nextNode) {
                currentNode = flow.nodes[nodeOutput.nextNode];
                input = nodeOutput.data;
            } else {
                running = false;
            }
        }
        await this.context.runDefer();
    }
}
