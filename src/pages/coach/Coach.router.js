// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import CoachForm from './CoachForm.page';
import CoachPerformance from './CoachPerformance.page';
import CoachDetail from './CoachDetail.page';
import CoachList from './CoachList.page';

export default () => (
  <Switch>
    <Route
      exact
      path="/coach/:associatedCoachId/performance"
      component={CoachPerformance}
    />
    <Route exact path="/coach/add" component={CoachForm} />
    <Route exact path="/coach/:coachId" component={CoachDetail} />
    <Route exact path="/coach/edit/:id" component={CoachForm} />
    <Route path="/coach" component={CoachList} />
  </Switch>
);
