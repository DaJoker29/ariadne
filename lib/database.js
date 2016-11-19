const mongoose = require('mongoose');
const randtoken = require('rand-token');
const App = require('./models').App;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ariadne');

function close() {
  mongoose.disconnect();
}

function createApp(appName, callback) {
  if (appName && callback) {
    App.create({ appName }, callback);
  }
}

function regenerate(appName, callback) {
  if (appName && callback) {
    App.findOne({ appName }, (err, app) => {
      if (err) {
        callback(err);
      } else {
        app.token = randtoken.generate(64); // eslint-disable-line no-param-reassign
        app.save(callback);
      }
    });
  }
}

exports.createApp = createApp;
exports.regenerate = regenerate;
exports.close = close;