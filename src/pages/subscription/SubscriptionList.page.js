// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import withDrawer from '../../hocs/with-drawer.hoc';

import api from '../../libs/subscription/api';

import SubscriptionTable from '../../libs/subscription/SubscriptionTable.component';
import type { Subscription } from '../../libs/subscription/types';

type Props = {
  members: Array<Member>,
  goToSubscription: (id: number) => void,
};
type State = {
  subscriptions: Array<Subscription>,
  loading: boolean,
};

export class SubscriptionList extends Component<Props, State> {
  state = {
    subscriptions: [],
    loading: true,
  };

  componentDidMount() {
    api
      .fetchAll()
      .then((response) =>
        this.setState({ subscriptions: response.data, loading: false }),
      )
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <SubscriptionTable
        members={this.props.members}
        subscriptions={this.state.subscriptions}
        loading={this.state.loading}
        goToSubscription={this.props.goToSubscription}
      />
    );
  }
}

export default compose(
  withNamespaces(['', 'subscription']),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.subscriptions')),
  connect(
    (state) => ({ members: state.member.all }),
    (dispatch) => ({
      goToSubscription(id) {
        dispatch(pushRouter(`/subscription/${id}`));
      },
    }),
  ),
)(SubscriptionList);
