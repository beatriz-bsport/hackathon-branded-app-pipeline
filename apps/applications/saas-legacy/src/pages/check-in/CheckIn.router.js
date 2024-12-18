// @flow
import React from 'react';
import { Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import CheckInOfferList from './CheckInOfferList.page';
import CheckInOfferDetail from './CheckInOfferDetail.page';
import namespaces from '../../i18n/namespaces.json';

export default () => {
  useTranslation(namespaces);

  return (
    <Switch>
      <Route exact component={CheckInOfferList} path="/check-in" />
      <Route component={CheckInOfferDetail} path="/check-in/offer/:offerId" />
    </Switch>
  );
};
