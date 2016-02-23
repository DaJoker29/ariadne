var Feedback = require('../models/feedback');

module.exports.create = function ( req, res ) {
    if( !req.user ) {
        res.status(400).send('Not logged in');
    } else {
        var feedback = new Feedback( req.body );
        feedback.save(function ( err, result ) {
            if(err) {
                res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    }
};