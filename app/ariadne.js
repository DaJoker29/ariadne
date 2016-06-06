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
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config.js');
  const historyApiFallback = require('connect-history-api-fallback');
  const bodyParser = require('body-parser');
  const routes = require('./routes');
  const mongoose = require('mongoose');
  const passport = require('passport');
  const passportLocal = require('passport-local');
  const verifyCredentials = require('../helpers/verifyCredentials');
  const User = require('./models/user');

  /**
   * Variables
   */

  const app = module.exports.app = express();
  const PORT = process.env.SERVER_PORT || 3000;
  const LOG_FORMAT = process.env.LOG_FORMAT || 'combined';
  const clientDir = path.join(__dirname, '..', 'client');

  /**
   * Environment
   */

  mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/ariadne');

  if (process.env.NODE_ENV === 'development') {
    // Development Settings
    app.use(morgan(LOG_FORMAT));

    // Configure Webpack Dev Server
    app.use(historyApiFallback({
      verbose: false,
    }));
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
      publicPath: config.output.publicPath,
      contentBase: '../client',
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false,
      },
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('*', (req, res) => {
      res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..',
       'client', 'index.html')));
      res.end();
    });
  } else {
    // Production Settings
    const accessLogStream = fs.createWriteStream(path.join(__dirname,
      '..', 'access.log'), { flags: 'a' });

    app.use(morgan(LOG_FORMAT, { stream: accessLogStream }));

    app.use(express.static(clientDir));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'build/index.html'));
    });
  }


  /**
   * Configuration
   */

  app.set('views', clientDir);
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

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new passportLocal.Strategy(verifyCredentials));
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((ident, done) => {
    User.findOne({ _id: ident }, (err, user) => {
      if (err) { done(err); }
      done(null, user);
    });
  });

  app.post('/login', passport.authenticate('local'));

  // Add Routes
  routes(app);

  /**
   * Start
   */


  app.listen(PORT, () => {
    console.log(`Instance ${id} on PORT ${PORT}`);
  });
};
