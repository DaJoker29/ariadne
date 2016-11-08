const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const mainConfig = require('../config/ding-config.js');
const noAuth = require('../test/ding/default-credentials.js');
const noEmail = require('../test/ding/no-emails.js');

let config = mainConfig;
/**
 * DING! - Sends an email to a certain address at a specific interval.
 * Used to overcome Gmail/Inbox exponential backoff algorithm for pulling
 * emails via POP3.
 */

const env = process.env.NODE_ENV;

function ding() {
  if ('production' === env) {
    const transporter = nodemailer.createTransport(config.transport);
    transporter.sendMail(config.message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Message Sent: ${info.response}`);
      }
    });
  } else {
    console.log('MOCK: Message Sent: 250 Great success');
  }
}

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
    case 'main':
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

// Runs every 10 minutes
module.exports.run = () => {
  const job = schedule.scheduleJob('*/10 * * * *', () => {
    ding();
  });
};