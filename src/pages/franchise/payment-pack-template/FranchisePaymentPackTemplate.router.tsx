import React from 'react';
import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../../AsyncComponent';

const FranchisePaymentPackTemplateListPage = asyncComponent(
  () => import('./FranchisePaymentPackTemplateList.page'),
);
const FranchisePaymentPackTemplateDetailPage = asyncComponent(
  () => import('./FranchisePaymentPackTemplateDetail.page'),
);

const FranchisePaymentPackTemplateRouter = () => {
  return (
    <Switch>
      <Route
        path="/f/payment-pack-template/:paymentPackTemplateId"
        component={FranchisePaymentPackTemplateDetailPage}
      />
      <Route
        path="/f/payment-pack-template"
        component={FranchisePaymentPackTemplateListPage}
      />
    </Switch>
  );
};

export default FranchisePaymentPackTemplateRouter;
