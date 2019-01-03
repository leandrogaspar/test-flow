import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as chromedriver from "chromedriver";

import Context from "../core/context";
import { NodeConfig } from "../core/model";

export async function createDriver(context: Context, nodeConfig: NodeConfig, input: Object) {

    console.log(`Creating selenium driver ${nodeConfig.config.driverName} browser ${nodeConfig.config.browser}`);

    if (nodeConfig.config.browser === 'chrome') {
        chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
        const driver = await new Builder().forBrowser('chrome').build();
        context.set(nodeConfig.config.driverName, driver);

        context.defer(async () => { await driver.quit(); console.log('Driver quit'); });
    } else {
        throw Error('Not suported yet');
    }

    return { nextNode: nodeConfig.nextNodes.default };
}
