// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';

import { consumer as consumerActions } from '../../actions';
import asyncComponent from '../../AsyncComponent';

const MyProfile = asyncComponent(() => import('./MyProfile.component'));

const ConsumerHome = asyncComponent(() =>
  import('./my-bookings/MyBookings.page'),
);
const MyPaymentPacks = asyncComponent(() =>
  import('./MyPaymentPacks.component'),
);
const MyOrders = asyncComponent(() => import('./MyOrders.page'));

type Props = {
  t: (x: string) => string,
  location: { pathname: string, search: Object },
  authenticated: boolean,
  fetchBookings: () => void,
  fetchOptions: () => void,
  fetchConsumerPaymentPacks: () => void,
  fetchProfile: () => void,
};

export class ConsumerRouter extends Component<Props> {
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
    return (
      <Switch>
        <Route path="/(|customer/)order" component={MyOrders} />
        <Route path="/(|customer/)pass" component={MyPaymentPacks} />
        <Route path="/(|customer/)profile" component={MyProfile} />
        <Route path="/(|customer)" component={ConsumerHome} />
      </Switch>
    );
  }
}

export default compose(
  withNamespaces(),
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
  ),
)(ConsumerRouter);
