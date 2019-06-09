// @flow

import React, { Component } from 'react';

import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import { invoice as invoiceActions } from '../../actions';

import type { Invoice } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import InvoiceTable from './InvoiceTable.component';

type Props = {
  push: (path: string) => void,
  finalizeInvoice: (uuid: string) => void,
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
      <InvoiceTable
        onInvoiceClick={this.pushToInvoiceDetail}
        finalizeInvoice={this.props.finalizeInvoice}
        downloadInvoice={this.downloadInvoice}
      />
    );
  }
}
export default compose(
  withNamespaces(),
  connect(
    null,
    {
      push: routerPush,
      finalizeInvoice: invoiceActions.finalizeInvoice,
    },
  ),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.invoiceList')),
)(InvoiceList);
