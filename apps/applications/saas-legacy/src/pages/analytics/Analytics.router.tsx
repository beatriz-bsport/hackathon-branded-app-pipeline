import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import AnalyticsInnerRouter from '#src/pages/analytics/AnalyticsInner.router';

export default function Analytics() {
  return (
    <Switch>
      <Route exact component={AnalyticsInnerRouter} path="/analytics/:tab" />
      <Redirect to="/analytics/overview" />
    </Switch>
  );
}
