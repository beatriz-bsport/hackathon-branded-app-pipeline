// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import WorkshopActivityDetail from './WorkshopActivityDetail.page';
import WorkshopActivityList from './WorkshopActivityList.page';
import WorkshopActivityForm from './WorkshopActivityForm.page';

export default () => (
  <Switch>
    <Route path="/workshop-activity/add" component={WorkshopActivityForm} />
    <Route
      path="/workshop-activity/:id/edit"
      component={WorkshopActivityForm}
    />
    <Route path="/workshop-activity/:id" component={WorkshopActivityDetail} />
    <Route path="/workshop-activity" component={WorkshopActivityList} />
  </Switch>
);
