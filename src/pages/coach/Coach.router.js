// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import CoachForm from './CoachForm.page';
import CoachPerformance from './CoachPerformance.page';
import CoachDetailRouter from './CoachDetail.router';
import CoachList from './CoachList.page';
import AllCoachPerformance from './AllCoachPerformance.page';

export default () => (
  <Switch>
    <Route exact component={CoachForm} path="/coach/add" />
    <Route exact component={CoachForm} path="/coach/edit/:id" />
    <Route
      exact
      component={CoachPerformance}
      path="/coach/:associatedCoachId/performance"
    />
    <Route component={AllCoachPerformance} path="/coach/performance" />
    <Route component={CoachDetailRouter} path="/coach/:coachId/:tab" />
    <Route component={CoachDetailRouter} path="/coach/:coachId" />
    <Route component={CoachList} path="/coach" />
  </Switch>
);
