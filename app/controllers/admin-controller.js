const User = require('../models/user');

module.exports.fetchAllUsers = (req, res) => {
  User.find({}, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(results);
    }
  });
};
