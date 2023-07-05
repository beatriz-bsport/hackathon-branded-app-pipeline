import React from 'react';
import { Route, Switch } from 'react-router';

import InboxContainer from './InboxContainer.page';

export default () => (
  <Switch>
    <Route path="/inbox/thread/:id/" component={InboxContainer} />
    <Route path="/inbox/thread/" component={InboxContainer} />
  </Switch>
);
