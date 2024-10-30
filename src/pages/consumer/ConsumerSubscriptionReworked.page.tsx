import React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import type { RouteComponentProps } from 'react-router-dom';
import { BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB } from '@bsport/common/lib/master-data/subscription-payment-methods';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import {
  getMyActiveSubscriptionsState,
  getMyActiveSubscriptionsList,
  getMyFutureSubscriptionsState,
  getMyFutureSubscriptionsList,
  getMyExpiredSubscriptionsState,
  getMyExpiredSubscriptionsList,
  getMySubscriptionsInvoicesDetailsState,
} from '#src/libs/consumer-space/selectors';
import { getMarketplaceSettingsConfig } from '#src/libs/marketplace/selectors';

import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod as detachPaymentMethodAction,
} from '#src/libs/payment/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';

import { getSavedPaymentMethodList } from '#src/libs/payment/selectors';
import {
  fetchConsumerSubscriptionInvoicesDetails as fetchConsumerSubscriptionInvoicesDetailsAction,
  fetchMySubscriptionAsMember as fetchMySubscriptionAsMemberAction,
  fetchMyActiveSubscriptionsAsMember as fetchMyActiveSubscriptionsAsMemberAction,
  fetchMyExpiredSubscriptionsAsMember as fetchMyExpiredSubscriptionsAsMemberAction,
  fetchMyFutureSubscriptionsAsMember as fetchMyFutureSubscriptionsAsMemberAction,
} from '#src/libs/consumer-space/actions/subscription-actions';

import type { Membership } from '#src/libs/membership/types';
import type { SubscriptionREST } from '#src/libs/subscription/types';
import type { PaymentMethod } from '#src/libs/payment/types';

import ConsumerSubscriptionPageReworked from '#src/libs/consumer-space/components/reworked/@MySubscriptions/ConsumerSubscriptionPageReworked';

import {
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction,
  downloadPDFContractTermsForBillingPlan as downloadPDFContractTermsForBillingPlanAction,
} from '#src/libs/subscription/actions';
import { fetchInvoiceConfigurationAsMember as fetchInvoiceConfigurationAsMemberAction } from '#src/libs/invoice/actions';
import {
  urlToMarketplaceSessionTab,
  urlToMarketplaceSubscriptionTab,
} from '#src/libs/marketplace/utils/navigation';
import { getTheme } from '#src/libs/theme/selectors';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import type { SubscriptionFilter } from '#src/libs/consumer-space/components/reworked/@MySubscriptions/types';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';
import { ConsumerSpaceContextEnum } from '#src/libs/consumer-space/constants';

type OwnProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  membership: Membership;
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: number;
  push: (path: string) => void;
};

type Props = OwnAndConnectedAndRouteProps &
  WithHandlerType<typeof consumerSubscriptionMapWithHandlers>;

type OwnAndConnectedAndRouteProps = OwnProps &
  ConnectedProps<typeof connector> &
  RouteComponentProps<{ companyId: string }>;

export class ConsumerSubscription extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchActiveSubscriptionsList();
    this.props.fetchFutureSubscriptionsList();
    this.props.fetchExpiredSubscriptionsList();
    this.props.fetchInvoiceConfiguration();
    this.props.fetchPaymentMethodList();
  }

  handleBookASessionClick = () => {
    const marketplaceTabPath = urlToMarketplaceSessionTab(
      this.props.marketplaceSettingsConfig,
      this.props.companyTheme.company_name,
      this.props.companyTheme.company.toString(),
    );

    this.props.push(marketplaceTabPath);
  };

  handleGetASubscription = () => {
    const marketplaceTabPath = urlToMarketplaceSubscriptionTab(
      this.props.marketplaceSettingsConfig,
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
      paymentMethodList,
      fetchConsumerSubscriptionInvoicesDetails,
      subscriptionsInvoicesDetailsState,
      invoiceConfiguration,
      downloadPDFContractTermsForBillingPlan,
      companyTheme,
      requestSetupIntentSecret,
      detachPaymentMethod,
      switchPaymentMethod,
      fetchPaymentMethodList,
      paymentMethodLoading,
      auth,
    } = this.props;

    return (
      <ConsumerSubscriptionPageReworked
        activeSubscriptionsList={activeSubscriptionsList}
        activeSubscriptionsState={activeSubscriptionsState}
        detachPaymentMethod={detachPaymentMethod}
        downloadBillingPlanTermsAction={downloadPDFContractTermsForBillingPlan}
        enabledPaymentGroupMethodIdentifierIds={
          companyTheme.payment_method_available_subscription
        }
        expiredSubscriptionsList={expiredSubscriptionsList}
        expiredSubscriptionsState={expiredSubscriptionsState}
        fetchActiveSubscriptionsList={fetchActiveSubscriptionsList}
        fetchConsumerSubscriptionInvoicesDetails={
          fetchConsumerSubscriptionInvoicesDetails
        }
        fetchExpiredSubscriptionsList={fetchExpiredSubscriptionsList}
        fetchFutureSubscriptionsList={fetchFutureSubscriptionsList}
        futureSubscriptionsList={futureSubscriptionsList}
        futureSubscriptionsState={futureSubscriptionsState}
        invoiceRetryNumber={
          invoiceConfiguration?.nb_retries_subscription_payments
        }
        memberMail={auth.username}
        memberName={auth.name}
        onBookSessionClick={this.handleBookASessionClick}
        onGetASubscriptionClick={this.handleGetASubscription}
        paymentMethodList={paymentMethodList as PaymentMethod[]}
        paymentMethodLoading={paymentMethodLoading}
        refreshSavedPaymentMethodList={fetchPaymentMethodList}
        requestSetupIntentSecret={requestSetupIntentSecret}
        subscriptionsInvoicesDetailsState={subscriptionsInvoicesDetailsState}
        switchPaymentMethod={switchPaymentMethod}
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
    subscriptionsInvoicesDetailsState:
      getMySubscriptionsInvoicesDetailsState(state),
    invoiceConfiguration: state.invoice.configuration.result,
    companyTheme: getTheme(state),
    marketplaceSettingsConfig: getMarketplaceSettingsConfig(state),
    paymentMethodLoading: state.paymentBackend.paymentMethod.loading,
    auth: state.auth,
  }),
  {
    fetchPaymentMethodListAction,
    fetchMyFutureSubscriptionsAsMemberAction,
    fetchMyExpiredSubscriptionsAsMemberAction,
    fetchMyActiveSubscriptionsAsMemberAction,
    fetchConsumerSubscriptionInvoicesDetails:
      fetchConsumerSubscriptionInvoicesDetailsAction,
    fetchInvoiceConfigurationAsMemberAction,
    downloadPDFContractTermsForBillingPlan:
      downloadPDFContractTermsForBillingPlanAction,
    switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
    detachPaymentMethodAction,
    fetchMySubscriptionAsMemberAction,
  },
);

