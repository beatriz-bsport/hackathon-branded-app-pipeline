import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { get as getSubscriptionById } from '../../libs/subscription/selectors';
import { fetch as fetchSubscription } from '../../libs/subscription/actions';
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
      return <SubscriptionDetail id={this.props.id} />;
    }
    return <SubscriptionDetailDEPRECATED id={this.props.id} />;
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      subscription: getSubscriptionById(state, id),
    }),
    {
      fetchSubscription,
    },
  ),
)(SubscriptionDetailRouter);
