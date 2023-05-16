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
      <Route exact path="/cadence/wip" component={CadenceListPage} />
      <Route
        exact
        path="/cadence/:cadenceId"
        component={CadenceDetailPageDEPRECATED}
      />
      <Route
        exact
        path="/cadence/wip/:cadenceId"
        component={CadenceDetailPage}
      />
      <Route path="/cadence" component={CadenceListPageDEPRECATED} />
    </Switch>
  );
}
