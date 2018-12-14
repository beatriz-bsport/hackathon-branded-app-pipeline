// @flow

import React from 'react';

import { Route, Switch } from 'react-router-dom';

import ReportingDashboard from './ReportingDashboard.component';

type Props = {};

export default function Reporting(props: Props) {
  return (
    <Switch>
      <Route path="/" component={ReportingDashboard} />
    </Switch>
  );
}
