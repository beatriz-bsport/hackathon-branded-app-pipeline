// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import MetaActivityDetail from './MetaActivityDetail.page';
import MetaActivityList from './MetaActivityList.page';
import MetaActivityForm from './MetaActivityEdit.page';
import MetaActivityCreate from './MetaActivityCreate.page';

export default () => (
  <Switch>
    <Route exact path="/activity/add" component={MetaActivityCreate} />
    <Route exact path="/activity/:id/edit" component={MetaActivityForm} />
    <Route exact path="/activity/:id" component={MetaActivityDetail} />
    <Route exact path="/activity" component={MetaActivityList} />
  </Switch>
);
