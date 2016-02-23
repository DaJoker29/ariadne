var Task = require('../models/task');

module.exports.create = function ( req, res ) {
    var task = new Task( req.body );
    task.save(function( err, result ) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json( result );
        }
    });
};

module.exports.fetch = function ( req, res ) {
    if ( !req.user ) {
        res.status(400).send('Not logged in');
    } else {
        Task.find({ owner: req.user._id, 'flags.isArchived': false }, function( err, results ) {
            if (err) { return; }
            res.json( results );
        });
    }
};

module.exports.update = function ( req, res ) {
    if( !req.user ) {
        res.status(400).send('Not logged in');
    } else {
        Task.findByIdAndUpdate( req.params.id, { $set: req.body }, function( err, result ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.send( result );
            }
        });
    }
};

module.exports.delete = function( req, res ) {
    if( !req.user ) {
        res.status(400).send('Not logged in');
    } else {
        Task.remove({ _id: req.params.id }, function(err, result) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.send( result );
            }
        });
    }
};