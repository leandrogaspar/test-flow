import { expect } from 'chai';
import { Flow } from './flow';
import { NodeMap } from './node-map';
import { Context } from './context';
import { FlowConfig } from '../../common';


class MockNodeMap {
    public nodeFn: () => any;
    public getNode(node: string): () => any {
        return this.nodeFn;
    };
}

class MockContext {
    deferCalled = false;
    public async runDefer() { this.deferCalled = true; };
}

describe('Flow', function () {

    let flow: Flow;
    let nodeMap;
    let context;

    before(function () {
    });

    after(function () {
    });

    beforeEach(function () {
        nodeMap = new MockNodeMap() as unknown as NodeMap;
        context = new MockContext() as unknown as Context;
        flow = new Flow(nodeMap, context);
    });

    it('should instantiate a Flow', function () {
        expect(flow).to.exist;
    });

    describe('#run()', function () {
        it('should run a flow', async function () {
            const flowConfig: FlowConfig = {
                startNode: {
                    name: 'first',
                    config: {},
                    nextNodes: 'second'
                },
                nodes: {
                    second: {
                        name: 'second',
                        config: {},
                        nextNodes: {}
                    }
                }
            };
            nodeMap.nodeFn = () => {
                nodeMap.nodeFn = () => { return {}; }
                return { nextNode: 'second' }
            };
            await flow.run(flowConfig);
        });

        it('should call runDefer after the flow', async function() {
            const flowConfig: FlowConfig = {
                startNode: {
                    name: 'first',
                    config: {},
                    nextNodes: 'second'
                },
                nodes: {
                    second: {
                        name: 'second',
                        config: {},
                        nextNodes: {}
                    }
                }
            };
            nodeMap.nodeFn = () => {
                nodeMap.nodeFn = () => { return {}; }
                return { nextNode: 'second' }
            };
            await flow.run(flowConfig);
            expect(context.deferCalled).to.be.true;
        });
    });
});