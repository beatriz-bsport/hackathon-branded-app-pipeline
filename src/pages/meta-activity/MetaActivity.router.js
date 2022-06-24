// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import MetaActivityDetail from './MetaActivityDetail.page';
import MetaActivityList from './MetaActivityList.page';

export default () => (
  <Switch>
    <Route
      exact
      path="/activity/:id/:tab/:packId"
      component={MetaActivityDetail}
    />

    <Route exact path="/activity/:id/:tab" component={MetaActivityDetail} />
    <Route exact path="/activity" component={MetaActivityList} />
  </Switch>
);
