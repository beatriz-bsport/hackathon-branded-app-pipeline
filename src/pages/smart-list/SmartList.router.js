// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import SmartListList from './SmartListList.page';
import SmartListDetail from './SmartListDetail.page';

export default () => {
  return (
    <Switch>
      <Route path="/smart-list/:id/:tab/" component={SmartListDetail} />
      <Route path="/smart-list/:id" component={SmartListList} />
      <Route path="/smart-list" component={SmartListList} />
    </Switch>
  );
};
