// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';

import { connect } from 'react-redux';

import { invoice as invoiceActions } from '../../actions';
import { regularizeDebt as regularizeDebtAction } from '../../libs/member/actions';
import InvoiceTable from '../invoice/InvoiceTable.component';
import { fetchMembership as fetchMembershipAction } from '../../libs/membership/actions';

import type { Membership } from '../../libs/membership/types';
import ConsumerDebtRegularizerDialog from '../../libs/consumer-space/components/ConsumerDebtRegularizerDialog.component';

type Props = {
  classes: Object,
  finalizeInvoice: (uuid: string) => void,
  membership: Membership,
  submitPayment: (paymentData: any, options: OptionCallback) => void,
};

export class ConsumerInvoice extends React.Component<Props> {
  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  render() {
    return (
      <div className={this.props.classes.table}>
        <ConsumerDebtRegularizerDialog
          withButton
          member={this.props.membership}
          submitPayment={this.props.submitPayment}
        />
        <InvoiceTable
          finalizeInvoice={this.props.finalizeInvoice}
          downloadInvoice={this.downloadInvoice}
          queryParams={`reverted=false&member=${this.props.membership.id}`}
          showOnlyCoreColumnsAndFinalize
          autoFinalize
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  table: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withStyles(styles),
  connect(
    null,
    {
      regularizeDebt: regularizeDebtAction,
      finalizeInvoice: invoiceActions.finalizeInvoice,
      fetchMembership: fetchMembershipAction,
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
