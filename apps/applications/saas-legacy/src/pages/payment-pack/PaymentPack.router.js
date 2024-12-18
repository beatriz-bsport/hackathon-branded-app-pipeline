// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import PaymentPackList from './PaymentPackList.page';
import PaymentPackDetail from './PaymentPackDetail.page';

export default () => (
  <Switch>
    <Route exact component={PaymentPackDetail} path="/payment-pack/:id" />
    <Route component={PaymentPackList} path="/payment-pack" />
  </Switch>
);
