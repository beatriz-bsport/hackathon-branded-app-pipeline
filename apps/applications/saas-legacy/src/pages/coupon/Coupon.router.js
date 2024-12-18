// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import CouponList from './CouponList.page';
import CouponDetail from './CouponDetail.page';

export default () => (
  <Switch>
    <Route component={CouponDetail} path="/coupon/:id/" />
    <Route component={CouponList} path="/coupon" />
  </Switch>
);
