// @ts-nocheck
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
        component={FranchisePaymentPackTemplateDetailPage}
        path="/f/payment-pack-template/:paymentPackTemplateId"
      />
      <Route
        component={FranchisePaymentPackTemplateListPage}
        path="/f/payment-pack-template"
      />
    </Switch>
  );
};

export default FranchisePaymentPackTemplateRouter;
