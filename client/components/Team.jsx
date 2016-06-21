import React, { PropTypes } from 'react';

const Team = ({ teamName }) => (
  <li className="list-group-item">
    <p>
      <strong>{teamName}</strong>
    </p>
  </li>
);

Team.propTypes = {
  teamName: PropTypes.string.isRequired,
};

export default Team;
