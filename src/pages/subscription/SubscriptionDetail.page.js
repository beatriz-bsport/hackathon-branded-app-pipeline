// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push as pushRouter } from 'react-router-redux';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withDrawer from '../../hocs/with-drawer.hoc';

import {
  fetch as fetchSubscription,
  stop as stopSubscription,
} from '../../libs/subscription/actions';
import subscriptionSelectors from '../../libs/subscription/selectors';
import SubscriptionComponent from '../../libs/subscription/Subscription.component';
import type { Subscription } from '../../libs/subscription/types';

type Props = {
  id: number,
  loading: boolean,

  subscription: Subscription,

  fetch: (id: number) => void,
  stop: (id: number) => void,
  goToInvoice: (uuid: string) => void,
  goToMember: (id: number) => void,
  goToSubscribe: (id: number) => void,
};

export class SubscriptionDetail extends Component<Props> {
  componentWillMount() {
    this.props.fetch(this.props.id);
  }

  render() {
    const {
      loading,
      subscription,
      stop,
      goToInvoice,
      goToMember,
      goToSubscribe,
    } = this.props;
    return (
      <div>
        {loading ? <LinearProgress /> : null}
        <SubscriptionComponent
          subscription={subscription}
          stopSubscription={stop}
          goToInvoice={goToInvoice}
          goToMember={goToMember}
          goToSubscribe={goToSubscribe}
        />
      </div>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      subscription: subscriptionSelectors.get(state, id),
      loading: state.subscription.loading,
    }),
    {
      fetch: fetchSubscription,
      stop: stopSubscription,
      goToInvoice: (uuid: string) => pushRouter(`/invoice/${uuid}`),
      goToMember: (id: number) => pushRouter(`/member/${id}/`),
      goToSubscribe: (id: number) => pushRouter(`/subscription/add/${id}`),
    },
  ),
  withDrawer(({ subscription }) => (subscription ? subscription.name : '')),
)(SubscriptionDetail);
