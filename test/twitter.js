const assert = require('assert');
const twitter = require('../scripts/twitter.js');

describe('Twitter', () => {
  // before(() => {
  //   twitter.init();
  // });

  describe('init()', () => {
    it('should fail if no callback is specified', () => {
      assert.throws(twitter.init, /No Callback Provided/);
    });
  });
  describe('tweet()', () => {
    it('should fail if no message is provided', (done) => {
      twitter.tweet(null, (err) => {
        assert.deepEqual(err, Error('No Message Sent'));
        done();
      });
    });
    it('should throw an exception if it fails with no callback provided', () => {
      assert.throws(() => {
        twitter.tweet();
      }, /Failure with no callback/);
    });
  });
  describe('attach()', () => {
    it('should fail if no callback is specified', () => {
      assert.throws(() => {
        twitter.attach('testing');
      }, /No callback to return/);
    });
    it('should fail if no command argument is given', () => {
      assert.throws(() => {
        twitter.attach(() => {});
      }, /No command to watch/);
    });
    it('should fail if command is an empty string', () => {
      assert.throws(() => {
        twitter.attach('', () => {});
      }, /No command to watch/);
    });
    it('should fail if command is multiple words', () => {
      assert.throws(() => {
        twitter.attach('Some description', () => {});
      }, /No command to watch/);
    });
    it('should succeed if no description or usage is specified', () => {
      twitter.attach('desc', () => {});
      const commands = twitter.commands();
      assert.ok(commands.find(e => 'desc' === e.command));
    });
    it('should succeed if no usage is specified', () => {
      twitter.attach('usage', 'Some description', () => {});
      const commands = twitter.commands();
      assert.ok(commands.find(e => 'usage' === e.command));
    });
  });
});