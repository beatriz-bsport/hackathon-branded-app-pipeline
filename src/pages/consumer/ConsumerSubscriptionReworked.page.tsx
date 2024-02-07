import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import type { RouteComponentProps } from 'react-router-dom';
import type { WithHandlerType } from '../../utils/types';
import type { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

import {
  getMyActiveSubscriptionsState,
  getMyActiveSubscriptionsList,
  getMyFutureSubscriptionsState,
  getMyFutureSubscriptionsList,
  getMyExpiredSubscriptionsState,
  getMyExpiredSubscriptionsList,
} from '#libs/consumer-space/selectors';

import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '#libs/payment/actions';
import { getSavedPaymentMethodList } from '#libs/payment/selectors';
import {
  fetchMyExpiredSubscriptionsAsMember as fetchMyExpiredSubscriptionsAsMemberAction,
  fetchMyFutureSubscriptionsAsMember as fetchMyFutureSubscriptionsAsMemberAction,
  fetchMyActiveSubscriptionsAsMember as fetchMyActiveSubscriptionsAsMemberAction,
  resetConsumerSubscriptionsState as resetConsumerSubscriptionsStateAction,
} from '#libs/consumer-space/actions/subscription-actions';

import type { Membership } from '#libs/membership/types';
import type { SubscriptionREST } from '#libs/subscription/types';
import type { PaymentMethod } from '#libs/payment/types';

import ConsumerSubscriptionPageReworked from '#libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionPageReworked';

type OwnProps = {
  membership: Membership;
  companyId: number;
  push: (path: string) => void;
};

type Props = OwnAndConnectedAndRouteProps &
  WithHandlerType<typeof mapWithHandlers>;

type OwnAndConnectedAndRouteProps = OwnProps &
  ConnectedProps<typeof connector> &
  RouteComponentProps<{ companyId: string }>;

export class ConsumerSubscription extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchActiveSubscriptionsList();
    this.props.fetchFutureSubscriptionsList();
    this.props.fetchExpiredSubscriptionsList();
    this.props.fetchPaymentMethodList();
  }

  render() {
    const {
      activeSubscriptionsState,
      activeSubscriptionsList,
      futureSubscriptionsState,
      futureSubscriptionsList,
      expiredSubscriptionsState,
      expiredSubscriptionsList,
      fetchActiveSubscriptionsList,
      fetchFutureSubscriptionsList,
      fetchExpiredSubscriptionsList,
      resetConsumerSubscriptionsState,
      paymentMethodList,
    } = this.props;

    return (
      <ConsumerSubscriptionPageReworked
        activeSubscriptionsList={activeSubscriptionsList}
        activeSubscriptionsState={activeSubscriptionsState}
        expiredSubscriptionsList={expiredSubscriptionsList}
        expiredSubscriptionsState={expiredSubscriptionsState}
        fetchActiveSubscriptionsList={fetchActiveSubscriptionsList}
        fetchExpiredSubscriptionsList={fetchExpiredSubscriptionsList}
        fetchFutureSubscriptionsList={fetchFutureSubscriptionsList}
        futureSubscriptionsList={futureSubscriptionsList}
        futureSubscriptionsState={futureSubscriptionsState}
        // TODO
        onBookSessionClick={() => {}}
        onGetASubscriptionClick={() => {}}
        paymentMethodList={paymentMethodList as PaymentMethod[]}
        resetConsumerSubscriptionsState={resetConsumerSubscriptionsState}
      />
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    activeSubscriptionsState: getMyActiveSubscriptionsState(state),
    activeSubscriptionsList: getMyActiveSubscriptionsList(state),
    futureSubscriptionsState: getMyFutureSubscriptionsState(state),
    futureSubscriptionsList: getMyFutureSubscriptionsList(state),
    expiredSubscriptionsState: getMyExpiredSubscriptionsState(state),
    expiredSubscriptionsList: getMyExpiredSubscriptionsList(state),
    paymentMethodList: getSavedPaymentMethodList(state),
  }),
  {
    fetchPaymentMethodListAction,
    fetchMyFutureSubscriptionsAsMemberAction,
    fetchMyExpiredSubscriptionsAsMemberAction,
    fetchMyActiveSubscriptionsAsMemberAction,
    resetConsumerSubscriptionsState: resetConsumerSubscriptionsStateAction,
  },
);

const mapWithHandlers = {
  fetchActiveSubscriptionsList:
    (props: OwnAndConnectedAndRouteProps) =>
    (page_size?: number, options?: OptionCallback<SubscriptionREST[]>) =>
      props.fetchMyActiveSubscriptionsAsMemberAction(
        {
          member: props.membership.id,
          ...(page_size && { page_size }),
        },
        options,
      ),
  fetchFutureSubscriptionsList:
    (props: OwnAndConnectedAndRouteProps) =>
    (page_size?: number, options?: OptionCallback<SubscriptionREST[]>) =>
      props.fetchMyFutureSubscriptionsAsMemberAction(
        {
          member: props.membership.id,
          ...(page_size && { page_size }),
        },
        options,
      ),
  fetchExpiredSubscriptionsList:
    (props: OwnAndConnectedAndRouteProps) =>
    (page_size?: number, options?: OptionCallback<SubscriptionREST[]>) =>
      props.fetchMyExpiredSubscriptionsAsMemberAction(
        {
          member: props.membership.id,
          ...(page_size && { page_size }),
        },
        options,
      ),
  fetchPaymentMethodList: (props: OwnAndConnectedAndRouteProps) => () =>
    props.fetchPaymentMethodListAction({ company: props.membership.company }),
};

export default compose(
  connector,
  withHandlers(mapWithHandlers),
  marketplaceCssHoc(),
)(ConsumerSubscription);
