const Team = require('../models/team');
const User = require('../models/user');

module.exports.create = (req, res) => {
  const doc = Object.assign(req.body, {
    founder: req.user.userID,
    admins: [req.user.userID],
    members: [req.user.userID],
  });
  const team = new Team(doc);
  team.save((err, newTeam) => {
    if (err) {
      res.status(400).send(err);
    } else {
      User.findByIdAndUpdate(
        req.user.userID,
        { $push: { teams: newTeam.teamID } },
        { new: true },
        (e) => {
          if (e) {
            res.status(400).send(e);
          } else {
            res.send(newTeam);
          }
        }
      );
    }
  });
};
