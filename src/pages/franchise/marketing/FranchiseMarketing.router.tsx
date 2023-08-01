// @ts-nocheck
import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../../AsyncComponent';

const FranchiseTagManagement = asyncComponent(
  () => import('./FranchiseTagManagement.page'),
);

export const MarketingRouter = () => {
  return (
    <Switch>
      <Route
        component={FranchiseTagManagement}
        path="/f/marketing/tags/:selectedTagId"
      />
      <Route component={FranchiseTagManagement} path="/f/marketing/tags" />
    </Switch>
  );
};

export default MarketingRouter;
