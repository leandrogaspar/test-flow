import { expect } from 'chai';
import { Context } from './context';

describe('Context', function () {

    let context: Context;

    beforeEach(function () {
        context = new Context();
    });

    it('should instantiate a context', function () {
        expect(context).to.exist;
    });

    describe('storage', function () {
        it('is possible to set and get elements from context storage', function () {
            const [key, value] = ['testkey', {
                a: 'fasfas',
                b: () => { console.log(1); },
                c: { d: '231313' }
            }];
            context.storage.set(key, value);
            expect(context.storage.get(key)).to.deep.equal(value);
        });

        it('is possible to delete elements from context storage', function () {
            const [key, value] = ['testkey', {
                a: 'fasfas',
                b: () => { console.log(1); },
                c: { d: '231313' }
            }];
            context.storage.set(key, value);
            expect(context.storage.delete(key)).to.be.true;
        });
    });

    describe('#defer()', function () {
        it('should accept functions', function () {
            context.defer(() => { });
        });

        const tests = [
            { arg: 'string' },
            { arg: { a: 'object' } },
            { arg: 42 },
            { arg: true },
            { arg: null },
            { arg: undefined }
        ]

        tests.forEach(function (test) {
            it(`throws TypeError for invalid type: ${typeof test.arg}`, function () {
                expect(context.defer.bind(test.arg)).to.throw('You can only defer functions');
            });
        });
    });

    describe('#runDefer()', function () {
        it('should call deferred functions LIFO', async function () {
            let [firstFlag, lastFlag] = [false, false];

            // The lastFlag should be already set since it is LIFO
            const firstAdded = () => {
                if (firstFlag) {
                    throw Error('First was already called');
                }
                firstFlag = true;
                if (!lastFlag) {
                    throw Error('Last should be called before first');
                }
            };

            const lastAdded = () => {
                if (firstFlag) {
                    throw Error('First was called before second');
                }
                if (lastFlag) {
                    throw Error('Last was already called');
                }
                lastFlag = true;
            }
            context.defer(firstAdded);
            context.defer(lastAdded);
            await context.runDefer();
        });
    });
});