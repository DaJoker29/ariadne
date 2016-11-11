const Twitter = require('twitter');
const schedule = require('node-schedule');
const config = require('../config/twitter-config.js');
const _ = require('lodash');

/**
 * Twitter API - Handles all communication between Ariadne and the Twitter 
 * Streaming and REST APIs
 */

let client = {};
let screenName = 'ariadnebot'; // TODO: Pull this from Database.
const tweetHandlers = [];
const timers = {};

const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
});

const sendResponse = (event, handler, res) => {
  const replyID = event.id_str;
  const status = `@${event.user.screen_name} ${res}`;

  client.post('statuses/update', { in_reply_to_status_id: replyID, status }, (err, tweet, response) => {
    if (err) {
      console.log(`TWEET FAILURE: ${err}`);
      console.log(response.body);
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
    client = new Twitter(config);

    // Fetch Username
    client.get('account/settings', (err, data) => {
      console.log('Fetching Twitter account info...');
      if (err) {
        console.log(err);
      }

      if (data && data.screen_name !== screenName) {
        screenName = data.screen_name;
      }

      // Start watching stream
      client.stream('statuses/filter', { track: screenName }, (stream) => {
        console.log(`Screen Name: ${screenName}`);
        stream.on('data', (event) => {
          if (isTweet(event)) {
            const cmd = event.text.split(' ')[1];
            tweetHandlers.forEach((handler) => {
              if (handler.cmd.toLowerCase() === cmd.toLowerCase()) {
                handler.cb(event.text.split(' ').slice(2).join(' '), (err, res) => {
                  if (err || 'undefined' === typeof res) {
                    console.log(`MIDDLEWARE FAILED: ${handler.cmd}`);
                  } else {
                    sendResponse(event, handler, res);
                  }
                });
              }
            });
          } else {
            console.log('TWITTER MESSAGE:');
            console.log(event);
          }
        });

        // Handle stream errors
        stream.on('error', (err) => {
          if ('Status Code: 420' === err.message) {
            console.log('Rate Limit Hit');
          } else {
            console.log(`STREAMING ERROR: ${err.message}`);
          }
        });
      });

      // Return client for syncronous modules (Ding)
      cb(null, client);
    });
  }
};

// module.exports.tweet = (message, time, callback) => {
//   if (time) {}
// };

module.exports.attach = (command, callback) => {
  tweetHandlers.push({ cmd: command, cb: callback });
  console.log(`COMMAND HANDLER ADDED: '${command}'`);
};

// module.exports.schedule = (id, interval, callback) => {
//   timers[id] = schedule.scheduleJob(interval, callback);
//   console.log(`TIMER ADDED: ${id}`);
// };
