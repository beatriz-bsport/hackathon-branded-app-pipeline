// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import BasketPaymentIntent from './BasketPaymentIntent.component';

export const RNWebView = () => (
  <Switch>
    <Route
      exact
      path="/rn-webview/payment-intent/:basketId/"
      component={BasketPaymentIntent}
    />
  </Switch>
);

export default RNWebView;
