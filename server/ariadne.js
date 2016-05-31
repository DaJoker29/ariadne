/* eslint-disable global-require*/
module.exports = (id) => {
  /**
   * Modules
   */

  const express = require('express');
  const morgan = require('morgan');
  const fs = require('fs');
  const path = require('path');
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);

  /**
   * Variables
   */

  const app = express();
  const PORT = process.env.SERVER_PORT || 3000;
  const LOG_FORMAT = process.env.LOG_FORMAT || 'combined';
  const clientDir = path.join(__dirname, '..', 'client');

  /**
   * Environment
   */

  if (process.env.NODE_ENV === 'development') {
    // Development Settings
    app.use(morgan(LOG_FORMAT));
  } else {
    // Production Settings
    const accessLogStream = fs.createWriteStream(path.join(__dirname,
      '..', 'access.log'), { flags: 'a' });

    app.use(morgan(LOG_FORMAT, { stream: accessLogStream }));
  }

  /**
   * Configuration
   */

  app.set('views', clientDir + '/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use('/js', express.static(clientDir + 'scripts'));
  app.use('/css', express.static(clientDir + 'stylesheets'));
  app.use('/vendor', express.static(__dirname + '../bower_components'));

  app.use(session({
    store: new RedisStore({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  /**
   * Start
   */

  app.get('/', (req, res) => {
    res.render('index.html')
  });

  app.listen(PORT, () => {
    console.log(`Instance ${id} on PORT ${PORT}`);
  });
};
