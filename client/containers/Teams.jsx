import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUserTeams } from '../actions';
import UserTeams from '../components/UserTeams';

class Teams extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUserTeams());
  }

  render() {
    const { teams } = this.props;
    return (
      <UserTeams teams={teams} />
    );
  }
}

const mapStateToProps = (state) => {
  const { teams } = state.team;
  return {
    teams,
  };
};

Teams.propTypes = {
  dispatch: PropTypes.func.isRequired,
  teams: PropTypes.arrayOf(PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    // members: PropTypes.arrayOf(PropTypes.shape({
    //   displayName: PropTypes.string.isRequired,
    // })).isRequired,
  })).isRequired,
};

export default connect(mapStateToProps)(Teams);
