const ding = require('./scripts/ding.js');
const twitter = require('./scripts/twitter.js');

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 */
console.log('Waking up...');
console.log('Initializing Ding!...');

ding.init('main', (err) => {
  if (err) {
    console.log(`Ding! Failed to initialize: ${err}`);
  } else {
    ding.run();
    console.log('Ding! Started...');
  }
});

console.log('Initializing Twitter...');
