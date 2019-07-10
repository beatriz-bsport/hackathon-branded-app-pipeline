// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withNamespaces } from 'react-i18next';
import { Redirect, Switch, Route } from 'react-router-dom';
import parse from '../query-string';

import { consumer as consumerActions } from '../actions';
import MyBookings from './consumer/my-bookings/MyBookings.page';
import MyPaymentPacks from './consumer/MyPaymentPacks.component';
import MyOrders from './consumer/MyOrders.page';
import MyProfile from './consumer/MyProfile.component';
import OfferPaymentPage from './payment/OfferPayment.page';
import PaymentPackPaymentPage from './payment/PaymentPackPayment.page';
import OrderPaymentPage from './payment/OrderPayment.page';

import ConsumerMenu from '../components/navigation/ConsumerMenu.component';

type Props = {
  t: (x: string) => string,
  location: { pathname: string, search: Object },
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

  fetchConsumerData = () => {
    this.props.fetchBookings();
    this.props.fetchOptions();
    this.props.fetchConsumerPaymentPacks();
    this.props.fetchProfile();
  };

  componentDidMount() {
    if (this.props.authenticated) {
      this.fetchConsumerData();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.authenticated && this.props.authenticated) {
      this.fetchConsumerData();
    }
  }

  render() {
    const { authenticated } = this.props;
    if (!authenticated) {
      const { pathname } = this.props.location;
      const { membership } = parse(this.props.location.search);
      return (
        <Redirect
          to={`/login/customer?next=${encodeURIComponent(
            pathname,
          )}&membership=${membership}`}
        />
      );
    }
    return (
      <ConsumerMenu>
        <Switch>
          <Route path="/(|customer/)order" component={MyOrders} />
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
          <Route
            path="/(|customer/)payment/order/:companyId/"
            component={OrderPaymentPage}
          />
          <Route path="/(|customer)" component={MyBookings} />
        </Switch>
      </ConsumerMenu>
    );
  }
}

export default withNamespaces()(
  connect(
    (state) => ({
      authenticated: state.auth.authenticated,
    }),
    {
      fetchBookings: consumerActions.fetchBookings,
      fetchOptions: consumerActions.fetchOptions,
      fetchConsumerPaymentPacks: consumerActions.fetchConsumerPaymentPacks,
      fetchProfile: consumerActions.fetchProfile,
    },
  )(ConsumerHome),
);
