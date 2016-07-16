/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import configureStore from './store/configureStore';
require('./favicon.ico');
import './assets/styles/app.scss';
import './assets/styles/bootstrap-superhero.min.css';
import './assets/styles/animate.min.css';
import './assets/styles/font-awesome.min.css';
import './assets/styles/styles.scss';

import 'jquery';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, document.getElementById('app')
);
