import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';

const FranchiseShopList = asyncComponent(
  () => import('./FranchiseShopList.page'),
);

const FranchiseShopItemTemplateDetail = asyncComponent(
  () => import('./FranchiseShopItemTemplateDetail.page'),
);

export const FranchiseShopRouter = () => {
  return (
    <Switch>
      <Route exact component={FranchiseShopList} path="/f/shop" />
      <Route
        exact
        component={FranchiseShopItemTemplateDetail}
        path="/f/shop/:id"
      />
    </Switch>
  );
};

export default FranchiseShopRouter;
