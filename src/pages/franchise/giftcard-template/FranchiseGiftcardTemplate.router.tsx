import React from 'react';
import { Switch, Route } from 'react-router-dom';

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
        path="/f/giftcard-template/:giftcardTemplateId"
        component={FranchiseGiftcardTemplateDetailPage}
      />
      <Route
        path="/f/giftcard-template"
        component={FranchiseGiftcardTemplateListPage}
      />
    </Switch>
  );
};

export default FranchiseGiftcardTemplateRouter;
