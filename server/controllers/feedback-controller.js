var Feedback = require('../models/feedback');

module.exports.create = function ( req, res ) {
    var feedback = new Feedback( req.body );
    feedback.save(function ( err, result ) {
        if(err) {
            res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};