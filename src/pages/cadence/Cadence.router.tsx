// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import asyncComponent from '../../AsyncComponent';

const CadenceListPageDEPRECATED = asyncComponent(
  () => import('./CadenceListDEPRECATED.page'),
);
const CadenceDetailPageDEPRECATED = asyncComponent(
  () => import('./CadenceDetailDEPRECATED.page'),
);

const CadenceListPage = asyncComponent(() => import('./CadenceList.page'));
const CadenceDetailPage = asyncComponent(() => import('./CadenceDetail.page'));

export default function CadenceRouter() {
  return (
    <Switch>
      <Route exact component={CadenceListPage} path="/cadence/wip" />
      <Route
        exact
        component={CadenceDetailPageDEPRECATED}
        path="/cadence/:cadenceId"
      />
      <Route
        exact
        component={CadenceDetailPage}
        path="/cadence/wip/:cadenceId"
      />
      <Route component={CadenceListPageDEPRECATED} path="/cadence" />
    </Switch>
  );
}
