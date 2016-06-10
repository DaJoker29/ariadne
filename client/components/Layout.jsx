import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Layout = ({ children }) => (
  <div className="container">
    <div className="page-header">
      <div className="meta pull-right">
        <Link to="/settings">Settings</Link>
        &nbsp;&bull;&nbsp;
        <a href="/logout">Log Out</a>
      </div>
      <h1><Link to="/">Ariadne</Link> <small>Intelligent Productivity</small></h1>
    </div>
      {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
