var authController = require('./server/controllers/auth-controller');
var hashPassword = authController.hashPassword;
var verifyPassword = authController.verifyPassword;

module.exports = hashPassword('Password', function() {
    console.log('Done');
})