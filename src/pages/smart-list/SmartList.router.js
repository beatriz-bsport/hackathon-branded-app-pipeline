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
      <Route path="/smart-list/:id/:tab/" component={SmartListDetail} />
      <Route path="/smart-list/:id" component={SmartListList} />
      <Route path="/smart-list" component={SmartListList} />
    </Switch>
  );
};

export default withStayEvent(
  'smartlist',
  [30, 60, 120, 240, 680],
)(SmartListRouter);
