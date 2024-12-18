// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import MetaActivityDetail from './MetaActivityDetail.page';
import MetaActivityList from './MetaActivityList.page';

export default () => (
  <Switch>
    <Route
      exact
      component={MetaActivityDetail}
      path="/activity/:id/:tab/:packId"
    />

    <Route exact component={MetaActivityDetail} path="/activity/:id/:tab" />
    <Route exact component={MetaActivityList} path="/activity" />
  </Switch>
);
