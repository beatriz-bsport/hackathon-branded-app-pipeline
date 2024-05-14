import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
// @ts-expect-error
import withStayEvent from '../../hocs/tracking/stay-event.hoc';

const ProgramList = asyncComponent(
  () => import('./InstalmentPaymentConfigurationList.page'),
);

export const InstalmentPaymentRouter = () => {
  return (
    <Switch>
      <Route
        component={ProgramList}
        path="/instalment-payment/:instalmentPaymentId"
      />
      <Route component={ProgramList} path="/" />
    </Switch>
  );
};

export default withStayEvent(
  'performance-tracking',
  [30, 90, 180, 320],
)(InstalmentPaymentRouter);
