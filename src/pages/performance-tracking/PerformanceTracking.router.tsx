import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

import withStayEvent from '../../hocs/tracking/stay-event.hoc';

const ProgramList = asyncComponent(() => import('./ProgramList.page'));

export const PerformanceTrackingRouter = () => {
  return (
    <Switch>
      <Route path="/performance-tracking/:programId" component={ProgramList} />
      <Route path="/performance-tracking" component={ProgramList} />
    </Switch>
  );
};

export default withStayEvent(
  'performance-tracking',
  [30, 90, 180, 320],
)(PerformanceTrackingRouter);
