import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const Layout = ({ children, displayName, isFetching, isAdmin }) => (
  <div className="container" style={{ opacity: isFetching ? 0.5 : 1 }}>
    <div className="page-header">
      <div className="meta pull-right">
        <p className="text-right">
          <strong>{displayName}</strong>
        </p>
        {isAdmin && <span><Link to="/app/admin">(Admin)</Link>&nbsp;&bull;&nbsp;</span>}
        <Link to="/app/teams">Teams</Link>&nbsp;&bull;&nbsp;
        <Link to="/app/settings">Settings</Link>&nbsp;&bull;&nbsp;
        <a href="/logout">Log Out</a>
      </div>
      <h1><Link to="/">Ariadne&nbsp;</Link>
        <small>
          Intelligent Productivity&nbsp;
          {isFetching && <i className="fa fa-spinner fa-spin"></i>}
        </small>
      </h1>
    </div>
    {
      children.props.location.pathname === '/app'
      && <p className="lead">Welcome {displayName}</p>
    }
      {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default Layout;
