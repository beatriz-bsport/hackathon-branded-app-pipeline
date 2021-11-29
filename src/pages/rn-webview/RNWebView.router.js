// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import BasketPaymentIntent from './BasketPaymentIntent.page';
import ContractPayment from './ContractPayment.page';
import SubscriptionPaymentMethod from './SubscriptionPaymentMethod';

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

    <Route
      exact
      path="/rn-webview/subscription-payment-method/:subscriptionId/"
      component={SubscriptionPaymentMethod}
    />
  </Switch>
);

export default RNWebView;
