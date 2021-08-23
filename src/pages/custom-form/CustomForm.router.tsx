import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

import withStayEvent from '../../hocs/tracking/stay-event.hoc';
import CustomFormDetailRouter from './CustomFormDetail.router';

const CustomFormList = asyncComponent(() => import('./CustomFormList.page'));

export const CustomFormRouter = () => {
  return (
    <Switch>
      <Route
        exact
        path="/custom-form/details/:id/:tab"
        component={CustomFormDetailRouter}
      />
      <Route
        exact
        path="/custom-form/details/:id/"
        component={CustomFormDetailRouter}
      />
      <Route path="/custom-form" component={CustomFormList} />
    </Switch>
  );
};

export default withStayEvent('custom-form', [30, 60, 120, 240, 680])(
  CustomFormRouter,
);
