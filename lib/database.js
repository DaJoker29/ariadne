const mongoose = require('mongoose');
const App = require('./models').App;

mongoose.connect('mongodb://localhost/ariadne');

function close() {
  mongoose.disconnect();
}

function createApp(appName, callback) {
  if (appName && callback) {
    App.create({ appName }, (err, app) => {
      if (err) {
        callback(err);
      } else {
        callback(null, app);
      }
    });
  }
}

exports.createApp = createApp;
exports.close = close;