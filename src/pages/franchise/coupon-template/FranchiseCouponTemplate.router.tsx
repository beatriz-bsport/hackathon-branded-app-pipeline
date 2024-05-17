import React from 'react';
import { Switch, Route } from 'react-router-dom';

// @ts-expect-error
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
        component={FranchiseCouponTemplateDetailPage}
        path="/f/coupon-template/:couponTemplateId"
      />
      <Route
        component={FranchiseCouponTemplateListPage}
        path="/f/coupon-template"
      />
    </Switch>
  );
};

export default FranchiseCouponTemplateRouter;
