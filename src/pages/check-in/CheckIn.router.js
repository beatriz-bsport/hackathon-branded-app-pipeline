// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import CheckInOfferList from './CheckInOfferList.page';
import CheckInOfferDetail from './CheckInOfferDetail.page';
import CheckInConfirm from './CheckInConfirm.page';
import namespaces from '../../i18n/namespaces.json';

export default () => {
  useTranslation(namespaces);

  return (
    <Switch>
      <Route exact path="/check-in" component={CheckInOfferList} />
      <Route
        path="/check-in/offer/:offerId/booking/:bookingId"
        component={CheckInConfirm}
      />
      <Route path="/check-in/offer/:offerId" component={CheckInOfferDetail} />
    </Switch>
  );
};
