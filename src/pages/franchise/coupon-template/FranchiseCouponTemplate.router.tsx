// @ts-nocheck
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../../AsyncComponent';

const FranchiseCouponTemplateListPage = asyncComponent(
  () => import('./FranchiseCouponTemplateList.page'),
);
const FranchiseCouponTemplateDetailPage = asyncComponent(
  () => import('./FranchiseCouponTemplateDetail.page'),
);

const FranchiseCouponTemplateRouter = () => {
  return (
    <Switch>
      <Route
        path="/f/coupon-template/:couponTemplateId"
        component={FranchiseCouponTemplateDetailPage}
      />
      <Route
        path="/f/coupon-template"
        component={FranchiseCouponTemplateListPage}
      />
    </Switch>
  );
};

export default FranchiseCouponTemplateRouter;
