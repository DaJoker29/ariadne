import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchAllUsers } from '../actions';
import AdminPanel from '../components/AdminPanel';

class Admin extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchAllUsers());
  }

  render() {
    const { users } = this.props;
    return (
      <AdminPanel
        users={users}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { users } = state.admin;
  return {
    users,
  };
};

Admin.propTypes = {
  // displayName: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(Admin);
