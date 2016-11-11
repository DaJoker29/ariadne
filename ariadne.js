const twitter = require('./scripts/twitter.js');
const math = require('mathjs');

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 */
console.log('Waking up...');


twitter.init((err) => {
  // Check if Twitter failed to intialize.
  if (err) {
    console.log(`Twitter failed to initialize: ${err}`);
  } else {
    console.log('Twitter initialized...');
    /**
     * Tweet Response - Twitter @reply handler
     *
     * twitter.attach('Command', middleware)
     *
     * function middleware (arg, next) {
     *   // do stuff to arg...
     *
     *   // response = string you want returned to the user
     *   next(null, response);
     * }
     */
    
    // Testing Command
    twitter.attach('testing', (arg, next) => {
      next(null, '1, 2, 3.');
    });

    // Thank you Command
    twitter.attach('thanks', (arg, next) => {
      next(null, 'You\'re welcome');
    });

    // MathJS
    twitter.attach('math', (arg, next) => {
      if ('undefined' === arg) {
        next(null, 'You didn\'t give me a problem to solve.');
      } else {
        const options = {
          precision: 7,
          exponential: {
            lower: 1e-6,
            upper: 1e15,
          },
        };
        const result = math.eval(arg);
        next(null, `The answer is: ${math.format(result, options)}`); // TODO: Sanitize input
      }
    });


    /**
     * Ding - Automated Emails
     */
    // console.log('Initializing Ding...');
    // ding.init('main', (err) => {
    //   if (err) {
    //     console.log(`Ding failed to initialize: ${err}`);
    //   } else {
    //     const interval = 'production' === process.env.NODE_ENV ? '*/10 * * * *' : '*/2 * * * *';
    //     twitter.schedule('Ding', interval, () => {
    //       ding.run(client);
    //     });
    //     console.log('Ding initialized...');
    //   }
    // });
  } 
});

process.on('uncaughtException', (err) => {
  console.error('Caught exception:');
  console.error(err);
  console.trace();
});