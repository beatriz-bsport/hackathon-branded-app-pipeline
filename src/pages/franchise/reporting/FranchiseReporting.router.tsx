import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';

const FranchiseReportingInnerRouter = asyncComponent(
  () => import('./FranchiseReportingInner.router'),
);

const FranchiseReportDetail = asyncComponent(
  () => import('./FranchiseReportDetail.page'),
);

const FranchiseReportDetailV2 = asyncComponent(
  () => import('./FranchiseReportDetailV2.page'),
);

export const FranchiseReportingRouter = () => {
  return (
    <Switch>
      <Route
        exact
        component={FranchiseReportingInnerRouter}
        path="/f/reporting/:tab"
      />
      <Route
        exact
        component={FranchiseReportDetail}
        path="/f/reporting/v1/detail/:reportId"
      />
      <Route
        exact
        component={FranchiseReportDetailV2}
        path="/f/reporting/detail/:categoryName/:reportId"
      />
    </Switch>
  );
};

export default FranchiseReportingRouter;
