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

const tweet = (status, params, callback) => {
  // Handle in case no params are provided
  if ('function' === typeof params) {
    /* eslint-disable no-param-reassign */
    params = {};
    callback = params;
    /* eslint-enable no-param-reassign */
  }

  // Check for message
  if (status || 'string' !== typeof status) {
    client.post('statuses/update', Object.assign({}, params, { status }), (err, tweet, res) => {
      if (err) {
        console.log(`TWEET FAILURE: ${err}`);
        console.log(res.body);
      } else {
        console.log(`TWEET SUCCESS: ${tweet.id_str}`);
      }
    });
  } else {
    callback(new Error('No message provided'));
  }
};

const sendResponse = (event, handler, res) => {
  const replyID = event.id_str;
  const status = `@${event.user.screen_name} ${res}`;

  tweet(status, { in_reply_to_status_id: replyID });
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
        tweet('Testing Tweet()');
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

module.exports.tweet = tweet;

module.exports.attach = (command, callback) => {
  tweetHandlers.push({ cmd: command, cb: callback });
  console.log(`COMMAND HANDLER ADDED: '${command}'`);
};

// module.exports.schedule = (id, interval, callback) => {
//   timers[id] = schedule.scheduleJob(interval, callback);
//   console.log(`TIMER ADDED: ${id}`);
// };
