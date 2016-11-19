#!/usr/bin/env node
const db = require('../lib/database.js');
const program = require('commander');

program
  .arguments('<name>')
  .action((name) => {
    db.createApp(name, (err, data) => {
      if (err) {
        console.log(`Something went wrong.\n${err}`);
      } else {
        console.log(`Access key created for app '${data.appName}'\n${data.token}\n`);
      }
      db.close();
    });
  })
  .parse(process.argv);
