// @flow
import React from 'react';

import { Switch, Route } from 'react-router-dom';

import asyncComponent from '../../../AsyncComponent';

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

export const DeprecatedPages = () => {
  return (
    <Switch>
      <Route
        path="/(|customer/)payment/offer/:id"
        component={DEPRECATEDOfferBooker}
      />
      <Route
        path="/(|customer/)payment/offer-booker-module/:id"
        component={DEPRECATEDOfferBooker}
      />
      <Route
        path="/(|customer/)payment/private-service/:privateServiceId/private-slot/:privateSlotId/"
        component={DEPRECATEDPrivateSlotPaymentPage}
      />
      <Route
        path="/(|customer/)payment/pass/:id"
        component={DEPRECATEDPaymentPackPreCheckout}
      />
      <Route
        path="/(|customer/)payment/combo/:id"
        component={DEPRECATEDPaymentComboPreCheckoutPage}
      />
      <Route
        path="/(|customer/)payment/shop-item/:id"
        component={DEPRECATEDShopItemPreCheckoutPage}
      />
      <Route
        path="/(|customer/)payment/private-pass/:id"
        component={DEPRECATEDPrivatePassPreCheckout}
      />
    </Switch>
  );
};

export default DeprecatedPages;
