import React from 'react';
import uniq from 'lodash/uniq';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import type { RootState } from 'src/reducers';

import { getTheme } from '#src/libs/theme/selectors';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import ConsumerInvoicePageReworked from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoicePageReworked';
import ReLiftReduxProviderIfDetected from '#src/hocs/relift-redux-provider.hoc';
import {
  fetchConsumerUnpaidInvoices as fetchConsumerUnpaidInvoicesAction,
  fetchConsumerPaidInvoices as fetchConsumerPaidInvoicesAction,
  fetchConsumerRefundedInvoices as fetchConsumerRefundedInvoicesAction,
  fetchConsumerInvoicesComplementary as fetchConsumerInvoicesComplementaryAction,
  resetConsumerState as resetConsumerStateAction,
} from '#src/libs/consumer-space/actions';
import {
  fetchInvoiceList as fetchInvoiceListAction,
  fetchSpecificInvoice as fetchSpecificInvoiceAction,
} from '#src/libs/invoice/actions';
import { fetchMembership as fetchMembershipAction } from '#src/libs/membership/actions';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod as detachPaymentMethodAction,
} from '#src/libs/payment/actions';

import {
  getInvoiceComplementaryInformation,
  getInvoicesComplementaryLoading,
  getInvoicesLoading,
  getPaidInvoices,
  getPaidInvoicesCount,
  getPaidInvoicesLoading,
  getPaidInvoicesPage,
  getRefundedInvoices,
  getRefundedInvoicesCount,
  getRefundedInvoicesLoading,
  getRefundedInvoicesPage,
  getUnpaidInvoices,
  getUnpaidInvoicesCount,
  getUnpaidInvoicesLoading,
  getUnpaidInvoicesPage,
} from '#src/libs/consumer-space/selectors';
import { getInvoice } from '#src/libs/invoice/selectors';
import { getMarketplaceSettingsConfig } from '#src/libs/marketplace/selectors';

import type {
  ConsumerInvoice,
  ConsumerInvoiceREST,
} from '#src/libs/invoice/types';
import type { Membership } from '#src/libs/membership/types';
import type { WithHandlerType } from '#src/utils/types';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import withQueryParamsToProps from '#src/hocs/query-params-to-props.hoc';
import ConsumerInvoiceContextProvider from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceContext';
import { trackMemberProfileViewedEvent } from '#src/events/member-profile/trackers';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';

type OwnProps = {
  membership: Membership;
  // eslint-disable-next-line react/no-unused-prop-types
  companyId: number;
  push: (path: string) => void;
  /*
   * Additional actions for widget use case
   */
  fetchPaymentGroupStatusAction?: (
    paymentGroupId: number,
    options?: OptionCallback<number>,
  ) => void;
  setPaymentStatusActions?: (params: {
    paymentGroupId: number;
    paymentSucceeded?: boolean;
    paymentProcessing?: boolean;
  }) => void;
  getReceiptUrl?: (uuid: string, options?: OptionCallback<string>) => void;
};

type QueryParamsProps = {
  selectedInvoiceUuid: string | null;
};

type PropsWithConnector = OwnProps & ConnectedProps<typeof connector>;

type Props = PropsWithConnector &
  QueryParamsProps &
  WithHandlerType<typeof mapWithConsumerInvoiceReworkedHandlers>;

type State = { selectedFilter: InvoicesFiltersEnum };

