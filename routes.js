var app                = module.parent.exports.app;
var User               = require('./server/models/user');
var taskController     = require('./server/controllers/task-controller');
var userController     = require('./server/controllers/user-controller');
var feedbackController = require('./server/controllers/feedback-controller');
var adminController    = require('./server/controllers/admin-controller');

/*              Routes                  */

// Client
app.get('/', ensureAuth, function ( req, res ) {
    res.render('index.html');
});

app.get('/register', function ( req, res ) {
    res.render('register.html');
});

app.get('/login', function ( req, res ) {
    if( req.user ) {
        res.redirect('/');
    } else {
        res.render('login.html');
    }
});

app.get('/logout', ensureAuth, function ( req, res ) {
    req.logout();
    res.redirect('/login');
});

app.get('/admin', ensureAdmin, function ( req, res) {
    res.render('admin.html');
});

app.get('/feedback', ensureAuth, function (req, res) {
    res.render('feedback.html');
});

app.post('/register', userController.create);


// Server (API)

// Users
app.get('/api/users', userController.fetch);
app.post('/api/users', userController.create);
app.post('/api/users/:id', userController.update);
app.delete('/api/users/:id', userController.disable);

// Tasks
app.get('/api/tasks', taskController.fetch);
app.post('/api/tasks', taskController.create);
app.post('/api/tasks/:id', taskController.update);
app.delete('/api/tasks/:id', taskController.delete);

// Feedback
app.post('/api/feedback', feedbackController.create);

// Admin
app.get('/api/admin/users/:id?', adminController.fetchUser);
app.get('/api/admin/tasks/:id?', adminController.fetchTask);

app.post('/api/admin/tasks/:id', adminController.updateTask);
app.post('/api/admin/users/:id', adminController.updateUser);

app.delete('/api/admin/tasks/:id', adminController.deleteTask);
app.delete('/api/admin/users/:id', adminController.disableUser);

app.get('/api/admin/stats', adminController.fetchStats);
app.get('/api/admin/feedback', adminController.fetchFeedback);
app.post('/api/admin/archive', adminController.runArchive);

/*              Helpers               */
function ensureAuth( req, res, next ) {
    if( req.user ) { next(); }
    else {
        res.redirect('/login');
    }
}

function ensureAdmin( req, res, next ) {
    if( req.user && req.user.flags.isAdmin ) {
        // Verify Admin flag on the server before allowing access
        User.findOne( { username: req.user.username }, function( err, user) {
            if(user.flags.isAdmin) {
                return next();
            }

            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
}