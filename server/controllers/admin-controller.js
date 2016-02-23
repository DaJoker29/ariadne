var User     = require('../models/user.js');
var Task     = require('../models/task.js');
var Feedback = require('../models/feedback.js');

module.exports.fetchUser = function ( req, res ) {
    console.log('Fetch user');
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else if( req.params.id ) {
        User.find({ _id: req.params.id }, function( err, result ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(result);
            }
        });
    } else {
        User.find({}, function( err, results ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(results);
            }
        });
    }
};

module.exports.fetchTask = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else if( req.params.id ) {
        Task.find({ _id: req.params.id }, function( err, result ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(result);
            }
        });
    } else {
        Task.find({}, function( err, results ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(results);
            }
        });
    }
};

module.exports.updateUser = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else {
        User.update({ _id: req.params.id }, { $set: req.body }, function( err, result ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(result);
            }
        });
    }
};

module.exports.updateTask = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else {
        Task.update({ _id: req.params.id }, { $set: req.body }, function( err, result ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(result);
            }
        });
    }
};

module.exports.deleteTask = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else {
        Task.remove({ _id: req.params.id }, function( err, result ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(result);
            }
        });
    }
};

module.exports.disableUser = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else {
        User.findByIdAndUpdate( req.params.id, { $set: { flags: { isDisabled: true } } }, function(err, result) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.json(result);
            }
        });
    }
};

module.exports.fetchFeedback = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else {
        Feedback.find({}, function( err, results ) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(results);
            }
        });
    }
};

module.exports.fetchStats = function( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else {
        res.send('Authorized');
        // Fetch Stats Code Here
    }
};

module.exports.runArchive = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin) {
        res.status(400).send('Unauthorized');
    } else {
        Task.update(
            { 'flags.isComplete': true, 'flags.isArchived': false },
            { 'flags.isArchived': true, 'flags.isActive': false },
            { multi: true },
            function ( err, result ) {
                var today = new Date();
                console.log('\nArchive Started -- ' + today.toString());
                if (err) {
                    console.log('Archive Failure:', err);
                    res.status(400).send(err);
                } else {
                    console.log('Archive Success: ' + result.n + ' tasks archived.');
                    res.json(result);
                }
            }
        );
    }
};