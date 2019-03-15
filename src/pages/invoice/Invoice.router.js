// @flow

import React from 'react';
import { Route, Switch } from 'react-router';

import InvoiceEdit from './InvoiceEdit.page';
import InvoiceCreate from './InvoiceCreate.page';
import InvoiceList from './InvoiceList.page';

export default () => (
  <Switch>
    <Route exact path="/invoice/add/member/:id" component={InvoiceCreate} />
    <Route exact path="/invoice/:id" component={InvoiceEdit} />
    <Route path="/invoice" component={InvoiceList} />
  </Switch>
);
