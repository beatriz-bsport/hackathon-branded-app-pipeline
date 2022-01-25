import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

import withStayEvent from '../../hocs/tracking/stay-event.hoc';

const ProgramList = asyncComponent(
  () => import('./InstalmentPaymentConfigurationList.page'),
);

export const InstalmentPaymentRouter = () => {
  return (
    <Switch>
      <Route
        path="/instalment-payment/:instalmentPaymentId"
        component={ProgramList}
      />
      <Route path="/" component={ProgramList} />
    </Switch>
  );
};

export default withStayEvent(
  'performance-tracking',
  [30, 90, 180, 320],
)(InstalmentPaymentRouter);
