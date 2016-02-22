var app                = module.parent.exports.app;
var User               = require('./server/models/user');
var taskController     = require('./server/controllers/task-controller');
var userController     = require('./server/controllers/user-controller');
var feedbackController = require('./server/controllers/feedback-controller');

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
    res.redirect('/');
});

app.get('/admin', ensureAdmin, function ( req, res) {
    res.render('admin.html');
});

app.get('/feedback', ensureAuth, function (req, res) {
    res.render('feedback.html');
});

app.post('/register', userController.create);


// Server
app.get('/api/users/', userController.list);
app.get('/api/users/all', userController.listAll);
app.get('/api/users/tasks', taskController.listAll);
app.get('/api/users/archive', taskController.archive);
app.get('/api/users/:uid/tasks', taskController.list);
app.get('/api/users/:uid/tasks/:id', taskController.listOne);
app.post('/api/users/:uid/tasks', taskController.create);
app.post('/api/users/:uid/tasks/:id', taskController.modify);
app.delete('/api/users/:uid/tasks/:id', taskController.remove);

app.get('/api/feedback', feedbackController.fetch);
app.post('/api/feedback', feedbackController.create);

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