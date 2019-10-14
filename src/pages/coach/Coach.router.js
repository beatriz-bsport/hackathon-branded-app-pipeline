// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import CoachForm from './CoachForm.page';
import CoachPerformance from './CoachPerformance.page';
import CoachDetail from './CoachDetail.page';
import CoachList from './CoachList.page';
import AllCoachPerformance from './AllCoachPerformance.page';
import CoachPrivateCalendar from './CoachPrivateCalendar.page';

export default () => (
  <Switch>
    <Route
      exact
      path="/coach/:associatedCoachId/performance"
      component={CoachPerformance}
    />
    <Route exact path="/coach/add" component={CoachForm} />
    <Route exact path="/coach/edit/:id" component={CoachForm} />
    <Route path="/coach/performance" component={AllCoachPerformance} />
    <Route
      exact
      path="/coach/:coachId/private-calendar"
      component={CoachPrivateCalendar}
    />
    <Route exact path="/coach/:id" component={CoachDetail} />
    <Route path="/coach" component={CoachList} />
  </Switch>
);
