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
let screenName = 'ariadnebot'; // TODO: Pull this from a database.
let restartInterval = 1000 * 30; // Default to 30 seconds
const tweetHandlers = [];


const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
});

const tweet = (status, params, callback) => {
  // Handle in case no params are provided
  if ('function' === typeof params && 'undefined' === typeof callback) {
    /* eslint-disable no-param-reassign */
    callback = params;
    params = {};
    /* eslint-enable no-param-reassign */
  }

  // Check for message
  if (status && 'string' === typeof status && '' !== status) {
    console.log(`Tweeting ${status}`);
    client.post('statuses/update', Object.assign({}, params, { status }), (err, tweet, res) => {
      if (err) {
        console.log(`TWEET FAILURE: Request Body: ${res.body}`);
      } else {
        console.log(`TWEET SUCCESS: ${tweet.id_str}`);
      }
    });
  } else if (callback) {
    callback(new Error('No message provided')); // Write Tests
  } else {
    throw new Error('Failure with no callback');
  }
};

const attach = (command, description, usage, callback) => {
  /* eslint-disable no-param-reassign */
  if ('function' === typeof description) {
    callback = description;
    description = 'No description provided';
    usage = `${command} <args>`;
  }
  if ('function' === typeof usage) {
    callback = usage;
    usage = `${command} <args>`;
  }
  /* eslint-enable no-param-reassign */
  if ('undefined' === typeof command || 'function' === typeof command || '' === command || 1 < command.split(' ').length) {
    throw new Error('No command to watch');
  }
  if ('undefined' === typeof callback) {
    throw new Error('No callback to return');
  }


  tweetHandlers.push({ command, description, usage, callback });
  console.log(`MODULE LOADED: '${command}'`);
};

const sendResponse = (event, handler, res) => {
  const replyID = event.id_str;
  const status = `@${event.user.screen_name} ${res}`;

  tweet(status, { in_reply_to_status_id: replyID });
};

// Checks if a specified command exist or returns a list of all valid commands.
function commands() {
  return tweetHandlers;
}

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
      const command = event.text.split(' ')[1];
      tweetHandlers.forEach((handler) => {
        if (handler.command.toLowerCase() === command.toLowerCase()) {
          handler.callback(event.text.split(' ').slice(2).join(' '), (err, res) => {
            if (err || 'undefined' === typeof res) {
              console.log(`MIDDLEWARE FAILED: ${handler.command}`);
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

const init = (callback) => {
  if (callback) {
    console.log('Initializing Twitter...');
    console.log('Checking Twitter configuration...');
    if (!config.consumer_key || !config.consumer_secret
      || !config.access_token_key || !config.access_token_secret) {
      console.log('No Twitter API credentials found...');
      callback(Error('No Twitter API credentials.'));
    } else {
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
        console.log(`App Screen Name: @${screenName}`);

        // Watch Twitter Feed
        activateStream();

        // Return client for syncronous modules (Ding)
        callback(null);
      });
    }
  } else {
    throw new Error('No Callback Provided');
  }
};

// Write Tests
module.exports.init = init;
module.exports.tweet = tweet;
module.exports.attach = attach;
module.exports.commands = commands;

// Reset the rate limit timer backoff every two hours
schedule.scheduleJob('0 */2 * * *', () => {
  restartInterval = 1000 * 30;
});