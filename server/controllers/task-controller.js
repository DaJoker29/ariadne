var Task = require('../models/task');

module.exports.create = function ( req, res ) {
    var task = new Task( req.body );
    task.save(function ( err, result ) {
        res.json( result );
    });
};

module.exports.list = function ( req, res ) {
    Task.find({}, function ( err, results ) {
        res.json( results );
    });
};

module.exports.listOne = function ( req, res ) {
    Task.findOne({ _id: req.params.id }, function ( err, result ) {
        res.json ( result );
    });
}

module.exports.modify = function ( req, res ) {
    Task.where( { _id: req.params.id } ).update( req.body, function ( err, result ) {
        res.json ( result );
    });
}

module.exports.remove = function ( req, res ) {
    Task.findOneAndRemove({ _id: req.params.id }, function ( err, result ) {
        res.json ( result );
    });
}