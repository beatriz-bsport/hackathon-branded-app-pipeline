// @flow
import Paper from '@material-ui/core/Paper';
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';

import { connect } from 'react-redux';

import {
  finalizeInvoice as finalizeInvoiceAction,
  fetchInvoiceList as fetchInvoiceListAction,
  fetchInvoiceItemList,
  fetchPaymentList,
} from '../../libs/invoice/actions';
import { regularizeDebt as regularizeDebtAction } from '../../libs/member/actions';
import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';
import { fetchMembership as fetchMembershipAction } from '../../libs/membership/actions';
import themeSelectors from '../../libs/theme/selectors';
import {
  getInvoiceList,
  withInvoiceItem,
  withPayment,
} from '../../libs/invoice/selectors';

import type { Membership } from '../../libs/membership/types';
import ConsumerDebtRegularizerDialog from '../../libs/consumer-space/components/ConsumerDebtRegularizerDialog.component';

import { fetchPaymentMethodList } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';

type Props = {
  classes: Object,
  finalizeInvoice: (uuid: string) => void,
  membership: Membership,
  submitPayment: (paymentData: any, options: OptionCallback) => void,
  companyTheme: ?CompanyTheme,

  count: number,
  invoiceList: Array<Invoice>,
  loading: boolean,
  fetchInvoiceList: (params: any, options: OptionCallback) => void,

  fetchPaymentMethodList: (params: any) => void,
  savedPaymentMethodList: Array<PaymentMethod>,

  fetchPaymentList: (params: any) => void,
  fetchInvoiceItemList: (params: any) => void,
  nestedDataLoading: boolean,
  page: number,
};

export class ConsumerInvoice extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentMethodList({
      company: this.props.membership.company,
    });
    this.onChangePage(1);
  }

  fetchInvoiceDataNested = (uuid: string) => {
    this.props.fetchPaymentList({ invoice__uuid: uuid, page_size: 100 });
    this.props.fetchInvoiceItemList({ invoice__uuid: uuid, page_size: 100 });
  };

  onChangePage = (page) => {
    this.props.fetchInvoiceList({ page_size: 50, page });
  };

  render() {
    return (
      <div className={this.props.classes.table}>
        {this.props.companyTheme &&
          this.props.companyTheme.consumer_regularize_debt && (
            <ConsumerDebtRegularizerDialog
              withButton
              member={this.props.membership}
              submitPayment={this.props.submitPayment}
              savedPaymentMethodList={this.props.savedPaymentMethodList}
            />
          )}

        <InvoiceTable
          hideMemberName
          loading={this.props.loading}
          nestedDataLoading={this.props.nestedDataLoading}
          onInvoiceExpand={this.fetchInvoiceDataNested}
          invoiceList={this.props.invoiceList}
          containerComponent={Paper}
          onChangePage={this.onChangePage}
          count={this.props.count}
          page={this.props.page}
          finalizeInvoice={this.props.finalizeInvoice}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  table: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withStyles(styles),
  connect(
    (state) => ({
      invoiceList: withInvoiceItem(withPayment(getInvoiceList))(state),
      count: state.invoice.list.count,
      loading: state.invoice.list.loading,
      companyTheme: themeSelectors.getTheme(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      page: state.invoice.list.page,
      nestedDataLoading:
        state.invoice.invoiceItem.loading || state.invoice.payment.loading,
    }),
    {
      finalizeInvoice: finalizeInvoiceAction,
      regularizeDebt: regularizeDebtAction,
      fetchMembership: fetchMembershipAction,
      fetchInvoiceList: fetchInvoiceListAction,
      fetchPaymentMethodList,
      fetchInvoiceItemList,
      fetchPaymentList,
    },
  ),
  withHandlers({
    finalizeInvoice: ({ finalizeInvoice }) => (uuid, options) =>
      finalizeInvoice(uuid, {
        onError: (err) => {
          if (options && options.onError) options.onError(err);
        },
        onSuccess: (invoice) => {
          window.open(invoice.stripe_invoice_pdf);
          if (options && options.onSuccess) options.onSuccess();
        },
      }),
    fetchInvoiceList: ({ fetchInvoiceList, membership }) => () => {
      fetchInvoiceList({
        unpaid: true,
        is_draft: false,
        is_v2: true,
        member: membership.id,
      });
    },
    submitPayment: ({ regularizeDebt, membership, fetchMembership }) => (
      data,
      options,
    ) => {
      regularizeDebt(membership.id, data, {
        onSuccess: (response) => {
          if (options && options.onSuccess) {
            options.onSuccess(response);
          }
          fetchMembership(membership.id, {
            onSuccess: () => window.location.reload(),
          });
        },
        onError: (err) => {
          console.error(err);
          if (options && options.onError) {
            options.onError(err);
          }
        },
      });
    },
  }),
)(ConsumerInvoice);
