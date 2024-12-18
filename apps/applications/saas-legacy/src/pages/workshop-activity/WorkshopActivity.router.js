// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import WorkshopActivityDetail from './WorkshopActivityDetail.page';
import WorkshopActivityInnerRouter from './WorkshopActivityInner.router';
import WorkshopActivityEdit from './WorkshopActivityEdit.page';

export default () => {
  return (
    <Switch>
      <Route
        component={WorkshopActivityInnerRouter}
        path="/workshop-activity/tabs/:tab?"
      />
      <Route
        component={WorkshopActivityEdit}
        path="/workshop-activity/:id/edit"
      />
      <Route
        exact
        component={WorkshopActivityDetail}
        path="/workshop-activity/:id/:tab/:packId"
      />
      <Route
        exact
        component={WorkshopActivityDetail}
        path="/workshop-activity/:id/:tab"
      />
    </Switch>
  );
};
