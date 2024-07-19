import React from 'react';

import { Route, Switch } from 'react-router-dom';

import ReportingDashboard from './ReportingDashboard.page';
import ReportingGeneration from './ReportingGeneration.page';

export default function Reporting() {
  return (
    <Switch>
      <Route exact component={ReportingDashboard} path="/reporting/" />
      <Route
        exact
        component={ReportingGeneration}
        path="/reporting/:reportId"
      />
      <Route
        exact
        // Will be defined in later commit
        component={null}
        path="/reporting/:categoryName/:reportId"
      />
    </Switch>
  );
}
