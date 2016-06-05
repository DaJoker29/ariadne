import React from 'react';
import { Link } from 'react-router';

const Layout = (props) => (
  <div className="container">
    <div className="page-header">
      <h1><Link to="/">Ariadne</Link> <small>Intelligent Productivity</small></h1>
    </div>
      {props.children}
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.object.isRequired,
};

export default Layout;
