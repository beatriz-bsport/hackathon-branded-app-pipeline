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
};

export default RNWebView;
