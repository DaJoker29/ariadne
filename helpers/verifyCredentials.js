const User = require('../app/models/user');
const authController = require('../app/controllers/auth-controller');

module.exports = (username, password, done) => {
  User.findOne(
    { username: new RegExp(`^${username}$`, 'i') },
    (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      authController.verifyPassword(password, user.password, (error, flag) => {
        if (error) { return done(error); }
        if (flag) {
          return done(null, user);
        }
        return done(null, false);
      });
      return null;
    }
  );
};
