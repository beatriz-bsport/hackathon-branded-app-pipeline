// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import PaymentPackForm from './PaymentPackForm.page';
import PaymentPackList from './PaymentPackList.page';

export default () => (
  <Switch>
    <Route exact path="/payment-pack/add" component={PaymentPackForm} />
    <Route exact path="/payment-pack/:id/edit" component={PaymentPackForm} />
    <Route path="/payment-pack" component={PaymentPackList} />
  </Switch>
);
