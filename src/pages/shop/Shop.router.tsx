import React from 'react';
import { Route, Switch } from 'react-router';
import Config from '../../config';
// @ts-expect-error
import ShopItem from './ShopItem.page';
// @ts-expect-error

import ShopList from './ShopList.page';
// @ts-expect-error

import ShopListReworkedPage from './ShopListReworked.page';

const ShopListPageComponent = !['production', 'staging'].includes(
  Config.REACT_APP_SENTRY_ENVIRONMENT,
)
  ? ShopListReworkedPage
  : ShopList;

export default () => (
  <Switch>
    <Route exact component={ShopItem} path="/shop/:id/" />
    <Route component={ShopListPageComponent} path="/shop" />
  </Switch>
);
