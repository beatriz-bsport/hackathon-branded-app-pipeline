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
        path="/f/marketing/tags/:selectedTagId"
        component={FranchiseTagManagement}
      />
      <Route path="/f/marketing/tags" component={FranchiseTagManagement} />
    </Switch>
  );
};

export default MarketingRouter;
