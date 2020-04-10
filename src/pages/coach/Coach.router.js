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
    <Route exact path="/coach/add" component={CoachForm} />
    <Route exact path="/coach/edit/:id" component={CoachForm} />
    <Route
      exact
      path="/coach/:associatedCoachId/performance"
      component={CoachPerformance}
    />
    <Route path="/coach/performance" component={AllCoachPerformance} />
    <Route path="/coach/:coachId/:tab" component={CoachDetailRouter} />
    <Route path="/coach/:coachId" component={CoachDetailRouter} />
    <Route path="/coach" component={CoachList} />
  </Switch>
);
