const assert = require('assert');

describe('Twitter', () => {
  it('should fail if configuration file does not exist', () => {
    assert.throws(() => {
      // eslint-disable-next-line global-require
      require('./twitter/no-config-file.js');
    });
  });

  it('should fail if no configuration values are provided', (done) => {
    // eslint-disable-next-line global-require
    const twitter = require('./twitter/no-credentials.js');
    twitter.init((err) => {
      assert.equal(err.message, 'No Twitter API credentials.');
      done();
    });
  });
});