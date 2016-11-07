/* eslint-disable consistent-return */
const User = require('../app/models/user');

module.exports.auth = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    if (
      req.xhr
      || req.headers.accept.indexOf('json') > -1
      || req.headers['x-requested-with'] === 'XMLHttpRequest'
    ) {
      res.status(403).send('Not Authorized');
    } else {
      res.redirect('/login');
    }
  }
};

module.exports.admin = (req, res, next) => {
  if (req.user) {
    User.findOne({ username: req.user.username }, (err, user) => {
      if (user.flags.isAdmin) {
        return next();
      }
      res.redirect('/');
    });
  } else {
    res.redirect('/login');
  }
};
