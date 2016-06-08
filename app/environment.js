const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
const historyApiFallback = require('connect-history-api-fallback');
const morgan = require('morgan');
const express = require('express');

const LOG_FORMAT = process.env.LOG_FORMAT || 'combined';
const clientDir = path.join(__dirname, '..', 'client');

module.exports = (app) => {
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
    app.get('/dashboard', (req, res) => {
      res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..',
       'client/views', 'dashboard.html')));
      res.end();
    });
  } else {
    // Production Settings
    const accessLogStream = fs.createWriteStream(path.join(__dirname,
      '..', 'access.log'), { flags: 'a' });

    app.use(morgan(LOG_FORMAT, { stream: accessLogStream }));

    app.use(express.static(clientDir));

    app.get('/dashboard', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'build/index.html'));
    });
  }
};
