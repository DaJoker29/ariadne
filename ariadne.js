const ding = require('./scripts/ding.js');
const twitter = require('./scripts/twitter.js');

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 */
console.log('Waking up...');


twitter.init((err) => {
  if (err) {
    console.log(`Twitter failed to initialize: ${err}`);
  } else {
    console.log('Twitter initialized...');
    console.log('Initializing Ding...');
    ding.init('main', (err) => {
      if (err) {
        console.log(`Ding failed to initialize: ${err}`);
      } else {
        ding.run();
        console.log('Ding initialized...');
      }
    });
  }
});