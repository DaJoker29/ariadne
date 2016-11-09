const Twitter = require('twitter');
const config = require('./nonexistantfile.js'); // eslint-disable-line import/no-unresolved

/**
 * Twitter API
 */

const client = new Twitter(config);

function init(cb) {
  console.log('Checking Twitter Configuration...');
  if (!config.consumer_key || !config.consumer_secret
    || !config.access_token_key || !config.access_token_secret) {
    console.log('No Twitter API credentials found...');
    cb(Error('No Twitter API credentials.'));
  } else {
    console.log('Twitter configured...');
    cb();
  }
}

module.exports = Object.assign({}, { init }, client);