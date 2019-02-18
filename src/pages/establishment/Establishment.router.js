// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import EstablishmentDetail from './EstablishmentDetail.page';
import EstablishmentList from './EstablishmentList.page';
import EstablishmentFormPage from './EstablishmentForm.page';

export default () => (
  <Switch>
    <Route exact path="/establishment/add" component={EstablishmentFormPage} />
    <Route
      exact
      path="/establishment/edit/:id"
      component={EstablishmentFormPage}
    />
    <Route
      exact
      path="/establishment/details/:id"
      component={EstablishmentDetail}
    />
    <Route path="/" component={EstablishmentList} />
  </Switch>
);
