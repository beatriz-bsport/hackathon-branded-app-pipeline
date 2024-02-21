import React from 'react';
import { Route, Switch } from 'react-router';
import Config from '../../config';
// @ts-expect-error
import ShopItem from './ShopItem.page';
import ShopItemDetail from './ShopItemDetail.page';
// @ts-expect-error
import ShopList from './ShopList.page';
// @ts-expect-error
import ShopListReworkedPage from './ShopListReworked.page';

const ShopListPageComponent = !['production', 'staging'].includes(
  Config.REACT_APP_SENTRY_ENVIRONMENT,
)
  ? ShopListReworkedPage
  : ShopList;

const ShopItemDetailPageComponent = !['production', 'staging'].includes(
  Config.REACT_APP_SENTRY_ENVIRONMENT,
)
  ? ShopItemDetail
  : ShopItem;

export default () => (
  <Switch>
    <Route exact component={ShopItemDetailPageComponent} path="/shop/:id/" />
    <Route component={ShopListPageComponent} path="/shop" />
  </Switch>
);
