import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Layout = ({ children }) => (
  <div className="container">
    <div className="page-header">
      <h1><Link to="/">Ariadne</Link> <small>Intelligent Productivity</small></h1>
    </div>
      {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
