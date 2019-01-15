import { createContainer, asClass, InjectionMode, Lifetime } from 'awilix';

import Context from "./core/context";
import Flow from "./core/flow";
import FolderNodeMap from "./core/folder-node-map";

const flows = [
    require('../examples/flows/ws-flow.json'),
    require('../examples/flows/selenium-flow.json'),
    require('../examples/flows/rest-flow.json')
];

// Create the DI container
const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
})

// Register the classes
container.register({
    context: asClass(Context),
    nodeMap: asClass(FolderNodeMap, { lifetime: Lifetime.SINGLETON }),
    flow: asClass(Flow)
})

const nodeMap = container.resolve<FolderNodeMap>('nodeMap');
nodeMap.loadFolder('C:/gitwork/test-flow/examples/functions');

for (const flowConfig of flows) {
    const flow = container.resolve<Flow>('flow');

    flow.run(flowConfig)
        .then(() => console.log('Flow done'))
        .catch(e => console.log(`Run failed ${e}`));
}
