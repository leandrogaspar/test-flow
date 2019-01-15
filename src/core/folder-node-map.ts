import * as fs from "fs";

import defaultNodes from "../default-nodes";
import { INodeMap } from "./interfaces";

/**
 * This implementation loads all modules from a path
 */
export default class FolderNodeMap implements INodeMap {
    private nodeMap: Map<string, Function> = new Map();

    public getNode(name: string): Function {
        return this.nodeMap.get(name);
    }

    public loadFolder(path: string): void {
        console.log(`Loading nodes from path ${path}`);

        for (let file of fs.readdirSync(path)) {
            const fnPath = path + '/' + file;
            console.log(`Requiring function ${fnPath}`);
            const nodeModule = require(fnPath);

            if (defaultNodes.get(nodeModule.name)) {
                throw new Error(`Node name ${nodeModule.name} is reserved and cannot be used for custom nodes.`);
            }

            this.nodeMap.set(nodeModule.name, nodeModule.node);
        }

        this.nodeMap = new Map([...this.nodeMap, ...defaultNodes]);
    }
}