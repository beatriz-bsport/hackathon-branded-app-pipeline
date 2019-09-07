// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CheckoutPaymentPage from './CheckoutPayment.page';

export default () => (
  <Switch>
    <Route
      path="/(|customer/)checkout/:companyId/"
      component={CheckoutPaymentPage}
    />
  </Switch>
);
