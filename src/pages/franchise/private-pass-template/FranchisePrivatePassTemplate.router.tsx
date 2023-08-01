// @ts-nocheck
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../../AsyncComponent';

const FranchisePrivatePassTemplateListPage = asyncComponent(
  () => import('./FranchisePrivatePassTemplateList.page'),
);
const FranchisePrivatePassTemplateDetailPage = asyncComponent(
  () => import('./FranchisePrivatePassTemplateDetail.page'),
);

const FranchisePrivatePassTemplateRouter = () => {
  return (
    <Switch>
      <Route
        component={FranchisePrivatePassTemplateDetailPage}
        path="/f/private-pass-template/:privatePassTemplateId"
      />
      <Route
        component={FranchisePrivatePassTemplateListPage}
        path="/f/private-pass-template"
      />
    </Switch>
  );
};

export default FranchisePrivatePassTemplateRouter;
