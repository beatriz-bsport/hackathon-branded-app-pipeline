import React from 'react';
import { Switch, Route } from 'react-router-dom';

// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';

const FranchiseGiftcardTemplateDetailPage = asyncComponent(
  () => import('./FranchiseGiftcardTemplateDetail.page'),
);
const FranchiseGiftcardTemplateListPage = asyncComponent(
  () => import('./FranchiseGiftcardTemplateList.page'),
);

const FranchiseGiftcardTemplateRouter = () => {
  return (
    <Switch>
      <Route
        component={FranchiseGiftcardTemplateDetailPage}
        path="/f/giftcard-template/:giftcardTemplateId"
      />
      <Route
        component={FranchiseGiftcardTemplateListPage}
        path="/f/giftcard-template"
      />
    </Switch>
  );
};

export default FranchiseGiftcardTemplateRouter;
