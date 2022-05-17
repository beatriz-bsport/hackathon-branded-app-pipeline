// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import WorkshopActivityDetail from './WorkshopActivityDetail.page';
import WorkshopActivityInnerRouter from './WorkshopActivityInner.router';
import WorkshopActivityEdit from './WorkshopActivityEdit.page';
import WorkshopActivityCreate from './WorkshopActivityCreate.page';

export default () => {
  return (
    <Switch>
      <Route path="/workshop-activity/add" component={WorkshopActivityCreate} />
      <Route
        path="/workshop-activity/tabs/:tab?"
        component={WorkshopActivityInnerRouter}
      />
      <Route
        path="/workshop-activity/:id/edit"
        component={WorkshopActivityEdit}
      />
      <Route
        exact
        path="/workshop-activity/:id/:tab/:packId"
        component={WorkshopActivityDetail}
      />
      <Route
        exact
        path="/workshop-activity/:id/:tab"
        component={WorkshopActivityDetail}
      />
    </Switch>
  );
};
