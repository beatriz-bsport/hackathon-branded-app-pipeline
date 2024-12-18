import React from 'react';

import { Route, Switch } from 'react-router';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';

// @ts-expect-error
import withStayEvent from '../../hocs/tracking/stay-event.hoc';
import CustomFormDetailRouter from './CustomFormDetail.router';

const CustomFormList = asyncComponent(() => import('./CustomFormList.page'));

export const CustomFormRouter = () => {
  return (
    <Switch>
      <Route
        exact
        component={CustomFormDetailRouter}
        path="/custom-form/details/:id/:tab"
      />
      <Route
        exact
        component={CustomFormDetailRouter}
        path="/custom-form/details/:id/"
      />
      <Route component={CustomFormList} path="/custom-form" />
    </Switch>
  );
};

export default withStayEvent(
  'custom-form',
  [30, 60, 120, 240, 680],
)(CustomFormRouter);
