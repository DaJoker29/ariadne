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

function removeApp(appName, callback) {
  if (appName && callback) {
    App.findOneAndRemove({ appName }, callback);
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

function listApps(callback) {
  if (callback) {
    App.find({}, callback);
  }
}

function validToken(auth, callback) {
  if (auth) {
    App.findOne(auth, (err, data) => {
      if (err) {
        callback(err);
      } else if (data) {
        callback(null);
      } else {
        callback(new Error('invalid credentials'));
      }
    });
  } else {
    callback(new Error('no authentication credentials provided.'));
  }
}

exports.listApps = listApps;
exports.createApp = createApp;
exports.removeApp = removeApp;
exports.regenerate = regenerate;
exports.validToken = validToken;
exports.close = close;