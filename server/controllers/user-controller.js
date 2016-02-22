var User = require('../models/user');
var authController = require('./auth-controller.js');

module.exports.create = function ( req, res ) {
    authController.hashPassword( req.body.password, function( err, hash ) {
        if (err) { res.status(500).send('Error generating Hash'); }
        else {
            req.body.password = hash;
            var user = new User( req.body );
            user.save(function( err ) {
                if (err) {
                    res.status(400).send('User name already taken');
                } else {
                    res.redirect('/login');
                }
            });
        }
    });
};

module.exports.fetch = function ( req, res ) {
    if( !req.user ) {
        res.status(400).send('Not Logged In.');
    } else {
        User.findOne({ _id: req.user._id}, function ( err, result ) {
            if ( err ) {
                res.status(400).send('User Not Found');
            } else {
                res.send( result );
            }
        });
    }
};

module.exports.update = function ( req, res ) {
    if( !req.user ) {
        res.status(400).send('Not logged in');
    } else {
        User.findByIdAndUpdate( req.params.id, { $set: req.body }, function( err, result ) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.send( result );
            }
        });
    }
};

module.exports.disable = function( req, res ) {
    if( !req.user ) {
        res.status(400).send('Not logged in');
    } else {
        User.findByIdAndUpdate( req.params.id, { $set: { flags: { isDisabled: true } } }, function(err, result) {
            if(err) {
                res.status(400).send(err);
            } else {
                res.send( result );
            }
        });
    }
};

// module.exports.listAll = function ( req, res ) {
//     if( !req.user || !req.user.flags.isAdmin ) {
//         res.status(400).send('You do not have permission');
//     } else {
//         User.find({}, function (err, results) {
//             if(err) {res.status(400).send('No Users Found'); }
//             else {
//                 res.send(results);
//             }
//         });
//     }
// };

// module.exports.modify = function ( req, res ) {
//     Task.where( { _id: req.params.id } ).update( req.body, function ( err, result ) {
//         if (err) { return; }
//         res.json ( result );
//     });
// };

// module.exports.remove = function ( req, res ) {
//     Task.findOneAndRemove({ _id: req.params.id }, function ( err, result ) {
//         if (err) { return; }
//         res.json ( result );
//     });
// };
