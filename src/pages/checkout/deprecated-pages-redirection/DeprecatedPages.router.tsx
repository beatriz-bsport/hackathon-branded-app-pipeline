// @ts-nocheck
import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';
import namespaces from '../../../i18n/namespaces.json';

import { BsportRequestFromHeaderValue } from '../../../constants';

import useSaasRouterTracker from '../../../hooks/useSaasRouterTracker';
import asyncComponent from '../../../AsyncComponent';

const MarketplaceAsManager = asyncComponent(
  () => import('../../marketplace/MarketplaceAsManager.page'),
);

const DEPRECATEDOfferBooker = asyncComponent(
  () => import('./OfferBooker.redirect'),
);
const DEPRECATEDPrivateSlotPaymentPage = asyncComponent(
  () => import('./PrivateSlotPayment.redirect'),
);

const DEPRECATEDPaymentPackPreCheckout = asyncComponent(
  () => import('./PaymentPackPreCheckout.redirect'),
);
const DEPRECATEDPaymentComboPreCheckoutPage = asyncComponent(
  () => import('./PaymentComboPreCheckout.redirect'),
);
const DEPRECATEDPrivatePassPreCheckout = asyncComponent(
  () => import('./PrivatePassPreCheckout.redirect'),
);
const DEPRECATEDShopItemPreCheckoutPage = asyncComponent(
  () => import('./ShopItemPreCheckout.redirect'),
);

export const DeprecatedPages = (props: { is_manager: boolean }) => {
  useSaasRouterTracker(BsportRequestFromHeaderValue.SAAS_DEPRECATED_PAYMENT);

  if (props.is_manager) {
    return <MarketplaceAsManager />;
  }
  return (
    <Switch>
      <Route
        component={DEPRECATEDOfferBooker}
        path="/(|customer/)payment/offer/:id"
      />
      <Route
        component={DEPRECATEDOfferBooker}
        path="/(|customer/)payment/offer-booker-module/:id"
      />
      <Route
        component={DEPRECATEDPrivateSlotPaymentPage}
        path="/(|customer/)payment/private-service/:privateServiceId/private-slot/:privateSlotId/"
      />
      <Route
        component={DEPRECATEDPaymentPackPreCheckout}
        path="/(|customer/)payment/pass/:id"
      />
      <Route
        component={DEPRECATEDPaymentComboPreCheckoutPage}
        path="/(|customer/)payment/combo/:id"
      />
      <Route
        component={DEPRECATEDShopItemPreCheckoutPage}
        path="/(|customer/)payment/shop-item/:id"
      />
      <Route
        component={DEPRECATEDPrivatePassPreCheckout}
        path="/(|customer/)payment/private-pass/:id"
      />
    </Switch>
  );
};

export default withTranslation(namespaces)(
  connect((state) => ({
    is_manager: state.auth.is_manager,
  }))(DeprecatedPages),
);
