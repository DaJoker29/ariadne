/* eslint-disable global-require*/
module.exports = (id) => {
  /**
   * Modules
   */

  const express = require('express');
  const path = require('path');
  const session = require('express-session');
  const RedisStore = require('connect-redis')(session);
  const bodyParser = require('body-parser');
  const routes = require('./routes');
  const auth = require('./auth');
  const environment = require('./environment');

  /**
   * Variables
   */

  const app = module.exports.app = express();
  const PORT = process.env.SERVER_PORT || 3000;
  const clientDir = path.join(__dirname, '..', 'client');

  /**
   * Configuration
   */

  app.set('views', path.join(clientDir, 'views'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');

  app.use('/js', express.static(path.join(clientDir, '/scripts')));
  app.use('/css', express.static(path.join(clientDir, '/stylesheets')));
  app.use('/vendor', express.static(path.join(__dirname, '../bower_components')));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

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

  // Load Modules
  auth(app);
  routes(app);
  environment(app);

  app.listen(PORT, () => {
    console.log(`Instance ${id} on PORT ${PORT}`);
  });
};
