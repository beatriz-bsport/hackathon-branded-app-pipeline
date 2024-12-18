import React from 'react';
import { Route, Switch } from 'react-router-dom';

// @ts-expect-error
import asyncComponent from '../../AsyncComponent';

const CadenceListPage = asyncComponent(() => import('./CadenceList.page'));
const CadenceDetailPage = asyncComponent(() => import('./CadenceDetail.page'));

export default function CadenceRouter() {
  return (
    <Switch>
      <Route exact component={CadenceDetailPage} path="/audience/:cadenceId" />
      <Route component={CadenceListPage} path="/audience" />
    </Switch>
  );
}
