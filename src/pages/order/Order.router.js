// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import OrderDetail from './OrderDetail.page';
import OrderList from './OrderList.page';

export default () => (
  <Switch>
    <Route exact path="/order/:id/" component={OrderDetail} />
    <Route path="/order" component={OrderList} />
  </Switch>
);
