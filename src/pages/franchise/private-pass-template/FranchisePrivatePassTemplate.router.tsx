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
        path="/f/private-pass-template/:privatePassTemplateId"
        component={FranchisePrivatePassTemplateDetailPage}
      />
      <Route
        path="/f/private-pass-template"
        component={FranchisePrivatePassTemplateListPage}
      />
    </Switch>
  );
};

export default FranchisePrivatePassTemplateRouter;
