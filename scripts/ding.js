const nodemailer = require('nodemailer');
const mainConfig = require('../config/ding-config.js');
const noAuth = require('../test/ding/default-credentials.js');
const noEmail = require('../test/ding/no-emails.js');
const valid = require('../test/ding/valid-config.js');

let config = mainConfig;
/**
 * DING! - Sends an email to a certain address at a specific interval.
 * Used to overcome Gmail/Inbox exponential backoff algorithm for pulling
 * emails via POP3.
 */

const env = process.env.NODE_ENV;

function buildMessage(tweet) {
  return {
    html: `<p>${tweet.user.name}</p><p>@${tweet.user.screen_name}</p><p>${tweet.text}</p>`,
    text: `${tweet.user.name}\n@${tweet.user.screen_name}\n${tweet.text}\n`,
  };
}

function sendMessage(message, transport) {
  const transporter = nodemailer.createTransport(transport);
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Message Sent: ${info.response}`);
    }
  });
}

module.exports.run = (client) => {
  client.get('search/tweets', { q: 'pizza', count: 1, lang: 'en' }, (err, tweets) => {
    if (err) {
      console.log(`Twitter Failure: ${err.message}`);
    } else {
      // Send email (or log if on development)
      const message = 'undefined' === tweets.statuses[0] ? config.message : Object.assign({}, config.message, buildMessage(tweets.statuses[0]));
      if ('production' === env) {
        sendMessage(message, config.transport);
      } else {
        console.log(message);
      }
    }
  });
};

module.exports.init = (flag, callback) => {
  console.log('Configuring Ding!...');
  switch (flag) {
    case 'none':
      console.log('Using no configuration...');
      config = {};
      break;
    case 'no-auth':
      console.log('Using no-auth configuration...');
      config = noAuth;
      break;
    case 'no-email':
      console.log('Using no-email configuration...');
      config = noEmail;
      break;
    case 'valid':
      console.log('Using a valid configuration...');
      config = valid;
      break;
    default:
      console.log('Using default configuration...');
      config = mainConfig;
  }

  if ('undefined' === typeof config || 0 === Object.keys(config).length) {
    callback(Error('No configuration file provided'));
  } else if ('user' === config.transport.auth.user || 'pass' === config.transport.auth.user) {
    callback(Error('Authentication not configured'));
  } else if (1 > config.message.to.length) {
    callback(Error('No email targets configured'));
  } else {
    callback(null);
  }
};