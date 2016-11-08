const nodemailer = require('nodemailer');
const config = require('../config/ding-config.js');

/**
 * DING! - Sends an email to a certain address at a specific interval.
 * Used to overcome Gmail/Inbox exponential backoff algorithm for pulling
 * emails via POP3.
 */

const { transport, message } = config;

function checkConfig() {
  if ('user' === transport.auth.user || 'pass' === transport.auth.user) {
    console.log('Authentication not configured');
    return false;
  } else if (1 > message.to.length) {
    console.log('No email targets configured');
    return false;
  }
  return true;
}

module.exports = () => {
  console.log('Starting Ding!');
  if (checkConfig()) {
    console.log('Dinging...');
    const transporter = nodemailer.createTransport(transport);
    transporter.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Message Sent: ${info.response}`);
      }
    });
  }
};