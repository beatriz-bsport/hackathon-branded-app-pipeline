// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

import withStayEvent from '../../hocs/tracking/stay-event.hoc';

const SmartListDetail = asyncComponent(() => import('./SmartListDetail.page'));
const SmartListList = asyncComponent(() => import('./SmartListList.page'));

export const SmartListRouter = () => {
  return (
    <Switch>
      <Route component={SmartListDetail} path="/smart-list/:id/:tab/" />
      <Route component={SmartListList} path="/smart-list/:id" />
      <Route component={SmartListList} path="/smart-list" />
    </Switch>
  );
};

export default withStayEvent(
  'smartlist',
  [30, 60, 120, 240, 680],
)(SmartListRouter);
