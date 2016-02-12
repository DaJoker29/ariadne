var User = require('../models/user');
var Task = require('../models/task');

module.exports.create = function ( req, res ) {

    var user = new User( { user: req.params.uid } );
    user.tasks.push ( req.body );
    user.save ( function ( err, result ) {
        if (err) { return; }
        res.json( result );
    });
};

module.exports.list = function ( req, res ) {

    User.find({ user: req.params.uid }, function ( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};

module.exports.listOne = function ( req, res ) {
    Task.findOne({ _id: req.params.id }, function ( err, result ) {
        if (err) { return; }
        res.json ( result );
    });
};

module.exports.modify = function ( req, res ) {
    Task.where( { _id: req.params.id } ).update( req.body, function ( err, result ) {
        if (err) { return; }
        res.json ( result );
    });
};

module.exports.remove = function ( req, res ) {
    Task.findOneAndRemove({ _id: req.params.id }, function ( err, result ) {
        if (err) { return; }
        res.json ( result );
    });
};

module.exports.getCategory = function ( req, res ) {
    Task.find({ category: new RegExp(req.params.category, 'i') }, function ( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};

module.exports.getCompleted = function ( req, res ) {
    Task.find( { complete: true }, function ( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};

module.exports.getCurrent = function ( req, res ) {
    Task.find( { current: true }, function ( err, results ) {
        if (err) { return; }
        res.json( results );
    });
};