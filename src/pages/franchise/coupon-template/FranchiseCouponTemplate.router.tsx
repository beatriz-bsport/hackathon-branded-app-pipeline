import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Config } from '#src/config';
// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';

const FranchiseCouponTemplateListPage = asyncComponent(
  () => import('./FranchiseCouponTemplateList.page'),
);

const FranchiseCouponTemplateListPageReworked = asyncComponent(
  () => import('./FranchiseCouponTemplateListReworked.page'),
);
const FranchiseCouponTemplateDetailPage = asyncComponent(
  () => import('./FranchiseCouponTemplateDetail.page'),
);

const FranchiseCouponemplateListPageToUse: React.FC = React.memo(() => {
  if (Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
    return <FranchiseCouponTemplateListPageReworked />;
  }
  return <FranchiseCouponTemplateListPage />;
});

const FranchiseCouponTemplateRouter = () => {
  return (
    <Switch>
      <Route
        component={FranchiseCouponTemplateDetailPage}
        path="/f/coupon-template/:couponTemplateId"
      />
      <Route
        component={FranchiseCouponemplateListPageToUse}
        path="/f/coupon-template"
      />
    </Switch>
  );
};

export default FranchiseCouponTemplateRouter;
