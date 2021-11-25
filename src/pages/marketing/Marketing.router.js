import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

const MarketingDashboard = asyncComponent(() =>
  import('./MarketingDashboard.component'),
);
const MarketingRule = asyncComponent(() => import('./MarketingRule.component'));
const MarketingNotifications = asyncComponent(() =>
  import('./MarketingNotifications.pages'),
);

const TagManagement = asyncComponent(() => import('./TagManagement.page'));

import withStayEvent from '../../hocs/tracking/stay-event.hoc';

export const MarketingRouter = () => {
  return (
    <Switch>
      <Route path="/marketing/rule/:id" component={MarketingRule} />
      <Route
        path="/marketing/notifications/:notificationId?"
        component={MarketingNotifications}
      />
      <Route path="/marketing/strategies" component={MarketingDashboard} />
      <Route path="/marketing/tags/:selectedTagId" component={TagManagement} />
      <Route path="/marketing/tags" component={TagManagement} />
    </Switch>
  );
};

export default withStayEvent('strategy', [30, 90, 180, 320])(MarketingRouter);
