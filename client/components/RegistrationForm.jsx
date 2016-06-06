import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { reduxForm } from 'redux-form';

class RegistrationForm extends Component {
  render() {
    const {
      fields: { username, password, displayName },
      submit,
    } = this.props;
    return (
      <div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Must be unique. Will be used to log in."
              name="username"
              {...username}
            />
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="The name admins and collaborators will see."
              name="displayName"
              {...displayName}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="At least 8 numbers, letters or special characters."
              name="password"
              {...password}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm the password from above."
              name="confirmPassword"
            />
          </div>
          <button
            type="submit"
            className="btn btn-success"
            value="Create Account"
          >
            Submit
          </button>
        </form>
        <Link to="/">Already have an account? Log in.</Link>
      </div>
    );
  }
}

RegistrationForm.propTypes = {
  values: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'registration',
  fields: ['username', 'password', 'displayName'],
}, undefined, { onSubmit: 'registration' })(RegistrationForm);
