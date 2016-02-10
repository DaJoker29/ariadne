var express = require('express');
var app = express();
var mongoose = require('mongoose');
var taskController = require('./server/controllers/task-controller');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/ariadne');

app.use(bodyParser());

app.get('/', function ( req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));

// API
app.post('/api/tasks', taskController.create);
app.get('/api/tasks', taskController.list);

app.listen(3000, function() {
    console.log('Listening');
});