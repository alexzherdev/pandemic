import React from 'react';
import { Route, Redirect, IndexRoute } from 'react-router';

import App from './components/App';
import Game from './containers/Game';
import Setup from './containers/Setup';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Setup} />
    <Route path="play" component={Game} />
    <Redirect from="setup" to="/" />
  </Route>
);
