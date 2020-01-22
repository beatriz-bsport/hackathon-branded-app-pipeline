// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import { connect } from 'react-redux';

import { invoice as invoiceActions } from '../../actions';
import InvoiceTable from '../invoice/InvoiceTable.component';

import type { Membership } from '../../libs/membership/types';

type Props = {
  classes: Object,
  finalizeInvoice: (uuid: string) => void,
  membership: Membership,
};

export class ConsumerInvoice extends React.Component<Props> {
  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  render() {
    return (
      <div className={this.props.classes.table}>
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
      finalizeInvoice: invoiceActions.finalizeInvoice,
    },
  ),
)(ConsumerInvoice);
