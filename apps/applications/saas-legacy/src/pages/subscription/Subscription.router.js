// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import SubscriptionCreate from './SubscriptionCreate.page';
import SubscriptionList from './SubscriptionList.page';
import SubscriptionDetailRouter from './SubscriptionDetail.router';

import ContractList from './ContractList.page';
import ContractDetail from './ContractDetail.page';

import ContractListRevamp from './ContractListRevamp.page';
import ContractDetailRevamp from './ContractDetailRevamp.page';

import { FeatureFlags, useSafeFlag } from '../../utils/feature-flag';

export default () => {
  const shouldDisplayNewSubscriptionContracts = useSafeFlag(
    FeatureFlags.NEW_SUBSCRIPTION_CONTRACTS,
  );
  const contractRoutes = shouldDisplayNewSubscriptionContracts
    ? [
        { path: '/subscription/contract/:id', component: ContractDetailRevamp },
        { path: '/subscription/contract/', component: ContractListRevamp },
      ]
    : [
        { path: '/subscription/contract/:id', component: ContractDetail },
        { path: '/subscription/contract/', component: ContractList },
      ];
  return (
    <Switch>
      {contractRoutes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
      <Route
        exact
        component={SubscriptionCreate}
        path="/subscription/add/:memberId"
      />
      <Route component={SubscriptionDetailRouter} path="/subscription/:id" />
      <Route component={SubscriptionList} path="/subscription" />
    </Switch>
  );
};
