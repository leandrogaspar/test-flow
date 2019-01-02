import * as fs from "fs";

//TODO maybe move all this chrome stuff to a node?
import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as chromedriver from "chromedriver";

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

export default class Context {

    private nodeMap: Map<string, Function> = new Map();

    // Temp place for the driver
    public driver;
    public async buildDriver() {
        this.driver = await new Builder().forBrowser('chrome').build();
    }

    public loadNodes(path: string) {
        console.log(`Loading nodes from path ${path}`);

        for (let file of fs.readdirSync(path)) {
            const fnPath = path + '/' + file;
            console.log(`Requiring function ${fnPath}`);
            const nodeModule = require(fnPath);
            this.nodeMap.set(nodeModule.name, nodeModule.node);
        }
    }

    public getNode(name: string): Function {
        return this.nodeMap.get(name);
    }
}