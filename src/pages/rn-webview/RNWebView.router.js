// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import BasketPaymentIntent from './BasketPaymentIntent.component';
import ContractPayment from './ContractPayment.component';

export const RNWebView = () => (
  <Switch>
    <Route
      exact
      path="/rn-webview/payment-intent/:basketId/"
      component={BasketPaymentIntent}
    />
    <Route
      exact
      path="/rn-webview/payment-contract/:contractId/"
      component={ContractPayment}
    />
  </Switch>
);

export default RNWebView;
