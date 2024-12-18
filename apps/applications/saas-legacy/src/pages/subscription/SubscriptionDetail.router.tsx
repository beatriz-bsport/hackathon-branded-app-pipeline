import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get as getSubscriptionById } from '#src/libs/subscription/selectors';
import { fetch as fetchSubscription } from '../../libs/subscription/actions';
// @ts-expect-error
import SubscriptionDetailDEPRECATED from './SubscriptionDetailDEPRECATED.page';
import SubscriptionDetail from './SubscriptionDetail.page';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import { Subscription } from '../../libs/subscription/types';

type Props = {
  id: number;
  subscription?: Subscription;
  fetchSubscription: (id: number) => void;
};

export class SubscriptionDetailRouter extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchSubscription(this.props.id);
  }

  render() {
    if (!this.props.subscription) {
      return <BackofficeLinearProgress />;
    }
    if (this.props.subscription.is_v2) {
      // @ts-expect-error
      return <SubscriptionDetail id={this.props.id} />;
    }
    return <SubscriptionDetailDEPRECATED id={this.props.id} />;
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    // @ts-expect-error
    (state, { id }) => ({
      // @ts-expect-error
      subscription: getSubscriptionById(state, id),
    }),
    {
      fetchSubscription,
    },
  ),
)(SubscriptionDetailRouter);
