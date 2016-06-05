const User = require('../models/user');
const authController = require('./auth-controller.js');

module.exports.create = (req, res) => {
  authController.hashPassword(req.body.password, (err, hash) => {
    if (err) {
      res.status(500).send('Error generating Hash');
    } else {
      const user = new User(Object.assign(req.body, { hash }));
      user.save(error => {
        if (error) {
          res.status(400).send('Error. User not created');
        } else {
          res.status(200).send('User created');
        }
      });
    }
  });
};
