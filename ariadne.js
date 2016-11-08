const schedule = require('node-schedule');
const ding = require('./scripts/ding.js');
const dingConfig = require('./config/ding-config.js');

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 */
console.log('Waking up...');

console.log('Initializing Ding!...');
const dingJob = schedule.scheduleJob(`*/${dingConfig.interval} * * * *`, () => {
  ding();
});