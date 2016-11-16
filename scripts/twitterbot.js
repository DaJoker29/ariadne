const Twitter = require('twitter');
const schedule = require('node-schedule');
const config = require('../config/config.js');
const helpers = require('./helpers.js');

/**
 * Twitterbot - Handles all communication between Ariadne and the Twitter 
 * Streaming and REST APIs
 */

let client = {};
let stream;
let restartInterval = 1000 * 30; // Default to 30 seconds
const tweetHandlers = [];
const tweetMax = 140; // Max characters in a tweet

function tweet(status, params, callback) {
  // Handle in case no params are provided
  if ('function' === typeof params && 'undefined' === typeof callback) {
    /* eslint-disable no-param-reassign */
    callback = params;
    params = {};
    /* eslint-enable no-param-reassign */
  }

  // Check for message
  if (status && 'string' === typeof status && '' !== status) {
    const nextTweet = [];
    // Check if multiple tweets needed and add numbering to the first
    if (-1 === status.search(/^\d+\)/) && tweetMax < status.length) {
      status = `1) ${status}`; // eslint-disable-line no-param-reassign
    }

    // Check if @reply and add screen name to front of message
    if (params.in_reply_to_status_id && params.in_reply_to_screen_name) {
      status = `@${params.in_reply_to_screen_name} ${status}`; // eslint-disable-line no-param-reassign
    }

    // Split message in case of multiple tweets
    if (tweetMax < status.length) {
      console.log('splitting message into tweets...');
      const splitIndex = helpers.CALC_SPLIT(status, tweetMax);

      // Add numbering to next tweet
      nextTweet.push(`${Number.parseInt(status.slice(status.search(/\d+\)/), status.indexOf(')')), 10) + 1})`);

      // Add rest of message to tweet
      nextTweet.push(`\n${status.slice(splitIndex).trim()}`);

      // Trim to current tweet
      status = (status.slice(0, splitIndex)); // eslint-disable-line no-param-reassign
    }

    // Send tweet
    console.log(`tweeting: ${status}`);
    client.post('statuses/update', Object.assign({}, params, { status }), (err, data, res) => {
      if (err) {
        console.log(`tweet failed: response body: ${res.body}`);
      } else {
        console.log(`tweet success: ${data.id_str}`);
        // Send next tweet if first succeeds
        if (0 !== nextTweet.length) {
          tweet(nextTweet.join(' '), params, (err) => {
            if (err) {
              console.log('Tweet series message failed');
            }
          });
        }
      }
    });
  } else if (callback) {
    callback(new Error('No message provided')); // Write Tests
  } else {
    throw new Error('Failure with no callback');
  }
}

function attach(command, description, usage, callback) {
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
  console.log(`module loaded: '${command}'`);
}

// Checks if a specified command exist or returns a list of all valid commands.
function commands() {
  return tweetHandlers;
}

function restartStream(screenName) {
  if (1000 * 60 * 20 >= restartInterval) {
    restartInterval *= 2;
  }
  console.log(`stopped twitter stream...restarting in ${restartInterval}`);
  stream.destroy();
  setTimeout(() => {
    activateStream(screenName);
  }, restartInterval);
}

function activateStream(screenName) {
  console.log('watching twitter stream');
  stream = client.stream('statuses/filter', { track: screenName });
  stream.on('data', (event) => {
    if (helpers.IS_TWEET(event)) {
      const command = event.text.split(' ')[1];
      tweetHandlers.forEach((handler) => {
        if (handler.command.toLowerCase() === command.toLowerCase()) {
          handler.callback(event.text.split(' ').slice(2).join(' '), (err, res) => {
            if (err || 'undefined' === typeof res) {
              console.log(`${handler.command} middleware failed: ${err}`);
            } else {
              tweet(res, {
                in_reply_to_status_id: event.id_str, 
                in_reply_to_screen_name: event.user.screen_name,
              });
            }
          });
        }
      });
    } else {
      console.log('twitter message:');
      console.log(event);
    }
  });

  // Handle stream errors
  stream.on('error', (err) => {
    if ('Status Code: 420' === err.message) {
      console.log('rate limit hit');
      restartStream(screenName);
    } else {
      console.log(`streaming error: ${err.message}`);
    }
  });  
}

function fetchUsername(client, interval, callback) {
  client.get('account/settings', (err, data, res) => {
    console.log('fetching twitter account info...');

    // Log non-breaking errors
    if (err) {
      console.log(err);
    }

    // Restart if connection limit hit
    if (420 === res.statusCode) {
      console.log(`connection limit exceeded...retrying in ${interval / 1000} seconds`);
      setInterval(() => {
        fetchUsername(client, interval * 2, () => {
          console.log('twitter connection established...');
        });
      }, interval);
    }

    // Check for screen name
    if (data && data.screen_name) {
      callback(null, data.screen_name);
    } else {
      callback(Error('no screen name.'));
    }
  });
}

function init(callback) {
  if (callback) {
    console.log('initializing twitterbot...');
    console.log('checking twitterbot configuration...');
    if (!config.twitter.consumer_key || !config.twitter.consumer_secret
      || !config.twitter.access_token_key || !config.twitter.access_token_secret) {
      console.log('no twitter api credentials found...');
      callback(Error('no twitter api credentials.'));
    } else {
      console.log('twitterbot configured...');
      client = new Twitter(config.twitter);
      // Fetch Username
      fetchUsername(client, restartInterval, (err, screenName) => {
        if (err) {
          callback(Error('no screen name'));
        } else {
          console.log(`twitterbot screen name: @${screenName}`);
          // Watch Twitter Feed
          activateStream(screenName);

          // Return client for syncronous modules (Ding)
          callback(null);
        }
      });
    }
  } else {
    throw new Error('No Callback Provided');
  }
}

// Write Tests
module.exports.init = init;
module.exports.tweet = tweet;
module.exports.attach = attach;
module.exports.commands = commands;

// Reset the rate limit timer backoff every two hours
schedule.scheduleJob('0 */2 * * *', () => {
  restartInterval = 1000 * 30;
});