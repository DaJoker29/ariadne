const userController = require('./controllers/user-controller');
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
    res.redirect('/dashboard');
  });

  app.use('/dashboard', ensure.auth);

  app.get('/register', (req, res) => {
    res.render('register.html');
  });

  app.get('/login', (req, res) => {
    if (req.user) {
      res.redirect('/dashboard');
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
    successRedirect: '/dashboard',
  }));

  /**
   * API
   */

  // Users
  app.post('/api/users', userController.create);
};
