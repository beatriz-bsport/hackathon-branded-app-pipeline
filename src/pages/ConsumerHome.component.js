import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';

import { consumer as consumerActions } from '../actions';
import MyBookings from './consumer/MyBookings.component';
import MyPaymentPacks from './consumer/MyPaymentPacks.component';
import MyProfile from './consumer/MyProfile.component';
import OfferPayment from '../components/consumer/OfferPayment.component';
import PaymentPackPayment from '../components/consumer/PaymentPackPayment.component';

import { ConsumerMenu } from '../components';

const styles = () => ({
  container: {},
});

type Props = {};

export class ConsumerHome extends Component<Props> {
  componentWillMount() {
    const { t } = this.props;
    document.title = t('pageTitle.myAccount');
  }

  componentDidMount() {
    this.props.fetchBookings();
    this.props.fetchOptions();
    this.props.fetchConsumerPaymentPacks();
  }

  render() {
    return (
      <ConsumerMenu>
        <Switch>
          <Route path="/pass" component={MyPaymentPacks} />
          <Route path="/profile" component={MyProfile} />
          <Route path="/payment/offer/:id" component={OfferPayment} />
          <Route path="/payment/pass/:id" component={PaymentPackPayment} />
          <Route path="/" component={MyBookings} />
        </Switch>
      </ConsumerMenu>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBookings() {
      dispatch(consumerActions.fetchBookings());
    },
    fetchOptions() {
      dispatch(consumerActions.fetchOptions());
    },
    fetchConsumerPaymentPacks() {
      dispatch(consumerActions.fetchConsumerPaymentPacks());
    },
  };
}
export default withStyles(styles)(
  translate()(connect(null, mapDispatchToProps)(ConsumerHome)),
);
