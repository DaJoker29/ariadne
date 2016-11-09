const assert = require('assert');
const fs = require('fs');

describe('Twitter', () => {
  before(() => {
    fs.rename('./config/twitter-config.js', './config/twitter-config-hidden.js');
  });

  it('should fail with no configuration', () => {
    assert.throws(() => {
      // eslint-disable-next-line global-require
      require('../scripts/twitter.js');
    }, Error);
  });

  after(() => {
    fs.rename('./config/twitter-config-hidden.js', './config/twitter-config.js');
  });
});