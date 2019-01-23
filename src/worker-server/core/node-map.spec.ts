import { expect } from 'chai';
import * as fs from 'fs';
import { NodeMap } from './node-map';

describe('NodeMap', function () {

    let nodeMap: NodeMap;
    const FOLDER_PATH = '/tmp-node-map';
    const FILE = 'tmp-node.js';
    const FULL_PATH = FOLDER_PATH + '/' + FILE;
    const FILE_CONTENT = `
        async function test(context, nodeConfig, input) {
            console.log('hey');
            return { nextNode: nodeConfig.nextNodes.default };
        }
        
        module.exports = {
            name: "test",
            node: test
        };
    `;

    before(function () {
        fs.mkdirSync(FOLDER_PATH);
        fs.writeFileSync(FULL_PATH, FILE_CONTENT);
    });

    after(function () {
        fs.unlinkSync(FULL_PATH);
        fs.rmdirSync(FOLDER_PATH);
    });

    beforeEach(function () {
        nodeMap = new NodeMap(FOLDER_PATH);
    });

    it('should instantiate a NodeMap', function () {
        expect(nodeMap).to.exist;
    });

    describe('#getNode()', function () {
        it('should return loaded function', function () {
            expect(nodeMap.getNode('test')).to.be.an('function');
        });
    });
});