/* eslint-disable */
const { expect } = require('chai');
const Context = require('../src/worker-server/core/context');

describe('Context', () => {
  let context;

  beforeEach(() => {
    context = new Context();
  });

  it('should instantiate a context', () => {
    expect(context).to.exist;
  });

  describe('storage', () => {
    it('is possible to set and get elements from context storage', () => {
      const [key, value] = ['testkey', {
        a: 'fasfas',
        b: () => { console.log(1); },
        c: { d: '231313' },
      }];
      context.storage.set(key, value);
      expect(context.storage.get(key)).to.deep.equal(value);
    });

    it('is possible to delete elements from context storage', () => {
      const [key, value] = ['testkey', {
        a: 'fasfas',
        b: () => { console.log(1); },
        c: { d: '231313' },
      }];
      context.storage.set(key, value);
      expect(context.storage.delete(key)).to.be.true;
    });
  });

  describe('#defer()', () => {
    it('should accept functions', () => {
      context.defer(() => { });
    });

    const tests = [
      { arg: 'string' },
      { arg: { a: 'object' } },
      { arg: 42 },
      { arg: true },
      { arg: null },
      { arg: undefined },
    ];

    tests.forEach((test) => {
      it(`throws TypeError for invalid type: ${typeof test.arg}`, () => {
        expect(context.defer.bind(test.arg)).to.throw('You can only defer functions');
      });
    });
  });

  describe('#runDefer()', () => {
    it('should call deferred functions LIFO', async () => {
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
      };
      context.defer(firstAdded);
      context.defer(lastAdded);
      await context.runDefer();
    });
  });
});
