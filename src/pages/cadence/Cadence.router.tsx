// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../AsyncComponent';

const CadenceListPage = asyncComponent(() => import('./CadenceList.page'));
const CadenceDetailPage = asyncComponent(() => import('./CadenceDetail.page'));

export default function CadenceRouter() {
  return (
    <Switch>
      <Route exact path="/cadence/:cadenceId" component={CadenceDetailPage} />
      <Route path="/cadence" component={CadenceListPage} />
    </Switch>
  );
}
