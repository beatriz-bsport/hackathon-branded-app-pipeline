import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';

import MyBookings from './consumer/MyBookings.component';
import MyPaymentPacks from './consumer/MyPaymentPacks.component';
import MyProfile from './consumer/MyProfile.component';
import OfferPayment from '../components/consumer/OfferPayment.component';
import PaymentPackPayment from '../components/consumer/PaymentPackPayment.component';

import { ConsumerMenu } from '../components';

const styles = (theme) => ({
  container: {},
});

type Props = {};

export class ConsumerHome extends Component<Props> {
  componentWillMount() {
    const { t } = this.props;
    document.title = t('pageTitle.myAccount');
  }

  render() {
    return (
      <ConsumerMenu>
        <Switch>
          <Route path="/pass" component={MyPaymentPacks} />
          <Route path="/profile" component={MyProfile} />
          <Route path="/payment/offer/:id" component={OfferPayment} />
          <Route path="/" component={PaymentPackPayment} />
        </Switch>
      </ConsumerMenu>
    );
  }
}

export default withStyles(styles)(translate()(ConsumerHome));
