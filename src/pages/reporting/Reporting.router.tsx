import React from 'react';

import { Route, Switch } from 'react-router-dom';

import ReportingDashboard from './ReportingDashboard.page';
import ReportingGeneration from './ReportingGeneration.page';

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
