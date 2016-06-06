import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Reducer from './reducers';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import Registration from './containers/Registration';

let store = createStore(Reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={Dashboard} />
        <Route path="registration" component={Registration} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
