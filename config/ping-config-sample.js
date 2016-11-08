module.exports = {
  interval: 600000, // 10 Minutes
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
    to: [], // Email addresses you want to ping
    subject: 'Ping',
    text: 'Pong',
    html: '<b>Pong</b>',
  },
}
;