import { Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import * as chromedriver from "chromedriver";

import { IContext } from "../core/interfaces";
import { Browsers, CreateDriverConfig } from "../../common";

// This shouldn't be executed everytime the node is callled
// Not sure if it is the best place but will be here for now
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

export async function createDriver(context: IContext, nodeConfig: CreateDriverConfig) {
    console.log(`Creating selenium driver ${nodeConfig.config.driverName} browser ${nodeConfig.config.browser}`);

    if (nodeConfig.config.browser === Browsers.CHROME) {
        const driver = await new Builder().forBrowser('chrome').build();
        context.set(nodeConfig.config.driverName, driver);

        context.defer(async () => { await driver.quit(); console.log('Driver quit'); });
    } else {
        throw Error('Not suported yet');
    }

    return { nextNode: nodeConfig.nextNodes.default };
}
