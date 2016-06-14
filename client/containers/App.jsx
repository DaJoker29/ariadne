import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../actions';
import Layout from '../components/Layout';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUser());
  }

  render() {
    const { children, displayName, isFetching, isAdmin } = this.props;
    return (
      <Layout
        children={children}
        displayName={displayName}
        isFetching={isFetching}
        isAdmin={isAdmin}
      />
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { user, isFetching } = state.user;
  return {
    displayName: user.displayName,
    isFetching,
    isAdmin: user.flags.isAdmin,
  };
}

export default connect(mapStateToProps)(App);