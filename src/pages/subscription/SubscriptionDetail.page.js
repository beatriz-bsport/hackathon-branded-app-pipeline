// @flow

import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import subscriptionSelectors from './selectors';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetch as fetchSubscription } from './actions';
import SubscriptionComponent from './Subscription.component';

import type { Subscription } from './types';

type Props = {
  id: number,
  subscription: Subscription,
  loading: boolean,
  fetch: (id: number) => void,
};

export class SubscriptionDetail extends Component<Props> {
  componentWillMount() {
    this.props.fetch(this.props.id);
  }

  render() {
    const { loading, subscription } = this.props;
    return (
      <div>
        {loading ? <LinearProgress /> : null}
        <SubscriptionComponent subscription={subscription} />
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
    },
  ),
)(SubscriptionDetail);
