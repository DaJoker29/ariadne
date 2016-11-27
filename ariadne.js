const express = require('express');
const bodyParser = require('body-parser');
const twitterbot = require('./lib/twitterbot.js');
const gh = require('./lib/github.js');
const handlers = require('./lib/cmd-handlers.js');

const app = express();
const port = process.env.PORT || 3000;
const validToken = require('./lib/database.js').validToken;

/**
 * Ariadne 2.0 - Superior Productivity
 * Copyright (C) 2016 Dewitt Buckingham (http://zerodaedalus.com)
 *
 * TODO: Add some better logging utility. (Winston?)
 * TODO: Integration testing
 */
console.log('waking up...');

/**
 * CONFIGURE SERVER
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api/tweet', confirmToken, (req, res) => {
  twitterbot.tweet(req.body.status, req.body.params, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/api', (req, res) => {
  res.sendStatus(200);
});

app.get('*', (req, res) => {
  res.redirect(301, 'https://twitter.com/ariadnebot');
});

/**
 * INITIALIZE TWITTERBOT
 */

twitterbot.init((err) => {
  // Check if twitterbot failed to intialize.
  if (err) {
    console.log(`twitterbot failed to initialize: ${err}`);
  } else {
    /**
     * INITIALIZE GITHUB
     */
    
    gh.init((err) => {
      if (err) {
        console.log(`failed to pull github info: ${err}`);
      } else {
        console.log('github info loaded');
        console.log('loading modules...');
        twitterbot.attach('info', 'A little helpful information about Ariadne.', 'info', handlers.INFO);
        twitterbot.attach('github', 'Get information about a specific Github user or repository', 'github <user OR user/repo>', handlers.GITHUB);
        twitterbot.attach('test', 'Simple test to see if Ariadne is up and running', 'test', handlers.TEST);
        twitterbot.attach('thanks', 'Everyone appreciates a little gratitude.', 'thanks', handlers.THANKS);
        twitterbot.attach('math', 'Solve math problems', 'math <problem>', handlers.MATH);
        twitterbot.attach('help', 'Some help with Ariadne\'s commands', 'help [command]', handlers.HELP);

        // Launch REST API
        app.listen(port, () => {
          console.log(`Ariadne REST API started on port ${port}`);
        });
      }
    });
  }
});

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err) => {
  console.error('caught exception:');
  console.error(err);
  console.trace();
});

/**
 * MIDDLEWARE
 */

function confirmToken(req, res, next) {
  console.log('Confirming access token...');
  validToken(req.body.auth, (err) => {
    if (err) {
      console.log('Token invalid...');
      res.sendStatus(403);      
    } else {
      console.log('Token confirmed...');
      next();      
    }
  });
}
