// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from 'react-i18next';
import { Redirect, Switch, Route } from 'react-router-dom';

import { consumer as consumerActions } from '../actions';
import parse from '../query-string';
import MyBookings from './consumer/MyBookings.component';
import MyPaymentPacks from './consumer/MyPaymentPacks.component';
import MyProfile from './consumer/MyProfile.component';
import OfferPaymentPage from './consumer/payment/OfferPaymentPage.component';
import PaymentPackPaymentPage from './consumer/payment/PaymentPackPaymentPage.component';

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
      const { membership } = parse(this.props.location.search) || 0;
      return (
        <Redirect
          to={`/login/customer?next=${
            this.props.location.pathname
          }&membership=${membership}`}
        />
      );
    }
    return (
      <ConsumerMenu>
        <Switch>
          <Route path="/(|customer/)pass" component={MyPaymentPacks} />
          <Route path="/(|customer/)profile" component={MyProfile} />
          <Route
            path="/(|customer/)payment/offer/:id"
            component={OfferPaymentPage}
          />
          <Route
            path="/(|customer/)payment/pass/:id"
            component={PaymentPackPaymentPage}
          />
          <Route path="/(|customer)" component={MyBookings} />
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
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ConsumerHome),
);
