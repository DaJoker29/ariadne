const passport = require('passport');
const passportLocal = require('passport-local');
const verifyCredentials = require('../helpers/verifyCredentials');
const User = require('./models/user');

module.exports = (app) => {
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
};
