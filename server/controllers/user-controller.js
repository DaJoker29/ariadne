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

module.exports.list = function ( req, res ) {
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