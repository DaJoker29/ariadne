import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import Registration from './pages/Registration';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Dashboard} />
      <Route path="registration" component={Registration} />
    </Route>
  </Router>,
  document.getElementById('root')
);
