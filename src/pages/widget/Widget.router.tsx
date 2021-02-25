import React from 'react';
import { Route, Switch } from 'react-router';

import asyncComponent from '../../AsyncComponent';

const BridgeWidget = asyncComponent(() => import('./BridgeWidget.page'));
const Basket = asyncComponent(() => import('./Basket.page'));
const BookingsAndPrivateBookings = asyncComponent(
  () => import('./BookingsAndPrivateBookings.page'),
);

const WidgetRouter = () => {
  return (
    <Switch>
      <Route
        path="/widget/:companyName/:companyId/bridge"
        component={BridgeWidget}
      />
      <Route path="/widget/:companyName/:companyId/basket" component={Basket} />
      <Route
        path="/widget/:companyName/:companyId/bookings/"
        component={BookingsAndPrivateBookings}
      />
    </Switch>
  );
};

export default WidgetRouter;
