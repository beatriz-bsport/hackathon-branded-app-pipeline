// @flow

import React, { Component } from 'react';

import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';

import { invoice as invoiceActions } from '../../actions';

import type { Invoice } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';

import InvoiceTable from './InvoiceTable.component';

type Props = {
  push: (path: string) => void,
  finalizeInvoice: (uuid: string) => void,
  classes: Object,
};

export class InvoiceList extends Component<Props> {
  pushToInvoiceDetail = (uuid: string) => {
    this.props.push(`/invoice/${uuid}`);
  };

  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        <InvoiceTable
          onInvoiceClick={this.pushToInvoiceDetail}
          finalizeInvoice={this.props.finalizeInvoice}
          downloadInvoice={this.downloadInvoice}
          showOnlyCore
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    maxWidth: '100vw',
  },
});

export default compose(
  withNamespaces(),
  withStyles(styles),
  connect(
    null,
    {
      push: routerPush,
      finalizeInvoice: invoiceActions.finalizeInvoice,
    },
  ),
  withTitle(({ t }: { t: TFunction }) => t('titles:invoice.invoiceList')),
)(InvoiceList);
