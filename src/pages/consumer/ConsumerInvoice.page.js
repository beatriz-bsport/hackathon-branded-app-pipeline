// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';

import { connect } from 'react-redux';

import { finalizeInvoice, fetchInvoiceList } from '../../libs/invoice/actions';
import { regularizeDebt as regularizeDebtAction } from '../../libs/member/actions';
import InvoiceTable from '../invoice/InvoiceTable.component';
import { fetchMembership as fetchMembershipAction } from '../../libs/membership/actions';
import themeSelectors from '../../libs/theme/selectors';
import { getInvoiceList } from '../../libs/invoice/selectors';

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
};

export class ConsumerInvoice extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentMethodList({
      company: this.props.membership.company,
    });
  }

  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
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
          finalizeInvoice={this.props.finalizeInvoice}
          downloadInvoice={this.downloadInvoice}
          showOnlyCoreColumnsAndFinalize
          autoFinalize
          count={this.props.count}
          invoices={this.props.invoiceList}
          loading={this.props.loading}
          fetchInvoiceList={(params, options) =>
            this.props.fetchInvoiceList(
              {
                ...(params || {}),
                reverted: false,
                member: this.props.membership.id,
              },
              options,
            )
          }
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
      invoiceList: getInvoiceList(state),
      count: state.invoice.list.count,
      loading: state.invoice.list.loading,
      companyTheme: themeSelectors.getTheme(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      finalizeInvoice,
      regularizeDebt: regularizeDebtAction,
      fetchMembership: fetchMembershipAction,
      fetchInvoiceList,
      fetchPaymentMethodList,
    },
  ),
  withHandlers({
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
