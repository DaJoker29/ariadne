/* eslint-disable consistent-return */
const User = require('../app/models/user');

module.exports.auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

module.exports.admin = (req, res, next) => {
  if (req.user && req.user.flags.isAdmin) {
    User.findOne({ username: req.user.username }, (err, user) => {
      if (user.flags.isAdmin) {
        return next();
      }
      res.redirect('/');
    });
  }
  res.redirect('/');
};
