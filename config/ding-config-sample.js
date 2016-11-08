module.exports = {
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
    to: [], // Email addresses you want to ding
    subject: 'Ding',
    text: 'Dong',
    html: '<b>Dong</b>',
  },
}
;