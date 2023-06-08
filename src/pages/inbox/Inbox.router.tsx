// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router';

import InboxThreadList from './InboxThreadList.page';

export default () => (
  <Switch>
    <Route exact path="/inbox/threads/" component={InboxThreadList} />
  </Switch>
);
