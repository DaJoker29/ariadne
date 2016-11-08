const assert = require('assert');
const ding = require('../scripts/ding.js');

describe('Ding', () => {
  it('should complete with valid configuration', (done) => {
    ding.init('main', (err) => {
      assert.equal(err, null);
      done();
    });
  });

  it('should fail with no Mailgun credentials.', (done) => {
    ding.init('no-auth', (err) => {
      assert.equal(err.message, 'Authentication not configured');
      done();
    });
  });

  it('should fail with no email targets.', (done) => {
    ding.init('no-email', (err) => {
      assert.equal(err.message, 'No email targets configured');
      done();
    });
  });

  it('should fail with no configuration.', (done) => {
    ding.init('none', (err) => {
      assert.equal(err.message, 'No configuration file provided');
      done();
    });
  });
});