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
    Task.find({ owner: req.user._id }, function( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};

module.exports.update = function ( req, res ) {
    Task.findByIdAndUpdate( req.params.id, { $set: req.body }, function( err, result ) {
        if(err) {
            res.status(400).send(err);
        } else {
            res.send( result );
        }
    });
};

module.exports.delete = function( req, res ) {
    Task.remove({ _id: req.params.id }, function(err, result) {
        if(err) {
            res.status(400).send(err);
        } else {
            res.send( result );
        }
    });
};