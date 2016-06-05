import React from 'react';
import { Link } from 'react-router';

const Registration = () => (
  <div>
    <form action="">
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="form-control"
          placeholder="Must be unique. Will be used to log in."
          name="username"
        />
      </div>
      <div className="form-group">
        <label htmlFor="displayName">Display Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="The name admins and collaborators will see."
          name="displayName"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="At least 8 numbers, letters or special characters."
          name="password"
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
      <input
        type="submit"
        className="btn btn-success"
        value="Create Account"
      />
    </form>
    <Link to="/">Already have an account? Log in.</Link>
  </div>
);

export default Registration;
