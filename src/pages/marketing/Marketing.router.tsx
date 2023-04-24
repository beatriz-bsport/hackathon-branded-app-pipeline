// @ts-nocheck
import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

const FakeMarketingDashboard = asyncComponent(
  () => import('./FakeMarketingDashboard.page'),
);
const FakeMarketingRule = asyncComponent(
  () => import('./FakeMarketingRule.page'),
);
const MarketingRuleList = asyncComponent(
  () => import('./MarketingRuleList.page'),
);

const MarketingTagManagement = asyncComponent(
  () => import('./MarketingTagManagement.page'),
);

export const MarketingRouter = () => {
  return (
    <Switch>
      <Route path="/marketing/rule/:id" component={FakeMarketingRule} />
      <Route
        path="/marketing/notifications/:notificationId"
        component={MarketingRuleList}
      />
      <Route path="/marketing/notifications" component={MarketingRuleList} />
      <Route path="/marketing/strategies" component={FakeMarketingDashboard} />
      <Route
        path="/marketing/tags/:selectedTagId"
        component={MarketingTagManagement}
      />
      <Route path="/marketing/tags" component={MarketingTagManagement} />
    </Switch>
  );
};

export default MarketingRouter;
