// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import CheckInOfferList from './CheckInOfferList.page';
import CheckInOfferDetail from './CheckInOfferDetail.page';
import CheckInConfirm from './CheckInConfirm.page';

export default () => (
  <Switch>
    <Route exact path="/check-in" component={CheckInOfferList} />
    <Route
      path="/check-in/offer/:offerId/booking/:bookingId"
      component={CheckInConfirm}
    />
    <Route path="/check-in/offer/:offerId" component={CheckInOfferDetail} />
  </Switch>
);
