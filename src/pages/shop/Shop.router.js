// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import ShopItem from './ShopItem.page';
import ShopList from './ShopList.page';

export default () => (
  <Switch>
    <Route exact path="/shop/:id/" component={ShopItem} />
    <Route path="/shop" component={ShopList} />
  </Switch>
);
