const Twitter = require('twitter');
const config = require('../config/twitter-config.js');

/**
 * Twitter API
 */


module.exports.init = (cb) => {
  console.log('Initializing Twitter...');
  console.log('Checking Twitter Configuration...');
  if (!config.consumer_key || !config.consumer_secret
    || !config.access_token_key || !config.access_token_secret) {
    console.log('No Twitter API credentials found...');
    cb(Error('No Twitter API credentials.'));
  } else {
    console.log('Twitter configured...');
    module.exports.client = new Twitter(config);
    cb();
  }
};