export const consumerSubscriptionMapWithHandlers = {
  fetchActiveSubscriptionsList:
    (props: OwnAndConnectedAndRouteProps) =>
    (
      page?: number,
      page_size?: number,
      options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
    ) => {
      props.membership?.id &&
        props.fetchMyActiveSubscriptionsAsMemberAction(
          {
            member: props.membership?.id,
            ...(page_size && { page_size }),
          },
          options,
        );
    },
  fetchFutureSubscriptionsList:
    (props: OwnAndConnectedAndRouteProps) =>
    (
      page?: number,
      page_size?: number,
      options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
    ) =>
      props.membership?.id &&
      props.fetchMyFutureSubscriptionsAsMemberAction(
        {
          member: props.membership?.id,
          ...(page_size && { page_size }),
        },
        options,
      ),
  fetchExpiredSubscriptionsList:
    (props: OwnAndConnectedAndRouteProps) =>
    (
      page?: number,
      page_size?: number,
      options?: OptionCallback<PaginatedResponse<SubscriptionREST>>,
    ) =>
      props.membership?.id &&
      props.fetchMyExpiredSubscriptionsAsMemberAction(
        {
          member: props.membership?.id,
          ...(page_size && { page_size }),
        },
        options,
      ),
  fetchPaymentMethodList: (props: OwnAndConnectedAndRouteProps) => () =>
    props.fetchPaymentMethodListAction({
      company: props.companyId ?? props.membership?.company,
    }),
  fetchInvoiceConfiguration: (props: OwnAndConnectedAndRouteProps) => () =>
    props.fetchInvoiceConfigurationAsMemberAction(
      (props.companyId ?? props.membership?.company).toString(),
    ),
  requestSetupIntentSecret: (props: OwnAndConnectedAndRouteProps) => () =>
    requestSetupIntentSecretAPI(
      props.membership?.id,
      props.companyId ?? props.membership?.company,
    ),
  switchPaymentMethod:
    (props: OwnAndConnectedAndRouteProps) =>
    (
      subscriptionId: number,
      payment_method_id: string,
      status: SubscriptionFilter,
      options?: OptionCallback,
    ) => {
      props.switchSubscriptionPaymentMethod(
        {
          id: subscriptionId,
          payment_method_id,
          payment_method_identifier: BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
        },
        {
          onSuccess: (sub) => {
            if (
              WidgetUtils.getConsumerSpaceContext() ===
              ConsumerSpaceContextEnum.WIDGET
            ) {
              switch (status) {
                case 'active':
                  props.fetchMyActiveSubscriptionsAsMemberAction({
                    member: props.membership?.id,
                  });
                  break;
                case 'future':
                  props.fetchMyFutureSubscriptionsAsMemberAction({
                    member: props.membership?.id,
                  });
                  break;
                case 'expired':
                  props.fetchMyExpiredSubscriptionsAsMemberAction({
                    member: props.membership?.id,
                  });
                  break;
              }
            } else {
              props.fetchMySubscriptionAsMemberAction({
                id: subscriptionId,
                member: props.membership?.id,
                status,
              });
            }
            // @ts-expect-error
            options?.onSuccess?.(sub);
          },
          onError: options?.onError,
        },
      );
    },
  detachPaymentMethod:
    (props: OwnAndConnectedAndRouteProps) =>
    (pm_id: string, options?: OptionCallback) => {
      props.detachPaymentMethodAction(
        {
          company: props.companyId ?? props.membership?.company,
          payment_method_id: pm_id,
        },
        {
          onSuccess: () => {
            props.fetchPaymentMethodListAction({
              company: props.companyId ?? props.membership?.company,
            });
            options?.onSuccess?.();
          },
          onError: options?.onError,
        },
      );
    },
};

export const UnconnectedConsumerSubscription = compose(
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerSubscription);

export default compose(
  connector,
  withHandlers(consumerSubscriptionMapWithHandlers),
)(UnconnectedConsumerSubscription);
