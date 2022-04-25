// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AddPaymentMethod from './AddPaymentMethodWebview';
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
    <Route
      exact
      path="/rn-webview/add-payment-method"
      component={AddPaymentMethod}
    />
  </Switch>
);

export default RNWebView;
