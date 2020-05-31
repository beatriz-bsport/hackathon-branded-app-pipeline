// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import SubscriptionCreate from './SubscriptionCreate.page';
import SubscriptionList from './SubscriptionList.page';
import SubscriptionDetail from './SubscriptionDetail.page';

import ContractList from './ContractList.page';
import ContractDetail from './ContractDetail.page';

export default () => (
  <Switch>
    <Route path="/subscription/contract/" component={ContractList} />
    <Route path="/subscription/contract/:id" component={ContractDetail} />
    <Route
      exact
      path="/subscription/add/:memberId"
      component={SubscriptionCreate}
    />
    <Route path="/subscription/:id" component={SubscriptionDetail} />
    <Route path="/subscription" component={SubscriptionList} />
  </Switch>
);
