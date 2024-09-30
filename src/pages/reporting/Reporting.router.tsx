import React from 'react';

import { Route, Switch } from 'react-router-dom';

import ReportReworkedInnerRouter from '#src/pages/reporting/ReportReworkedInner.router';
import ReportGeneration from '#src/pages/reporting/ReportingGeneration.page';
import ReportDetail from '#src/pages/reporting/ReportDetail.page';

export default function Reporting() {
  return (
    <Switch>
      <Route
        exact
        component={ReportReworkedInnerRouter}
        path="/reporting/:tab"
      />
      <Route
        exact
        component={ReportGeneration}
        path="/reporting/v1/detail/:reportId"
      />
      <Route
        exact
        component={ReportDetail}
        path="/reporting/detail/:categoryName/:reportId"
      />
    </Switch>
  );
}
