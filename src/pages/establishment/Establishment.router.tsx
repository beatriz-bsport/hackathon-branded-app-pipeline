// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import EstablishmentDetailRouter from './EstablishmentDetail.router';
import EstablishmentList from './EstablishmentList.page';
import EstablishmentFormPage from './EstablishmentForm.page';
import EstablishmentGroupPage from './EstablishmentGroup.page';

export default () => (
  <Switch>
    <Route exact path="/establishment/add" component={EstablishmentFormPage} />
    <Route
      exact
      path="/establishment/group"
      component={EstablishmentGroupPage}
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
    <Route path="/" component={EstablishmentList} />
  </Switch>
);
