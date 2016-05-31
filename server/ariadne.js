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
   * Routes
   */

  app.get('/', (req, res) => {
    const sess = req.session;
    if (sess.views) {
      sess.views++;
    } else {
      sess.views = 1;
    }
    res.send(`Worker #${id}\nView Count ${sess.views}`);
  });

  /**
   * Start
   */

  app.listen(PORT, () => {
    console.log(`Instance ${id} on PORT ${PORT}`);
  });
};
