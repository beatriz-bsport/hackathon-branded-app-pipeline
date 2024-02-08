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
import { downloadPDFContractTermsForBillingPlan as downloadPDFContractTermsForBillingPlanAction } from '#libs/subscription/actions';
import {
  urlToMarketplaceSessionTab,
  urlToMarketplaceSubscriptionTab,
} from '#libs/marketplace/utils/navigation';
import { getTheme } from '#libs/theme/selectors';
import WidgetUtils from '#libs/widget/WidgetUtils';

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

  handleBookASessionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSessionTab(
      this.props.marketplaceSettings?.config,
      this.props.companyTheme.company_name,
      this.props.companyTheme.company.toString(),
    );

    this.props.push(marketplaceTabPath);
  };

  handleGetASubscription = () => {
    const marketplaceTabPath = urlToMarketplaceSubscriptionTab(
      this.props.marketplaceSettings?.config,
      this.props.companyTheme.company_name,
      this.props.companyTheme.company.toString(),
    );
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      this.props.push(marketplaceTabPath);
    }
  };

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
      downloadPDFContractTermsForBillingPlan,
    } = this.props;

    return (
      <ConsumerSubscriptionPageReworked
        activeSubscriptionsList={activeSubscriptionsList}
        activeSubscriptionsState={activeSubscriptionsState}
        downloadBillingPlanTermsAction={downloadPDFContractTermsForBillingPlan}
        expiredSubscriptionsList={expiredSubscriptionsList}
        expiredSubscriptionsState={expiredSubscriptionsState}
        fetchActiveSubscriptionsList={fetchActiveSubscriptionsList}
        fetchExpiredSubscriptionsList={fetchExpiredSubscriptionsList}
        fetchFutureSubscriptionsList={fetchFutureSubscriptionsList}
        futureSubscriptionsList={futureSubscriptionsList}
        futureSubscriptionsState={futureSubscriptionsState}
        onBookSessionClick={this.handleBookASessionClick}
        onGetASubscriptionClick={this.handleGetASubscription}
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
    companyTheme: getTheme(state),
    marketplaceSettings: state.marketplace.settings,
  }),
  {
    fetchPaymentMethodListAction,
    fetchMyFutureSubscriptionsAsMemberAction,
    fetchMyExpiredSubscriptionsAsMemberAction,
    fetchMyActiveSubscriptionsAsMemberAction,
    resetConsumerSubscriptionsState: resetConsumerSubscriptionsStateAction,
    downloadPDFContractTermsForBillingPlan:
      downloadPDFContractTermsForBillingPlanAction,
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
