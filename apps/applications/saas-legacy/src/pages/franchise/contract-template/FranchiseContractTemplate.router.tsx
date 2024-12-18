import React from 'react';
import { Switch, Route } from 'react-router-dom';

// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';

const FranchiseContractTemplateListPage = asyncComponent(
  () => import('./FranchiseContractTemplateList.page'),
);
const FranchiseContractTemplateDetailPage = asyncComponent(
  () => import('./FranchiseContractTemplateDetail.page'),
);

const FranchiseContractTemplateRouter = () => {
  return (
    <Switch>
      <Route
        component={FranchiseContractTemplateDetailPage}
        path="/f/subscription/contract-template/:selectedContractTemplateId"
      />
      <Route
        component={FranchiseContractTemplateListPage}
        path="/f/subscription/contract-template"
      />
    </Switch>
  );
};

export default FranchiseContractTemplateRouter;
