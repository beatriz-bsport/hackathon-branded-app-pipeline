// @flow

import React from 'react';

import { Route, Switch } from 'react-router-dom';

import ReportingDashboard from './ReportingDashboard.component';
import ReportingGeneration from './ReportingGeneration.component';

export default function Reporting() {
  return (
    <Switch>
      <Route exact path="/reporting/" component={ReportingDashboard} />
      <Route
        exact
        path="/reporting/:reportId"
        component={ReportingGeneration}
      />
    </Switch>
  );
}
