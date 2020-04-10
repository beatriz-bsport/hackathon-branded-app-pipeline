// @flow
import React from 'react';

import { Route, Switch } from 'react-router';
import CoachPrivateCalendar from './CoachPrivateCalendar.page';
import PrivateServiceList from './PrivateServiceList.page';
import PrivatePassList from './PrivatePassList.page';
import PrivateServiceRouter from './PrivateServiceDetail.router';
// import CoachPrivateCalendar from './CoachPrivateCalendar.page';

export default () => {
  return (
    <Switch>
      <Route
        exact
        path="/private-service/calendar/:coachId"
        component={CoachPrivateCalendar}
      />
      <Route
        path="/private-service/calendar"
        component={CoachPrivateCalendar}
      />
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
