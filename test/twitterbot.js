const assert = require('assert');
const twitterbot = require('../lib/twitterbot.js');

describe('Twitterbot', () => {
  describe('init()', () => {
    it('should fail if no callback is specified', () => {
      assert.throws(twitterbot.init, /No Callback Provided/);
    });
  });
  describe('tweet()', () => {
    it('should fail if no message is provided', (done) => {
      twitterbot.tweet(null, (err) => {
        assert.deepEqual(err, Error('No Message Sent'));
        done();
      });
    });
  });
  describe('attach()', () => {
    it('should fail if no callback is specified', () => {
      assert.throws(() => {
        twitterbot.attach('testing');
      }, /No callback to return/);
    });
    it('should fail if no command argument is given', () => {
      assert.throws(() => {
        twitterbot.attach(() => {});
      }, /No command to watch/);
    });
    it('should fail if command is an empty string', () => {
      assert.throws(() => {
        twitterbot.attach('', () => {});
      }, /No command to watch/);
    });
    it('should fail if command is multiple words', () => {
      assert.throws(() => {
        twitterbot.attach('Some description', () => {});
      }, /No command to watch/);
    });
    it('should succeed if no description or usage is specified', () => {
      twitterbot.attach('desc', () => {});
      const commands = twitterbot.commands();
      assert.ok(commands.find(e => 'desc' === e.command));
    });
    it('should succeed if no usage is specified', () => {
      twitterbot.attach('usage', 'Some description', () => {});
      const commands = twitterbot.commands();
      assert.ok(commands.find(e => 'usage' === e.command));
    });
  });
});