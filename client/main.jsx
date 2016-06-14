import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import { Provider } from 'react-redux';

import App from './containers/App';
import Settings from './containers/Settings';
import Admin from './containers/Admin';
import Dashboard from './components/Dashboard';
import configureStore from './configureStore';

let store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Redirect from="/" to="/app" />
      <Route path="/app" component={App}>
        <IndexRoute component={Dashboard} />
        <Route path="/app/settings" component={Settings} />
        <Route path="/app/admin" component={Admin} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
