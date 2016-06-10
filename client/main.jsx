import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router';
import { Provider } from 'react-redux';

import App from './containers/App';
import Dashboard from './components/Dashboard';
import configureStore from './configureStore';

let store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Redirect from="/" to="/dashboard" />
      <Route path="/dashboard" component={App}>
        <IndexRoute component={Dashboard} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
