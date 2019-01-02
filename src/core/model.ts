export interface FlowNode {
    name: string;
    config: Object;
    nextNodes: Object;
}

export interface NodeOutput {
    nextNode: string;
    data: Object;
}

export interface FlowConfig {
    startNode: FlowNode;
    nodeMap: Object;
}
