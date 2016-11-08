module.exports = {
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
    to: ['testing@testing.net'], // Email addresses you want to ding
    subject: 'Ding',
    text: 'Dong',
    html: '<b>Dong</b>',
  },
};
