const userController = require('./controllers/user-controller');
const teamController = require('./controllers/team-controller');
const adminController = require('./controllers/admin-controller');
const passport = require('passport');
const ensure = require('../helpers/ensure');

module.exports = (app) => {
  // Authentication
  // app.get('/api/authenticated', (req, res) => {
  //   if (req.user) {
  //     res.status(200).end();
  //   } else {
  //     res.status(201).end();
  //   }
  // });

  app.get('/', (req, res) => {
    res.redirect('/app');
  });

  app.use('/app', ensure.auth);

  app.get('/register', (req, res) => {
    res.render('register.html');
  });

  app.get('/login', (req, res) => {
    if (req.user) {
      res.redirect('/app');
    } else {
      res.render('login.html');
    }
  });


  app.get('/logout', ensure.auth, (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  app.post('/register', userController.create);
  app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/app',
  }), userController.fetch);

  /**
   * API
   */

  app.use('/api/', ensure.auth);
  app.use('/api/admin/', ensure.admin);

  // Users
  app.get('/api/users', userController.fetch);
  app.post('/api/users', userController.create);
  app.post('/api/users/update', userController.update);

  // Team
  app.post('/api/team', teamController.create);
  app.get('/api/team', teamController.fetch);

  // Admin
  app.get('/api/admin/users', adminController.fetchAllUsers);
};
