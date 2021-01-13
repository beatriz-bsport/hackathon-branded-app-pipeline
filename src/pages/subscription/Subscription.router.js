// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import SubscriptionCreate from './SubscriptionCreate.page';
import SubscriptionList from './SubscriptionList.page';
import SubscriptionDetailRouter from './SubscriptionDetail.router';

import ContractList from './ContractList.page';
import ContractDetail from './ContractDetail.page';

export default () => (
  <Switch>
    <Route path="/subscription/contract/:id" component={ContractDetail} />
    <Route path="/subscription/contract/" component={ContractList} />
    <Route
      exact
      path="/subscription/add/:memberId"
      component={SubscriptionCreate}
    />
    <Route path="/subscription/:id" component={SubscriptionDetailRouter} />
    <Route path="/subscription" component={SubscriptionList} />
  </Switch>
);
