export interface NodeConfig {
    name: string;
    config: Object | any;
    nextNodes: Object | any;
}

export interface NodeOutput {
    nextNode: string;
    data: Object;
}

export interface FlowConfig {
    startNode: NodeConfig;
    nodeMap: Object;
}
