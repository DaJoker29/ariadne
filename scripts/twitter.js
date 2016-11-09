const Twitter = require('twitter');
const config = require('../config/twitter-config.js');

/**
 * Twitter API
 */

const client = new Twitter(config);

module.exports = client;