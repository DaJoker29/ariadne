import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Layout = ({ children, displayName, isFetching }) => (
  <div className="container" style={{ opacity: isFetching ? 0.5 : 1 }}>
    <div className="page-header">
      <div className="meta pull-right">
        <Link to="/settings">Settings</Link>&nbsp;&bull;&nbsp;
        <a href="/logout">Log Out</a>
      </div>
      <h1><Link to="/">Ariadne&nbsp;</Link>
        <small>
          Intelligent Productivity&nbsp;
          {isFetching && <i className="fa fa-spinner fa-spin"></i>}
        </small>
      </h1>
    </div>
    <p className="lead">Welcome {displayName}</p>
      {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default Layout;
