import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Feed from './pages/Feed';
import New from './pages/New';


function Routes() {
  return (
    <Switch>
      <Route path="/" component={Feed} exact />
      <Route path="/new" component={New} exact />
    </Switch>
  );
}

export default Routes;