// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import WorkshopActivityDetail from './WorkshopActivityDetail.page';
import WorkshopActivityList from './WorkshopActivityList.page';
import WorkshopActivityEdit from './WorkshopActivityEdit.page';
import WorkshopActivityCreate from './WorkshopActivityCreate.page';

export default () => (
  <Switch>
    <Route path="/workshop-activity/add" component={WorkshopActivityCreate} />
    <Route
      path="/workshop-activity/:id/edit"
      component={WorkshopActivityEdit}
    />
    <Route path="/workshop-activity/:id" component={WorkshopActivityDetail} />
    <Route path="/workshop-activity" component={WorkshopActivityList} />
  </Switch>
);
