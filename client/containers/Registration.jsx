import { connect } from 'react-redux';
import RegistrationForm from '../components/RegistrationForm';
import { createUser } from '../actions';

const mapStateToProps = (state) => ({
  username: state.username,
});

const mapDispatchToProps = (dispatch) => ({
  submit: (data) => {
    dispatch(createUser(data));
  },
});

const Registration = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationForm);

export default Registration;
