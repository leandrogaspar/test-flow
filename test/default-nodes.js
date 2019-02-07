/* eslint-disable */
const defaultNodes = require('../src/worker-server/default-nodes');

describe('delay.js', () => {
  it('should run', async () => {
    const delay = defaultNodes.get('delay');
    await delay(null, { config: { ms: 0 } });
  });

  it('should require config ms', (done) => {
    const delay = defaultNodes.get('delay');
    delay(null, {})
      .catch(e => done());
  });
});
