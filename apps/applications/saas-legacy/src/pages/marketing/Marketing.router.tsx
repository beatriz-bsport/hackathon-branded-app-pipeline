import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
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
      <Route component={FakeMarketingRule} path="/marketing/rule/:id" />
      <Route
        component={MarketingRuleList}
        path="/marketing/notifications/:notificationId"
      />
      <Route component={MarketingRuleList} path="/marketing/notifications" />
      <Route component={FakeMarketingDashboard} path="/marketing/strategies" />
      <Route
        component={MarketingTagManagement}
        path="/marketing/tags/:selectedTagId"
      />
      <Route component={MarketingTagManagement} path="/marketing/tags" />
    </Switch>
  );
};

export default MarketingRouter;
