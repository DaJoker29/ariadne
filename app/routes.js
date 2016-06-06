const userController = require('./controllers/user-controller');

module.exports = (app) => {
  // Authentication
  app.get('/api/authenticated', (req, res) => {
    if (req.user) {
      res.status(200).end();
    } else {
      res.status(201).end();
    }
  });

  // Users
  app.post('/api/users', userController.create);
};
