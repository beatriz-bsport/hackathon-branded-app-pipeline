import React from 'react';
import { Route, Switch } from 'react-router';

import InboxContainer from './InboxContainer.page';

export default () => (
  <Switch>
    <Route component={InboxContainer} path="/inbox/thread/:id/" />
    <Route component={InboxContainer} path="/inbox/thread/" />
  </Switch>
);
