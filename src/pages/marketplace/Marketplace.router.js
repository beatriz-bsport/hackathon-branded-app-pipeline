// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import asyncComponent from '../../AsyncComponent';

const MarketplaceResolver = asyncComponent(() =>
  import('./MarketplaceResolver.page'),
);
const Marketplace = asyncComponent(() => import('./Marketplace.page'));

export default () => (
  <Switch>
    <Route exact path="/m/:companyName" component={MarketplaceResolver} />
    <Route exact path="/m/:companyName/:companyId/" component={Marketplace} />
    <Route
      exact
      path="/m/:companyName/:companyId/:tab/"
      component={Marketplace}
    />
  </Switch>
);
