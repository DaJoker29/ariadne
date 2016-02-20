// Modules
var express        = require('express');
var passport       = require('passport');
var mongoose       = require('mongoose');
var morgan         = require('morgan');
var expressSession = require('express-session');
var schedule       = require('node-schedule');
var bodyParser     = require('body-parser');
var cookieParser   = require('cookie-parser');
var passportLocal  = require('passport-local');

// Local Modules
var User           = require('./server/models/user');
var authController = require('./server/controllers/auth-controller');
var taskController = require('./server/controllers/task-controller');
var userController = require('./server/controllers/user-controller');

/*              Initialization          */
// Initialize Express
var app = express();

// Connect to Database
mongoose.connect('mongodb://localhost:27017/ariadne');

// Define Static Routes
app.use('/js', express.static(__dirname + '/client/scripts'));
app.use('/css', express.static(__dirname + '/client/stylesheets'));
app.use('/vendor', express.static(__dirname + '/bower_components'));

// Define View Engine
app.set('views', __dirname + '/client/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Initialize Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(expressSession({
    secret            : process.env.SESSION_SECRET || 'secret',
    resave            : false,
    saveUninitialized : false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy( verifyCredentials ));
passport.serializeUser( function( user, done ) {
    done( null, user._id );
});
passport.deserializeUser( function( id, done ) {
    User.findOne( { _id: id }, function (err, user) {
        if( err ) { done( err ); }
        done( null, user);
    })
});

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

app.get('/logout', function ( req, res ) {
    req.logout();
    res.redirect('/');
});

app.get('/admin', ensureAdmin, function ( req, res) {
    res.render('admin.html');
});

app.post('/register', userController.create);
app.post('/login', passport.authenticate('local', {
    failureRedirect : '/login',
    successRedirect : '/'
}));

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

/*              Scheduling              */
var archive = schedule.scheduleJob('0 5 * * *', taskController.archive);

/*              Run                     */
var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('EXPRESS: running on http://localhost:' + port);
});

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

function verifyCredentials ( username, password, done ) {
    User.findOne( { username: new RegExp('^' + username +'$', 'i') }, function (err, user) {
        if( err ) { return done( err ); }
        if( !user ) { return done(null, false); }
        authController.verifyPassword( password, user.password,
            function ( err, flag ) {
                if(err) { return done(err); }
                if (flag) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
    })
}