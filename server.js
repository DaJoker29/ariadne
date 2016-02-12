var express = require('express');
var app = express();
var mongoose = require('mongoose');
var taskController = require('./server/controllers/task-controller');
var bodyParser = require('body-parser');

// Connect to DB
mongoose.connect('mongodb://localhost:27017/ariadne');

// Enable JSON Body Parsing
app.use(bodyParser());

// Routes
app.get('/', function ( req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/scripts'));
app.use('/css', express.static(__dirname + '/client/stylesheets'));
app.use('/vendor', express.static(__dirname + '/bower_components'));

// API

// Not entirely sure why but these two calls have to come before the general calls below
app.get('/api/users/:uid/tasks/completed', taskController.getCompleted);
app.get('/api/users/:uid/tasks/current', taskController.getCurrent);

app.post('/api/users/:uid/tasks', taskController.create);
app.get('/api/users/:uid/tasks', taskController.list);

app.get('/api/users/:uid/tasks/:id', taskController.listOne);
app.post('/api/users/:uid/tasks/:id', taskController.modify);
app.delete('/api/users/:uid/tasks/:id', taskController.remove);

app.get('/api/users/:uid/tasks/category/:category', taskController.getCategory);


// Start listening
app.listen(3000, function() {
    console.log('Listening');
});