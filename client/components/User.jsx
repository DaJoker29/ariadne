import React, { PropTypes } from 'react';

const User = ({ _id, displayName, username, projects, flags }) => (
  <li className="list-group-item">
    <p>
      <strong>{displayName} ({username}) </strong>
      {flags.isAdmin && <span className="label label-success">Admin</span>}
      {flags.isDisabled && <span className="label label-default">Disabled</span>}
    </p>
    <p>
      User ID: {_id}
    </p>
    <p>
      Projects: {projects.join(', ')}
    </p>
  </li>
);

User.propTypes = {
  _id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
  flags: PropTypes.object.isRequired,
};

export default User;
