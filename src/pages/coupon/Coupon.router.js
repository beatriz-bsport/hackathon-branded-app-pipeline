// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import CouponList from './CouponList.page';
import CouponDetail from './CouponDetail.page';

export default () => (
  <Switch>
    <Route path="/coupon/:id/" component={CouponDetail} />
    <Route path="/coupon" component={CouponList} />
  </Switch>
);
