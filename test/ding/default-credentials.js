module.exports = {
  interval: 10, // in Minutes
  transport: {
    service: 'Mailgun',
    auth: {
        // Replace with your mailgun credentials
      user: 'user',
      pass: 'pass',
    },
  },
  message: {
    from: 'ariadne@mail.zerodaedalus.com',
    to: ['testing@testing.org'], // Email addresses you want to ding
    subject: 'Ding',
    text: 'Dong',
    html: '<b>Dong</b>',
  },
};