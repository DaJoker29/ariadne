const Twitter = require('twitter');
const schedule = require('node-schedule');
const config = require('../config/twitter-config.js');
const _ = require('lodash');

/**
 * Twitter API - Handles all communication between Ariadne and the Twitter 
 * Streaming and REST APIs
 */

let client = {};
let stream;
let screenName = 'ariadnebot'; // TODO: Pull this from Database.
let restartInterval = 1000 * 30; // Default to 30 seconds
const tweetHandlers = [];


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
    console.log(`Tweeting ${status}`);
    client.post('statuses/update', Object.assign({}, params, { status }), (err, tweet, res) => {
      if (err) {
        console.log(`TWEET FAILURE: Request Body: ${res.body}`);
      } else {
        console.log(`TWEET SUCCESS: ${tweet.id_str}`);
      }
    });
  } else {
    callback(new Error('No message provided')); // Write Tests
  }
};

const attach = (command, callback) => {
  tweetHandlers.push({ cmd: command, cb: callback });
  console.log(`COMMAND HANDLER ADDED: '${command}'`);
};

const sendResponse = (event, handler, res) => {
  const replyID = event.id_str;
  const status = `@${event.user.screen_name} ${res}`;

  tweet(status, { in_reply_to_status_id: replyID });
};

function restartStream() {
  if (1000 * 60 * 20 >= restartInterval) {
    restartInterval *= 2;
  }
  console.log(`Stopped Twitter Stream...Restarting in ${restartInterval}`);
  stream.destroy();
  setTimeout(activateStream, restartInterval);
}

function activateStream() {
  console.log('Watching Twitter Stream');
  stream = client.stream('statuses/filter', { track: screenName });
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
      restartStream();
    } else {
      console.log(`STREAMING ERROR: ${err.message}`);
    }
  });  
}

const init = (cb) => {
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
      console.log(`Screen Name: ${screenName}`);

      // Watch Twitter Feed
      activateStream();

      // Return client for syncronous modules (Ding)
      cb(null);
    });
  }
};

// Write Tests
module.exports.init = init;
module.exports.tweet = tweet;
module.exports.attach = attach;

// Reset the rate limit timer backoff every two hours
schedule.scheduleJob('0 */2 * * *', () => {
  restartInterval = 1000 * 30;
});