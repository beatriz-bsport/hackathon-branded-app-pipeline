import React from 'react';

import { Route, Switch } from 'react-router';
import MarketingDashboard from './MarketingDashboard.component';
import MarketingRule from './MarketingRule.component';
import withStayEvent from '../../hocs/tracking/stay-event.hoc';

export const MarketingRouter = () => {
  return (
    <Switch>
      <Route path="/marketing/rule/:id" component={MarketingRule} />
      <Route path="/marketing" component={MarketingDashboard} />
    </Switch>
  );
};

export default withStayEvent('strategy', [30, 90, 180, 320])(MarketingRouter);
