// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import InvoiceCreate from './InvoiceCreate.page';
import InvoiceList from './InvoiceList.page';
import InvoiceCreationPage from './InvoiceCreation.page';
import InvoiceDetailRouter from './InvoiceDetail.router';

export default () => (
  <Switch>
    <Route exact path="/invoice/add/member/:id" component={InvoiceCreate} />
    <Route
      exact
      path="/invoice/bill-member/:memberId/"
      component={InvoiceCreationPage}
    />
    <Route exact path="/invoice/:uuid/" component={InvoiceDetailRouter} />
    <Route path="/invoice" component={InvoiceList} />
  </Switch>
);
