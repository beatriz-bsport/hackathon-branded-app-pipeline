// @ts-nocheck
import React from 'react';

import { Route, Switch } from 'react-router';
import EstablishmentLocationRouter from './EstablishmentLocation.router';
import EstablishmentDetailRouter from './EstablishmentDetail.router';
import EstablishmentFormPage from './EstablishmentForm.page';

export default () => {
  return (
    <Switch>
      <Route
        exact
        component={EstablishmentFormPage}
        path="/establishment/add"
      />
      <Route
        exact
        component={EstablishmentFormPage}
        path="/establishment/edit/:id"
      />
      <Route
        component={EstablishmentDetailRouter}
        path="/establishment/details/:id/:tab"
      />

      <Route
        component={EstablishmentDetailRouter}
        path="/establishment/details/:id/"
      />

      <Route
        component={EstablishmentLocationRouter}
        path="/establishment/:tab"
      />
      <Route component={EstablishmentLocationRouter} path="/" />
    </Switch>
  );
};
