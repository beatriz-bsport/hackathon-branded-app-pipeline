import React from 'react';
import { Route, Switch } from 'react-router';

import OrderDetail from './OrderDetail.page';
import OrderList from './OrderList.page';

export default () => (
  <Switch>
    <Route exact component={OrderDetail} path="/order/:id/" />
    <Route component={OrderList} path="/order" />
  </Switch>
);
