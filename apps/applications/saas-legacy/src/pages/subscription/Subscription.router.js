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
    <Route component={ContractDetail} path="/subscription/contract/:id" />
    <Route component={ContractList} path="/subscription/contract/" />
    <Route
      exact
      component={SubscriptionCreate}
      path="/subscription/add/:memberId"
    />
    <Route component={SubscriptionDetailRouter} path="/subscription/:id" />
    <Route component={SubscriptionList} path="/subscription" />
  </Switch>
);
