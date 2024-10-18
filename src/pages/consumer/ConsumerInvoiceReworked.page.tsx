import React from 'react';
import uniq from 'lodash/uniq';
import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import type { RootState } from 'src/reducers';

import { getTheme } from '#src/libs/theme/selectors';
import { InvoicesFiltersEnum } from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoiceFilters';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import WithCustomCssProvider from '#src/hocs/company-custom-css.hoc';
import { urlToMarketplaceSessionTab } from '#src/libs/marketplace/utils/navigation';
import ConsumerInvoicePageReworked from '#src/libs/consumer-space/components/reworked/@MyInvoices/ConsumerInvoicePageReworked';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
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
  getInvoicesLoading,
  getPaidInvoices,
  getPaidInvoicesLoading,
  getPaidInvoicesNextPage,
  getRefundedInvoices,
  getRefundedInvoicesLoading,
  getRefundedInvoicesNextPage,
  getUnpaidInvoices,
  getUnpaidInvoicesCount,
  getUnpaidInvoicesLoading,
  getUnpaidInvoicesNextPage,
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

  fetchConsumerInvoicesNextPage = () => {
    const nextPage = this.getInvoiceNextPage(this.state.selectedFilter);
    nextPage &&
      this.props.fetchConsumerInvoices(this.state.selectedFilter, nextPage);
  };

  goToBookSession = () => {
    if (WidgetUtils.isWidget()) {
      WidgetUtils.closeModal();
      window?.close();
    } else {
      const marketplaceTabPath = urlToMarketplaceSessionTab(
        this.props.marketplaceSettingsConfig,
        this.props.theme.company_name,
        this.props.theme.company.toString(),
      );
      this.props.push(marketplaceTabPath);
    }
  };

  getInvoiceRESTList = (selectedFilter: InvoicesFiltersEnum) => {
    switch (selectedFilter) {
      case InvoicesFiltersEnum.PAID:
        return this.props.paidInvoiceList;
      case InvoicesFiltersEnum.REFUNDED:
        return this.props.refundedInvoiceList;
      case InvoicesFiltersEnum.UNPAID:
      default:
        return this.props.unpaidInvoiceList;
    }
  };

  getInvoiceList = (selectedFilter: InvoicesFiltersEnum): ConsumerInvoice[] => {
    const invoiceRESTList = this.getInvoiceRESTList(selectedFilter);
    const invoiceList = invoiceRESTList?.map((consumerInvoiceREST) => ({
      ...consumerInvoiceREST,
      ...this.props.getInvoiceComplementary(consumerInvoiceREST.uuid),
    }));
    return invoiceList;
  };

  getInvoiceLoading = (selectedFilter: InvoicesFiltersEnum) => {
    switch (selectedFilter) {
      case InvoicesFiltersEnum.UNPAID:
      default:
        return this.props.unpaidInvoicesLoading;
      case InvoicesFiltersEnum.PAID:
        return this.props.paidInvoicesLoading;
      case InvoicesFiltersEnum.REFUNDED:
        return this.props.refundedInvoicesLoading;
    }
  };

  getInvoiceNextPage = (selectedFilter: InvoicesFiltersEnum) => {
    switch (selectedFilter) {
      case InvoicesFiltersEnum.UNPAID:
      default:
        return this.props.unpaidInvoicesNextPage;
      case InvoicesFiltersEnum.PAID:
        return this.props.paidInvoicesNextPage;
      case InvoicesFiltersEnum.REFUNDED:
        return this.props.refundedInvoicesNextPage;
    }
  };

  render() {
    const invoiceList = this.getInvoiceList(this.state.selectedFilter);
    const invoiceLoading = this.getInvoiceLoading(this.state.selectedFilter);
    const hasMoreInvoicesToFetch = !!this.getInvoiceNextPage(
      this.state.selectedFilter,
    );

    return (
      <ConsumerInvoiceContextProvider
        fetchPaymentGroupStatusAction={this.props.fetchPaymentGroupStatusAction}
        setPaymentStatusActions={this.props.setPaymentStatusActions}
      >
        <ConsumerInvoicePageReworked
          changeSelectedFilter={this.changeSelectedFilter}
          consumerInvoices={invoiceList}
          fetchMoreInvoices={this.fetchConsumerInvoicesNextPage}
          getInvoice={this.props.getInvoice}
          goToBookSession={this.goToBookSession}
          hasMoreInvoicesToFetch={hasMoreInvoicesToFetch}
          isBodyLoading={invoiceLoading}
          isMultilocationEnabled={this.props.theme.enable_multi_localization}
          membership={this.props.membership}
          refreshConsumerInvoices={this.refreshConsumerInvoices}
          refreshMembership={this.refreshMembership}
          selectedFilter={this.state.selectedFilter}
          selectedInvoiceUuid={this.props.selectedInvoiceUuid}
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
    paidInvoiceList: getPaidInvoices(state),
    paidInvoicesLoading: getPaidInvoicesLoading(state),
    paidInvoicesNextPage: getPaidInvoicesNextPage(state),
    refundedInvoiceList: getRefundedInvoices(state),
    refundedInvoicesLoading: getRefundedInvoicesLoading(state),
    refundedInvoicesNextPage: getRefundedInvoicesNextPage(state),
    unpaidInvoiceList: getUnpaidInvoices(state),
    unpaidInvoicesCount: getUnpaidInvoicesCount(state),
    unpaidInvoicesLoading: getUnpaidInvoicesLoading(state),
    unpaidInvoicesNextPage: getUnpaidInvoicesNextPage(state),
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
