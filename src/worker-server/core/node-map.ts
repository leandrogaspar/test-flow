import * as fs from "fs";

import defaultNodes from "../default-nodes";

/**
 * This implementation loads all modules from a path and the default nodes
 */
export class NodeMap {

    private nodeMap: Map<string, Function> = new Map();

    constructor(NODES_PATH: string) {
        this.loadFolder(NODES_PATH);
    }

    /**
     * Get a specified node function from it's name
     * 
     * @param name The function name
     * @returns The specified function
     */
    public getNode(name: string): Function {
        return this.nodeMap.get(name);
    }

    private loadFolder(path: string): void {
        for (let file of fs.readdirSync(path)) {
            const fnPath = path + '/' + file;
            const nodeModule = require(fnPath);

            if (defaultNodes.get(nodeModule.name)) {
                throw new Error(`Node name ${nodeModule.name} is reserved and cannot be used for custom nodes.`);
            }

            this.nodeMap.set(nodeModule.name, nodeModule.node);
        }

        this.nodeMap = new Map([...this.nodeMap, ...defaultNodes]);
    }
}