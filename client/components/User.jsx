import React, { PropTypes } from 'react';

const User = ({ userID, displayName, username, projects, teams, flags }) => (
  <li className="list-group-item">
    <p>
      <strong>{displayName} ({username}) </strong>
      {flags.isAdmin && <span className="label label-success">Admin</span>}
      {flags.isDisabled && <span className="label label-default">Disabled</span>}
    </p>
    <p>
      User ID: {userID}
    </p>
    <p>
      Projects: {projects.join(', ')}
    </p>
    <p>
      Teams: {teams.join(', ')}
    </p>
  </li>
);

User.propTypes = {
  userID: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  flags: PropTypes.object.isRequired,
};

export default User;
