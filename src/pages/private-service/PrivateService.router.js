// @flow
import React from 'react';

import { Route, Switch, Redirect } from 'react-router';
import PrivateServiceList from './PrivateServiceList.page';
import PrivatePassList from './PrivatePassList.page';
import PrivateServiceRouter from './PrivateServiceDetail.router';

const ScheduleRedirect = () => <Redirect to="/schedule" />;

export default () => {
  return (
    <Switch>
      <Route path="/private-service/calendar" component={ScheduleRedirect} />
      <Route path="/private-service/pass/" component={PrivatePassList} />
      <Route
        path="/private-service/service/:id/:tab"
        component={PrivateServiceRouter}
      />
      <Route
        path="/private-service/service/:id/"
        component={PrivateServiceRouter}
      />
      <Route path="/private-service/service" component={PrivateServiceList} />
    </Switch>
  );
};
