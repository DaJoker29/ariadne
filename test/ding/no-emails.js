module.exports = {
  interval: 10, // in Minutes
  transport: {
    service: 'Mailgun',
    auth: {
        // Replace with your mailgun credentials
      user: 'testing',
      pass: 'testing',
    },
  },
  message: {
    from: 'ariadne@mail.zerodaedalus.com',
    to: [], // Email addresses you want to ding
    subject: 'Ding',
    text: 'Dong',
    html: '<b>Dong</b>',
  },
};