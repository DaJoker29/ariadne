var User     = require('../models/user.js');
var Task     = require('../models/task.js');
var Feedback = require('../models/feedback.js');
var Archive  = require('../models/archive.js');

module.exports.fetchUser = function ( req, res ) {
    if( req.params.id ) {
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
    if( req.params.id ) {
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
    User.update({ _id: req.params.id }, { $set: req.body }, function( err, result ) {
        if(err) {
            res.status(400).send(err);
        } else {
            res.json(result);
        }
    });
};

module.exports.updateTask = function ( req, res ) {
    Task.update({ _id: req.params.id }, { $set: req.body }, function( err, result ) {
        if(err) {
            res.status(400).send(err);
        } else {
            res.json(result);
        }
    });
};

module.exports.deleteTask = function ( req, res ) {
    Task.remove({ _id: req.params.id }, function( err, result ) {
        if(err) {
            res.status(400).send(err);
        } else {
            res.json(result);
        }
    });
};

module.exports.disableUser = function ( req, res ) {
    User.findByIdAndUpdate( req.params.id, { $set: { flags: { isDisabled: true } } }, function(err, result) {
        if(err) {
            res.status(400).send(err);
        } else {
            res.json(result);
        }
    });
};

module.exports.fetchFeedback = function ( req, res ) {
    Feedback.find({}, function( err, results ) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(results);
        }
    });
};

// module.exports.fetchStats = function( req, res ) {
//     if( !req.user || !req.user.flags.isAdmin) {
//         res.status(400).send('Unauthorized');
//     } else {
//         res.send('Authorized');
//         // Fetch Stats Code Here
//     }
// };

module.exports.runArchive = function ( req, res ) {
    Task.find({'flags.isComplete': true}, function( err, results ) {
        var today = new Date();
        console.log('Archiving Started -- ' + results.length + ' -- ' + today.toString() );

        if (err) {
            console.log('Archive Failure: ', err);
        } else {
            results.forEach(function( doc ) {

                // Add to Archive Collection
                var archive = new Archive( doc );
                archive.flags.isArchived = true;
                archive.flags.isComplete = true;
                archive.flags.isActive = false;
                archive.save();

                // Remove from Task Collection
                Task.remove({ _id: doc._id }, function(err, results) {
                    if(err) {
                        return err;
                    }
                });
            });
            res.status(200).end();
        }
    });
};

module.exports.fetchArchive = function ( req, res ) {
        Archive.find({}, function( err, results ) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.json(results);
            }
        });
};