class ConsumerInvoiceReworked extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { selectedFilter: InvoicesFiltersEnum.UNPAID };
  }

  componentDidMount() {
    this.props.fetchConsumerInvoices(this.state.selectedFilter);
    this.props.fetchPaymentMethodList();
    analyticsClientB2C.track(
      trackMemberProfileViewedEvent({ page_type: 'invoice' }),
    );
  }

  changeSelectedFilter = (selectedFilter: InvoicesFiltersEnum) => {
    this.setState(() => ({ selectedFilter }));
    this.props.fetchConsumerInvoices(selectedFilter);
  };

  refreshMembership = () =>
    !!this.props.membership?.id &&
    this.props.fetchMembership?.(this.props.membership.id);

  refreshConsumerInvoices = () => {
    this.props.resetConsumerState();
    this.props.fetchConsumerInvoices(this.state.selectedFilter);
    this.refreshMembership?.();
  };

  handleChangePage = (page?: number) => {
    this.props.fetchConsumerInvoices(this.state.selectedFilter, page);
  };

  getInvoiceRESTList = () => {
    switch (this.state.selectedFilter) {
      case InvoicesFiltersEnum.PAID:
        return this.props.paidInvoiceList;
      case InvoicesFiltersEnum.REFUNDED:
        return this.props.refundedInvoiceList;
      case InvoicesFiltersEnum.UNPAID:
      default:
        return this.props.unpaidInvoiceList;
    }
  };

  getInvoiceList = (): ConsumerInvoice[] => {
    const invoiceRESTList = this.getInvoiceRESTList();
    const invoiceList = invoiceRESTList?.map((consumerInvoiceREST) => ({
      ...consumerInvoiceREST,
      ...this.props.getInvoiceComplementary(consumerInvoiceREST.uuid),
    }));
    return invoiceList;
  };

  getIsLoading = () => {
    const commonIsLoading =
      this.props.loading || this.props.invoiceComplementaryLoading;
    switch (this.state.selectedFilter) {
      case InvoicesFiltersEnum.UNPAID:
        return this.props.unpaidInvoicesLoading || commonIsLoading;
      case InvoicesFiltersEnum.PAID:
        return this.props.paidInvoicesLoading || commonIsLoading;
      case InvoicesFiltersEnum.REFUNDED:
        return this.props.refundedInvoicesLoading || commonIsLoading;
    }
  };

  getCurrentPage = () => {
    switch (this.state.selectedFilter) {
      case InvoicesFiltersEnum.UNPAID:
        return this.props.paidInvoicesPage;
      case InvoicesFiltersEnum.PAID:
        return this.props.paidInvoicesPage;
      case InvoicesFiltersEnum.REFUNDED:
        return this.props.refundedInvoicesPage;
    }
  };

  getCurrentCount = () => {
    switch (this.state.selectedFilter) {
      case InvoicesFiltersEnum.UNPAID:
        return this.props.unpaidInvoicesCount;
      case InvoicesFiltersEnum.PAID:
        return this.props.paidInvoicesCount;
      case InvoicesFiltersEnum.REFUNDED:
        return this.props.refundedInvoicesCount;
    }
  };

  render() {
    return (
      <ConsumerInvoiceContextProvider
        detachPaymentMethod={this.props.detachPaymentMethod}
        fetchPaymentGroupStatusAction={this.props.fetchPaymentGroupStatusAction}
        getReceiptUrl={this.props.getReceiptUrl}
        setPaymentStatusActions={this.props.setPaymentStatusActions}
      >
        <ConsumerInvoicePageReworked
          changeSelectedFilter={this.changeSelectedFilter}
          consumerInvoices={this.getInvoiceList()}
          currentCount={this.getCurrentCount()}
          currentPage={this.getCurrentPage()}
          getInvoice={this.props.getInvoice}
          handleChangePage={this.handleChangePage}
          isLoading={this.getIsLoading()}
          isMultilocationEnabled={this.props.theme.enable_multi_localization}
          membership={this.props.membership}
          refreshConsumerInvoices={this.refreshConsumerInvoices}
          refreshMembership={this.refreshMembership}
          selectedFilter={this.state.selectedFilter}
          selectedInvoiceUuid={this.props.selectedInvoiceUuid}
          stripePaymentElementConfig={{
            isDefaultForRegion: this.props.theme.is_default_for_region,
            stripeId: this.props.theme.stripe_id,
          }}
          totalUnpaid={this.props.unpaidInvoicesCount}
        />
      </ConsumerInvoiceContextProvider>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    theme: getTheme(state),
    loading: getInvoicesLoading(state),
    invoiceComplementaryLoading: getInvoicesComplementaryLoading(state),
    paidInvoiceList: getPaidInvoices(state),
    paidInvoicesLoading: getPaidInvoicesLoading(state),
    paidInvoicesCount: getPaidInvoicesCount(state),
    paidInvoicesPage: getPaidInvoicesPage(state),
    refundedInvoiceList: getRefundedInvoices(state),
    refundedInvoicesLoading: getRefundedInvoicesLoading(state),
    refundedInvoicesCount: getRefundedInvoicesCount(state),
    refundedInvoicesPage: getRefundedInvoicesPage(state),
    unpaidInvoiceList: getUnpaidInvoices(state),
    unpaidInvoicesCount: getUnpaidInvoicesCount(state),
    unpaidInvoicesLoading: getUnpaidInvoicesLoading(state),
    unpaidInvoicesPage: getUnpaidInvoicesPage(state),
    detachPaymentMethodLoading:
      state.paymentBackend.detachPaymentMethod.loading,
    marketplaceSettingsConfig: getMarketplaceSettingsConfig(state),
    getInvoice: (uuid: string) => getInvoice(state, uuid),
    getInvoiceComplementary: (uuid: string) =>
      getInvoiceComplementaryInformation(state, uuid),
  }),
  {
    fetchConsumerInvoicesComplementary:
      fetchConsumerInvoicesComplementaryAction,
    fetchConsumerPaidInvoices: fetchConsumerPaidInvoicesAction,
    fetchConsumerRefundedInvoices: fetchConsumerRefundedInvoicesAction,
    fetchConsumerUnpaidInvoices: fetchConsumerUnpaidInvoicesAction,
    fetchInvoiceList: fetchInvoiceListAction,
    fetchMembership: fetchMembershipAction,
    fetchSpecificInvoice: fetchSpecificInvoiceAction,
    resetConsumerState: resetConsumerStateAction,
    detachPaymentMethodAction,
    fetchPaymentMethodListAction,
  },
);

