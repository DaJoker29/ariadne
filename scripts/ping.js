const nodemailer = require('nodemailer');
const config = require('../config/ping-config.js');

/**
 * Sends an email to a certain address at a specific interval.
 * Used to overcome Gmail/Inbox exponential backoff algorithm for pulling
 * emails via POP3.
 */

const { transport, message } = config;

if (checkConfig()) {
  const transporter = nodemailer.createTransport(transport);
  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Message Sent: ${info.response}`);
    }
  });
}

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