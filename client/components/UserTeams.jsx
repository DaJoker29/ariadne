import React, { PropTypes } from 'react';
import CreateTeam from './CreateTeam';
import Team from './Team';

const UserTeams = ({ teams }) => (
  <div>
    <p className="lead">Create New Team</p>
    <CreateTeam />
    <p className="lead">Your Teams</p>
    <div className="page-header">Team List</div>
    <ul className="list-group">
      {teams.map(team => <Team key={team.teamID} {...team} />)}
    </ul>
  </div>
);

UserTeams.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    // members: PropTypes.arrayOf(PropTypes.shape({
    //   displayName: PropTypes.string.isRequired,
    //   role: PropTypes.string.isRequired,
    // })).isRequired,
  })).isRequired,
};

export default UserTeams;
