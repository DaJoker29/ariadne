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
    const { children, displayName, isFetching } = this.props;
    return (
      <Layout
        children={children}
        displayName={displayName}
        isFetching={isFetching}
      />
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const { user, isFetching } = state.user;
  return {
    displayName: user.displayName,
    isFetching,
  };
}

export default connect(mapStateToProps)(App);
