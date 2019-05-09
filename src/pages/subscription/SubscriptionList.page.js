// @flow

import React, { Component } from 'react';
import moment from 'moment';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withDrawer from '../../hocs/with-drawer.hoc';

import api from '../../api';

import SubscriptionTable from './SubscriptionTable.component';
import type { Subscription } from './types';

api.subscription = {
  fetchAll: async () => ({
    data: [
      {
        id: 1,
        member: 10993,
        invoices: ['fjezofij-5767heziuf', 'joioi-IOH-h678'],
        billing_anchor: moment(),
        nb_interval: 6,
        interval: 'month',
        name: 'Pass 6 mois illimité',
        recurrent_price: 40.32,
      },
    ],
  }),
};

type Props = {
  members: Array<Member>,
};
type State = {
  subscriptions: Array<Subscription>,
};

export class SubscriptionList extends Component<Props, State> {
  state = {
    subscriptions: [],
  };

  componentDidMount() {
    api.subscription
      .fetchAll()
      .then((response) => this.setState({ subscriptions: response.data }))
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <SubscriptionTable
        members={this.props.members}
        subscriptions={this.state.subscriptions}
      />
    );
  }
}

export default compose(
  withNamespaces(['', 'subscription']),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.subscriptions')),
  connect((state) => ({ members: state.member.all })),
)(SubscriptionList);
