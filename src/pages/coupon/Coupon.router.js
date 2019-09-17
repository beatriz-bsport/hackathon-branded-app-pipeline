// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

// import CouponEdit from './CouponEdit.page';
import CouponCreate from './CouponCreate.page';
import CouponEdit from './CouponEdit.page';
import CouponList from './CouponList.page';
import CouponDetail from './CouponDetail.page';

export default () => (
  <Switch>
    <Route exact path="/coupon/add/" component={CouponCreate} />
    <Route exact path="/coupon/:id/edit/" component={CouponEdit} />
    <Route path="/coupon/:id/" component={CouponDetail} />
    <Route path="/coupon" component={CouponList} />
  </Switch>
);
