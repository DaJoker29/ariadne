#!/usr/bin/env node
const db = require('../lib/database.js');
const program = require('commander');

program
  .command('create <name>')
  .description('register a new app and log an access token')
  .action((name) => {
    db.createApp(name, (err, data) => {
      if (err) {
        console.log(`Something went wrong.\n${err}`);
      } else {
        console.log(`Access key created for app '${data.appName}'\n${data.token}\n`);
      }
      db.close();
    });
  });

program
  .command('regenerate <name>')
  .alias('regen')
  .description('generate a new access token and discard the last one')
  .action((name) => {
    db.regenerate(name, (err, data) => {
      if (err) {
        console.log(`Something went wrong.\n${err}`);
      } else {
        console.log(`New access key generated for '${data.appName}'\n${data.token}\n`);
      }
      db.close();
    });
  });

program.parse(process.argv);