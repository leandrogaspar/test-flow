import * as fs from "fs";

//TODO maybe move all this chrome stuff to a node?
import { Builder} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as chromedriver from "chromedriver";

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

export default class Context {

    private functionMap: Map<string, Function> = new Map();

    // Temp place for the driver
    public driver;
    public async buildDriver() {
        this.driver = await new Builder().forBrowser('chrome').build();
    }

    public loadFunctions(path: string) {
        console.log(`Loading functions from path ${path}`);

        for (let file of fs.readdirSync(path)) {
            const fnPath = path + '/' + file;
            console.log(`Requiring function ${fnPath}`);
            const fn: Function = require(fnPath);
            this.functionMap.set(fnPath, fn);
        }
    }

    public getFunction(name: string): Function {
        return this.functionMap.get(name);
    }
}