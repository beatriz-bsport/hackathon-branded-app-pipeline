// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import PaymentPackList from './PaymentPackList.page';
import PaymentPackDetail from './PaymentPackDetail.page';

export default () => (
  <Switch>
    <Route exact path="/payment-pack/:id" component={PaymentPackDetail} />
    <Route path="/payment-pack" component={PaymentPackList} />
  </Switch>
);
