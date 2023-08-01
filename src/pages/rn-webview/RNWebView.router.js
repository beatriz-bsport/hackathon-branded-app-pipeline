// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsportRequestFromHeaderValue } from '../../constants';
import useSaasRouterTracker from '../../hooks/useSaasRouterTracker';
import AddPaymentMethod from './AddPaymentMethodWebview';
import BasketPaymentIntent from './BasketPaymentIntent.page';
import ContractPayment from './ContractPayment.page';
import SubscriptionPaymentMethod from './SubscriptionPaymentMethod';

import namespaces from '../../i18n/namespaces.json';

export const RNWebView = () => {
  useTranslation(namespaces);
  useSaasRouterTracker(BsportRequestFromHeaderValue.SAAS_RN_WEBVIEW);

  return (
    <Switch>
      <Route
        exact
        component={BasketPaymentIntent}
        path="/rn-webview/payment-intent/:basketId/"
      />
      <Route
        exact
        component={ContractPayment}
        path="/rn-webview/payment-contract/:contractId/"
      />

      <Route
        exact
        component={SubscriptionPaymentMethod}
        path="/rn-webview/subscription-payment-method/:subscriptionId/"
      />
      <Route
        exact
        component={AddPaymentMethod}
        path="/rn-webview/add-payment-method"
      />
    </Switch>
  );
};

export default RNWebView;
