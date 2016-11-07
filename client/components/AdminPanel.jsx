import React, { PropTypes } from 'react';
import User from './User';

const AdminPanel = ({ users }) => (
  <div>
    <p className="lead">Admin Settings</p>
    <div className="page-header">User List</div>
    <ul className="list-group">
      {users.map(user => <User key={user.userID} {...user} />)}
    </ul>
  </div>
);

AdminPanel.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired,
    _id: PropTypes.string.isRequired,
    flags: PropTypes.object.isRequired,
  })).isRequired,
};

export default AdminPanel;
