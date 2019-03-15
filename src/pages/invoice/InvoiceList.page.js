// @flow

import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import { invoice as invoiceActions } from '../../actions';

import type { Member, Invoice } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import InvoiceTable from '../../libs/invoice/InvoiceTable.component';
import FinalizeInvoiceDialog from '../../libs/invoice/dialog/FinalizeInvoiceDialog.component';

type Props = {
  // eslint-disable-next-line
  t: TFunction,
  invoices: Array<Invoice>, // it is an immutable on which we call .asMutable() but whatever
  loading: boolean,
  members: Array<Member>,
  push: (path: string) => void,
  finalizeInvoice: (uuid: string) => void,
};

type State = {
  invoiceFinalizing: null,
};

export class InvoiceList extends Component<Props, State> {
  state = {
    invoiceFinalizing: null,
  };

  openFinalizingDialog = (uuid: string) => {
    this.setState({ invoiceFinalizing: uuid });
  };

  closeFinalizingDialog = () => {
    this.setState({ invoiceFinalizing: null });
  };

  pushToInvoiceDetail = (uuid: string) => {
    this.props.push(`/invoice/${uuid}`);
  };

  finalizeInvoice = () => {
    this.props.finalizeInvoice(this.state.invoiceFinalizing);
    this.closeFinalizingDialog();
  };

  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  render() {
    const mutableInvoices = this.props.invoices.asMutable
      ? this.props.invoices.asMutable()
      : this.props.invoices;
    return (
      <Grid container spacing={32} alignItems="flex-end">
        <Grid item xs={12}>
          <InvoiceTable
            invoices={mutableInvoices}
            members={this.props.members}
            loading={this.props.loading}
            onInvoiceClick={this.pushToInvoiceDetail}
            finalizeInvoice={this.openFinalizingDialog}
            downloadInvoice={this.downloadInvoice}
          />
          <FinalizeInvoiceDialog
            open={!!this.state.invoiceFinalizing}
            onClose={this.closeFinalizingDialog}
            onSubmit={this.finalizeInvoice}
          />
        </Grid>
      </Grid>
    );
  }
}
export default compose(
  withNamespaces(),
  connect(
    (state) => ({
      members: state.member.all || [],
      invoices: state.invoice.all || [],
      loading: state.invoice.loading || state.member.loading,
    }),
    {
      push: routerPush,
      finalizeInvoice: invoiceActions.finalizeInvoice,
    },
  ),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.invoiceList')),
)(InvoiceList);
