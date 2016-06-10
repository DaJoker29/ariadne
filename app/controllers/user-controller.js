const User = require('../models/user');
const authController = require('./auth-controller.js');

module.exports.create = (req, res) => {
  authController.hashPassword(req.body.password, (err, hash) => {
    if (err) {
      res.status(500).send(new Error('password hashing'));
    } else {
      const user = new User(Object.assign(req.body, { hash }));
      user.save(error => {
        if (error) {
          res.status(400).send('Error. User not created');
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

module.exports.fetch = (req, res) => {
  User.findOne({ _id: req.user._id }, (err, result) => {
    if (err) {
      res.status(400).send('User Not Found');
    } else {
      res.send(result);
    }
  });
};
