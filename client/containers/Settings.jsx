import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserSettings from '../components/UserSettings';

class Settings extends Component {
  render() {
    const { displayName } = this.props;
    return (
      <UserSettings displayName={displayName} />
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.user;
  return {
    displayName: user.displayName,
  };
};

Settings.propTypes = {
  displayName: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Settings);
