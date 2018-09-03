// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from 'react-i18next';
import { withRouter, Redirect, Switch, Route } from 'react-router-dom';

import { consumer as consumerActions } from '../actions';
import MyBookings from './consumer/MyBookings.component';
import MyPaymentPacks from './consumer/MyPaymentPacks.component';
import MyProfile from './consumer/MyProfile.component';
import OfferPayment from '../components/consumer/OfferPayment.component';
import PaymentPackPayment from '../components/consumer/PaymentPackPayment.component';

import { ConsumerMenu } from '../components';

type Props = {
  t: (x: string) => string,
  location: { pathname: string },
  authenticated: boolean,
  fetchBookings: () => void,
  fetchOptions: () => void,
  fetchConsumerPaymentPacks: () => void,
  fetchProfile: () => void,
};

export class ConsumerHome extends Component<Props> {
  componentWillMount() {
    const { t } = this.props;
    document.title = t('pageTitle.myAccount');
  }

  componentDidMount() {
    this.props.fetchBookings();
    this.props.fetchOptions();
    this.props.fetchConsumerPaymentPacks();
    this.props.fetchProfile();
  }

  render() {
    const { authenticated } = this.props;
    if (!authenticated) {
      return (
        <Redirect to={`/login/consumer?next=${this.props.location.pathname}`} />
      );
    }
    return (
      <ConsumerMenu>
        <Switch>
          <Route path="/(|consumer/)pass" component={MyPaymentPacks} />
          <Route path="/(|consumer/)profile" component={MyProfile} />
          <Route
            path="/(|consumer/)payment/offer/:id"
            component={OfferPayment}
          />
          <Route
            path="/(|consumer/)payment/pass/:id"
            component={PaymentPackPayment}
          />
          <Route path="/(|consumer)" component={MyBookings} />
        </Switch>
      </ConsumerMenu>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
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
    fetchProfile() {
      dispatch(consumerActions.fetchProfile());
    },
  };
}
export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(ConsumerHome)),
);
