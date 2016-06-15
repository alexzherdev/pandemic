/* eslint-disable import/default */

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
require('./favicon.ico');
// import 'bootstrap-sass/assets/stylesheets/_bootstrap.scss';
import './assets/styles/app.scss';
import './assets/styles/bootstrap-superhero.min.css';
import './assets/styles/styles.scss';

import 'jquery';

const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>, document.getElementById('app')
);
