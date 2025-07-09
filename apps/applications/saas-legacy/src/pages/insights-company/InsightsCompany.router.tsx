import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import InsightsCompanyInnerRouter from '#src/pages/insights-company/InsightsCompanyInner.router';

export default function InsightsCompany() {
  return (
    <Switch>
      <Route
        exact
        component={InsightsCompanyInnerRouter}
        path="/insights-company/:tab"
      />
      <Redirect to="/insights-company/overview" />
    </Switch>
  );
}
