const Twitter = require('twitter');
const schedule = require('node-schedule');
const config = require('../config/twitter-config.js');
const _ = require('lodash');

/**
 * Twitter API - Handles all communication between Ariadne and the Twitter 
 * Streaming and REST APIs
 */

let client = {};
const tweetHandlers = [];
const timers = {};
const screenNames = ['_aribot'];

const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
});

const sendResponse = (event, handler, res) => {
  const replyID = event.id_str;
  const status = `@${event.user.screen_name} ${res}`;

  client.post('statuses/update', { in_reply_to_status_id: replyID, status }, (error, tweet) => {
    if (error) {
      console.log(`TWEET FAILURE: ${error}`);
    } else {
      console.log(`TWEET SUCCESS: '${handler.cmd}' response sent to @${event.user.screen_name}: ${tweet.id_str}`);
    }
  });
};

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
              handler.cb(event.text.split(' ').slice(2), (err, res) => {
                if (err || 'undefined' === typeof res) {
                  console.log(`MIDDLEWARE FAILED: ${handler.cmd}`);
                } else {
                  sendResponse(event, handler, res);
                }
              });
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
