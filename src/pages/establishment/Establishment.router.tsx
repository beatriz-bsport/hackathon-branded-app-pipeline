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
        path="/establishment/add"
        component={EstablishmentFormPage}
      />
      <Route
        exact
        path="/establishment/edit/:id"
        component={EstablishmentFormPage}
      />
      <Route
        path="/establishment/details/:id/:tab"
        component={EstablishmentDetailRouter}
      />

      <Route
        path="/establishment/details/:id/"
        component={EstablishmentDetailRouter}
      />

      <Route
        path="/establishment/:tab"
        component={EstablishmentLocationRouter}
      />
      <Route path="/" component={EstablishmentLocationRouter} />
    </Switch>
  );
};
