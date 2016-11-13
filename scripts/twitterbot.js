const Twitter = require('twitter');
const schedule = require('node-schedule');
const config = require('../config/twitter-config.js');
const _ = require('lodash');

/**
 * Twitterbot - Handles all communication between Ariadne and the Twitter 
 * Streaming and REST APIs
 */

let client = {};
let stream;
let restartInterval = 1000 * 30; // Default to 30 seconds
const tweetHandlers = [];
const tweetMax = 140; // Max characters in a tweet
const numberExp = /^\d*\)/;


const isTweet = _.conforms({
  id_str: _.isString,
  text: _.isString,
});

function calcSplit(string, maxLength) {
  const lastBlankLine = string.lastIndexOf('\n\n', maxLength);
  const lastNewLine = string.lastIndexOf('\n', maxLength);
  const lastPeriod = string.lastIndexOf('.', maxLength);
  const lastWhiteSpace = string.lastIndexOf(' ', maxLength);

  if (-1 !== lastBlankLine) {
    return lastBlankLine;
  } else if (-1 !== lastNewLine) {
    return lastNewLine;
  } else if (-1 !== lastPeriod) {
    return lastPeriod;
  } else if (-1 !== lastWhiteSpace) {
    return lastWhiteSpace;
  }
  
  return maxLength;
}

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
    const nextTweet = [];
    // Check if multiple tweets needed and add numbering to the first
    if (-1 === status.search(numberExp) && tweetMax < status.length) {
      status = `1) ${status}`; // eslint-disable-line no-param-reassign
    }

    // Split message in case of multiple tweets
    if (tweetMax < status.length) {
      console.log('splitting message into tweets...');
      const splitIndex = calcSplit(status, tweetMax);

      // Add number to next tweet
      nextTweet.push(`${Number.parseInt(status.slice(0, status.indexOf(')')), 10) + 1})`);

      // Check if @reply and add screen name
      if (params.in_reply_to_status_id) {
        const atIndex = status.indexOf('@');
        nextTweet.push(status.slice(atIndex, status.indexOf(' ', atIndex)));
      }

      // Add rest of message to tweet
      nextTweet.push(`\n${status.slice(splitIndex).trim()}`);

      // Reset message of current tweet
      status = (status.slice(0, splitIndex)); // eslint-disable-line no-param-reassign
    }

    // Send tweet
    console.log(`tweeting: ${status}`);
    client.post('statuses/update', Object.assign({}, params, { status }), (err, data, res) => {
      if (err) {
        console.log(`tweet failed: response body: ${res.body}`);
      } else {
        console.log(`tweet success: ${data.id_str}`);
        // Send next tweet if multiple
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
  console.log(`module loaded: '${command}'`);
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
    if (isTweet(event)) {
      const command = event.text.split(' ')[1];
      tweetHandlers.forEach((handler) => {
        if (handler.command.toLowerCase() === command.toLowerCase()) {
          handler.callback(event.text.split(' ').slice(2).join(' '), (err, res) => {
            if (err || 'undefined' === typeof res) {
              console.log(`middleware failed: ${handler.command}`);
            } else {
              sendResponse(event, handler, res);
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

const init = (callback) => {
  if (callback) {
    console.log('initializing twitterbot...');
    console.log('checking twitterbot configuration...');
    if (!config.consumer_key || !config.consumer_secret
      || !config.access_token_key || !config.access_token_secret) {
      console.log('no twitter api credentials found...');
      callback(Error('no twitter api credentials.'));
    } else {
      client = new Twitter(config);
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