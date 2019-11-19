// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import asyncComponent from '../../AsyncComponent';

const SmartListDetail = asyncComponent(() => import('./SmartListDetail.page'));
const SmartListList = asyncComponent(() => import('./SmartListList.page'));

export default () => {
  return (
    <Switch>
      <Route path="/smart-list/:id/:tab/" component={SmartListDetail} />
      <Route path="/smart-list/:id" component={SmartListList} />
      <Route path="/smart-list" component={SmartListList} />
    </Switch>
  );
};
