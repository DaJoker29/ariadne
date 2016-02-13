var Task = require('../models/task');

module.exports.create = function ( req, res ) {

    var task = new Task( req.body );
    task.save(function( err, result ) {
        if (err) {
            res.sendStatus(400).end();
        } else {
            res.json( result );
        }
    });
};

module.exports.list = function ( req, res ) {

    Task.find({ owner: req.params.uid, 'flags.isArchived': false }, function( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};

module.exports.listOne = function ( req, res ) {

    Task.findOne({ owner: req.params.uid, _id: req.params.id }, function ( err, result ) {
        if (err) { return; }
        res.json ( result );
    });
};

module.exports.modify = function ( req, res ) {
    Task.where( { owner: req.params.uid, _id: req.params.id } ).update( req.body, function ( err, result ) {
        if (err) { return; }
        res.json ( result );
    });
};

module.exports.remove = function ( req, res ) {
    Task.findOneAndRemove({ owner: req.params.uid, _id: req.params.id }, function ( err, result ) {
        if (err) { return; }
        res.json ( result );
    });
};

module.exports.getCompleted = function ( req, res ) {
    Task.find( { owner: req.params.uid, complete: true }, function ( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};

module.exports.getCurrent = function ( req, res ) {
    Task.find( { owner: req.params.uid, current: true }, function ( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};