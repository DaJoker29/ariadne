var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var taskController = require('./server/controllers/task-controller');
var userController = require('./server/controllers/user-controller');
var bodyParser     = require('body-parser');
var passport       = require('passport');
var passportLocal  = require('passport-local');
var cookieParser   = require('cookie-parser');
var expressSession = require('express-session');
var schedule       = require('node-schedule');
var User           = require('./server/models/user');
var Auth           = require('./server/controllers/auth-controller');


// Connect to DB
mongoose.connect('mongodb://localhost:27017/ariadne');

// View Engine
app.set('views', __dirname + '/client/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Passport Middleware
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(cookieParser());
app.use(expressSession( {
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
} ));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal.Strategy( verifyCredentials ));

function verifyCredentials ( username, password, done ) {
    User.findOne( { username: username }, function (err, user) {
        if( err ) { return done( err ); }
        if( !user ) { return done(null, false); }
        if( user.password !== password) { return done(null, false); }
        return done(null, user);
    })
}

passport.serializeUser(function( user, done ) {
    done( null, user._id );
});

passport.deserializeUser(function( id, done ) {
    User.findOne( { _id: id }, function (err, user) {
        if( err ) { done( err ); }
        done( null, user);
    })
});

// Routes
app.get('/', ensureAuth, function ( req, res ) {
    res.render('index.html');
});

app.get('/register', function ( req, res ) {
    res.render('register.html');
});

app.get('/login', function ( req, res ) {
    res.render('login.html');
});

app.use('/js', express.static(__dirname + '/client/scripts'));
app.use('/css', express.static(__dirname + '/client/stylesheets'));
app.use('/vendor', express.static(__dirname + '/bower_components'));

// API

// Task Endpoints

// Not entirely sure why but these two calls have to come before the general calls below
app.get('/api/users/:uid/tasks/completed', taskController.getCompleted);
app.get('/api/users/:uid/tasks/current', taskController.getCurrent);

app.post('/api/users/:uid/tasks', taskController.create);
app.get('/api/users/:uid/tasks', taskController.list);

app.get('/api/users/:uid/tasks/:id', taskController.listOne);
app.post('/api/users/:uid/tasks/:id', taskController.modify);
app.delete('/api/users/:uid/tasks/:id', taskController.remove);
// app.get('/api/archive', taskController.archive);

// User Endpoints
app.post('/register', userController.create);
app.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            successRedirect: '/'
        })
    );

app.get('/api/users/', userController.list);

// Archive Completed Once a Day
var j = schedule.scheduleJob('0 5 * * *', taskController.archive);

// Start listening
var port = process.env.PORT || 1337;

app.listen(port, function() {
    console.log('Server running at http://localhost:' + port);
});

function ensureAuth( req, res, next ) {
    if( req.user ) {
        next();
    } else {
        res.redirect('/login');
    }

}