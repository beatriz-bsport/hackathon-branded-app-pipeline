// @flow
import React from 'react';

import { Route, Switch, Redirect } from 'react-router';
import PrivateServiceList from './PrivateServiceList.page';
import PrivatePassList from './PrivatePassList.page';
import PrivateServiceRouter from './PrivateServiceDetail.router';
import PrivatePassDetail from './PrivatePassDetail.page';

const ScheduleRedirect = () => <Redirect to="/schedule" />;

export default () => {
  return (
    <Switch>
      <Route component={ScheduleRedirect} path="/private-service/calendar" />
      <Route component={PrivatePassDetail} path="/private-service/pass/:id" />
      <Route component={PrivatePassList} path="/private-service/pass/" />
      <Route
        component={PrivateServiceRouter}
        path="/private-service/service/:id/:tab"
      />
      <Route
        component={PrivateServiceRouter}
        path="/private-service/service/:id/"
      />
      <Route component={PrivateServiceList} path="/private-service/service" />
    </Switch>
  );
};
