const userController = require('./controllers/user-controller');

module.exports = (app) => {
  // Users
  app.post('/api/users', userController.create);
};
