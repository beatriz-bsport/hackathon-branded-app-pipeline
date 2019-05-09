// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import SubscriptionCreate from './SubscriptionCreate.page';
import SubscriptionList from './SubscriptionList.page';

export default () => (
  <Switch>
    <Route
      exact
      path="/subscription/add/:memberId"
      component={SubscriptionCreate}
    />
    <Route path="/subscription" component={SubscriptionList} />
  </Switch>
);
