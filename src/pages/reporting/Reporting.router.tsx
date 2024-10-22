import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import ReportReworkedInnerRouter from '#src/pages/reporting/ReportReworkedInner.router';
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
        component={ReportDetail}
        path="/reporting/detail/:categoryName/:reportId"
      />
      <Redirect to="/reporting/categories" />
    </Switch>
  );
}
