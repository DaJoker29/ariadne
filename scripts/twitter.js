const Twitter = require('twitter');
const schedule = require('node-schedule');
const config = require('../config/twitter-config.js');
const _ = require('lodash');
/**
 * Twitter API
 */

let client = {};
const tweetHandlers = [];
const timers = {};
const screenNames = ['_aribot'];

const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
});

module.exports.init = (cb) => {
  console.log('Initializing Twitter...');
  console.log('Checking Twitter Configuration...');
  if (!config.consumer_key || !config.consumer_secret
    || !config.access_token_key || !config.access_token_secret) {
    console.log('No Twitter API credentials found...');
    cb(Error('No Twitter API credentials.'));
  } else {
    console.log('Twitter configured...');
    console.log(`Watching users: ${screenNames.join(',')}`);
    client = new Twitter(config);

    // Start watching stream
    client.stream('statuses/filter', { track: screenNames.join(',') }, (stream) => {
      stream.on('data', (event) => {
        if (isTweet(event)) {
          const cmd = event.text.split(' ')[1];
          tweetHandlers.forEach((handler) => {
            if (handler.cmd.toLowerCase() === cmd.toLowerCase()) {
              handler.cb(event.text.split(' ').slice(2));
            }
          });
        }
      });

      // Handle stream errors
      stream.on('error', (err) => {
        console.log(`STREAMING ERROR: ${err}`);
      });
    });

    // Return client for syncronous modules (Ding)
    cb(null, client);
  }
};

module.exports.attach = (command, callback) => {
  tweetHandlers.push({ cmd: command, cb: callback });
  console.log(`COMMAND HANDLER ADDED: '${command}'`);
};

module.exports.schedule = (id, interval, callback) => {
  timers[id] = schedule.scheduleJob(interval, callback);
  console.log(`TIMER ADDED: ${id}`);
};