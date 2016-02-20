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

module.exports.listAll = function ( req, res ) {
    if( !req.user || !req.user.flags.isAdmin ) {
        res.status(400).send('You do not have permission');
    } else {
        Task.find({}, function (err, results) {
            if(err) {res.status(400).send('No Tasks Found'); }
            else {
                res.send(results);
            }
        });
    }
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

module.exports.archive = function () {
    Task.update(
        { 'flags.isComplete': true, 'flags.isArchived': false },
        { 'flags.isArchived': true, 'flags.isActive': false },
        { multi: true },
        function ( err, result ) {
            var today = new Date();
            console.log('\nArchive Started -- ' + today.toString());
            if (err) {
                console.log('Archive Failure:', err);
            } else {
                console.log('Archive Success: ' + result.n + ' tasks archived.');
            }
        }
    );
};