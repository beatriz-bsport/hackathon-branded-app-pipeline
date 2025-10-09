// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsportRequestFromHeaderValue } from '../../constants';
import useSaasRouterTracker from '../../hooks/useSaasRouterTracker';
import AddPaymentMethod from './AddPaymentMethodWebview';
import BasketPaymentIntent from './BasketPaymentIntent.page';
import BasketPaymentIntentAPGP from './BasketPaymentIntentAPGP.page';
import ContractPayment from './ContractPayment.page';
import SubscriptionPaymentMethod from './SubscriptionPaymentMethod';
import SpotSchedulingSelector from './SpotSchedulingSelector.page';
import namespaces from '../../i18n/namespaces.json';
import { InvoicePayment } from './InvoicePayment.page';
import { FeatureFlags, useSafeFlag } from '../../utils/feature-flag';

const RNWebView = () => {
  useTranslation(namespaces);
  useSaasRouterTracker(BsportRequestFromHeaderValue.SAAS_RN_WEBVIEW);

  const showWebviewBasketAPGP = useSafeFlag(FeatureFlags.WEBVIEW_BASKET_AP_GP);

  return (
    <Switch>
      <Route
        exact
        component={
          showWebviewBasketAPGP ? BasketPaymentIntentAPGP : BasketPaymentIntent
        }
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
      <Route
        exact
        component={SpotSchedulingSelector}
        path="/rn-webview/spot-scheduling-selector/:companyId/:offerId/"
      />
      <Route
        exact
        component={InvoicePayment}
        path="/rn-webview/invoice-payment/:invoiceUuid/:memberId/:companyId/"
      />
    </Switch>
  );
};

export default RNWebView;
