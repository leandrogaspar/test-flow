import * as fs from "fs";

import defaultNodes from "../default-nodes";

export default class Context {

    private nodeMap: Map<string, Function> = new Map();
    private map: Map<string, any> = new Map();

    public get(key: string) {
        return this.map.get(key);
    }

    public set(key: string, value: any) {
        return this.map.set(key, value);
    }

    public delete(key: string) {
        return this.map.delete(key);
    }

    public loadNodes(path: string) {
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

    public getNode(name: string): Function {
        return this.nodeMap.get(name);
    }
}