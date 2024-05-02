import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';

const FranchiseShopList = asyncComponent(
  () => import('./FranchiseShopList.page'),
);

export const FranchiseShopRouter = () => {
  return (
    <Switch>
      <Route component={FranchiseShopList} path="/f/shop" />
    </Switch>
  );
};

export default FranchiseShopRouter;
