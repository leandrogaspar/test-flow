export interface FlowConfig {
    startNode: NodeConfig;
    nodes: object;
}

export interface NodeConfig {
    name: string;
    config: object;
    nextNodes: object | any;
}

export interface NodeOutput {
    nextNode: string;
    data: object;
}

export enum Browsers {
    CHROME = 'chrome'
}

export interface DriverConfig {
    browser: string;
    driverName: Browsers | string;
}

export interface CreateDriverConfig extends NodeConfig {
    config: DriverConfig;
}
