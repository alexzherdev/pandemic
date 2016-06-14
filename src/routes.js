import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Game from './containers/Game';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Game} />
  </Route>
);
