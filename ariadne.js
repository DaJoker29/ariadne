const ding = require('./scripts/ding.js');
const twitter = require('./scripts/twitter.js');

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 */
console.log('Waking up...');


twitter.init((err, client) => {
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
    twitter.attach('Testing', (arg, next) => {
      next(null, '1, 2, 3.');
    });

    // Thank you Command
    twitter.attach('Thanks', (arg, next) => {
      next(null, 'You\'re welcome');
    });


    /**
     * Ding - Automated Emails
     */
    console.log('Initializing Ding...');
    ding.init('main', (err) => {
      if (err) {
        console.log(`Ding failed to initialize: ${err}`);
      } else {
        const interval = 'production' === process.env.NODE_ENV ? '*/10 * * * *' : '*/2 * * * *';
        twitter.schedule('Ding', interval, () => {
          ding.run(client);
        });
        console.log('Ding initialized...');
      }
    });
  } 
});