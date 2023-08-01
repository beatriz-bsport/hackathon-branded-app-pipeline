// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import ShopItem from './ShopItem.page';
import ShopList from './ShopList.page';

export default () => (
  <Switch>
    <Route exact component={ShopItem} path="/shop/:id/" />
    <Route component={ShopList} path="/shop" />
  </Switch>
);
