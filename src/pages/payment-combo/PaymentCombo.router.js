// @flow
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import withTitle from '../../hocs/with-title.hoc';

import PaymentComboDetail from './PaymentComboDetail.page';
import PaymentComboList from './PaymentComboList.page';

export const PaymentComboRouter = () => (
  <Switch>
    <Route exact path="/combo/:id/" component={PaymentComboDetail} />
    <Route path="/combo" component={PaymentComboList} />
  </Switch>
);

export default compose(
  withNamespaces(['paymentCombo']),
  withTitle(({ t }) => t('pageTitle.list')),
)(PaymentComboRouter);