export const mapWithConsumerInvoiceReworkedHandlers = {
  fetchConsumerInvoices:
    (props: PropsWithConnector) =>
    (filter: InvoicesFiltersEnum, page?: number) => {
      const onSuccess = (
        paginatedResponse: PaginatedResponse<ConsumerInvoiceREST>,
      ) => {
        const consumerInvoicesREST = paginatedResponse.results;
        if (consumerInvoicesREST?.length > 0) {
          const reverseInvoiceUuids = uniq(
            consumerInvoicesREST.reduce<string[]>(
              (acc, consumerInvoice) => [
                ...acc,
                ...consumerInvoice.reverse_invoices,
              ],
              [],
            ),
          );
          reverseInvoiceUuids?.length > 0 &&
            props.fetchInvoiceList({ uuid__in: reverseInvoiceUuids });
          props.fetchConsumerInvoicesComplementary({
            uuid__in: consumerInvoicesREST.map(
              (consumerInvoice) => consumerInvoice.uuid,
            ),
          });
        }
      };

      const params = {
        page: page || 1,
        company_id: props.companyId,
      };

      switch (filter) {
        case InvoicesFiltersEnum.UNPAID:
        default:
          props.fetchConsumerUnpaidInvoices(params, { onSuccess });
          break;
        case InvoicesFiltersEnum.PAID:
          props.fetchConsumerPaidInvoices(params, { onSuccess });
          break;
        case InvoicesFiltersEnum.REFUNDED:
          props.fetchConsumerRefundedInvoices(params, { onSuccess });
          break;
      }
    },
  fetchPaymentMethodList: (props: PropsWithConnector) => () =>
    props.fetchPaymentMethodListAction({
      company: props.companyId ?? props.membership?.company,
    }),
  detachPaymentMethod:
    (props: PropsWithConnector) =>
    (paymentMethodId: string, options?: OptionCallback) => {
      props.detachPaymentMethodAction(
        {
          company: props.companyId ?? props.membership?.company,
          payment_method_id: paymentMethodId,
        },
        {
          onSuccess: () => {
            props.fetchPaymentMethodListAction({
              company: props.companyId ?? props.membership?.company,
            });
            options?.onSuccess?.();
          },
        },
      );
    },
};

export const UnconnectedConsumerInvoiceReworked = compose(
  ReLiftReduxProviderIfDetected(),
  marketplaceCssHoc(),
  WithCustomCssProvider,
)(ConsumerInvoiceReworked);

export default compose(
  ReLiftReduxProviderIfDetected(),
  connector,
  withHandlers(mapWithConsumerInvoiceReworkedHandlers),
  withQueryParamsToProps(['selectedInvoiceUuid']),
)(UnconnectedConsumerInvoiceReworked);
