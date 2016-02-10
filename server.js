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

app.use('/js', express.static(__dirname + '/client/js'));

// API
app.post('/api/tasks', taskController.create);
app.get('/api/tasks', taskController.list);

app.get('/api/tasks/:id', taskController.listOne);
app.post('/api/tasks/:id', taskController.modify);
app.delete('/api/tasks/:id', taskController.remove);

app.get('/api/tasks/category/:category', taskController.getCategory);

// Start listening
app.listen(3000, function() {
    console.log('Listening');
});