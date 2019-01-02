import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as chromedriver from "chromedriver";

import Context from "../core/context";
import { NodeConfig } from "../core/model";

export async function createDriver(context: Context, nodeConfig: NodeConfig, input: Object) {
    console.log(`context ${JSON.stringify(context)}`);
    console.log(`input ${JSON.stringify(input)}`);
    console.log(`config ${JSON.stringify(nodeConfig)}`);

    if (nodeConfig.config.browser === 'chrome') {
        chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
        const driver = await new Builder().forBrowser('chrome').build();
        context.set('driver', driver);
    } else {
        return Promise.reject('Not suported yet');
    }

    return { nextNode: nodeConfig.nextNodes.default };
}
