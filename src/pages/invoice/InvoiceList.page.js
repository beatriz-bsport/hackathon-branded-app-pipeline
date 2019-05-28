// @flow

import React, { Component } from 'react';

import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import {
  member as memberActions,
  invoice as invoiceActions,
} from '../../actions';

import type { Member, Invoice } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import InvoiceTable from './InvoiceTable.component';

type Props = {
  loading: boolean,
  invoices: Array<Invoice>, // it is an immutable on which we call .asMutable() but whatever
  members: Array<Member>,

  push: (path: string) => void,
  finalizeInvoice: (uuid: string) => void,
  refreshMembers: () => void,
};

export class InvoiceList extends Component<Props> {
  componentDidMount() {
    this.props.refreshMembers();
  }

  pushToInvoiceDetail = (uuid: string) => {
    this.props.push(`/invoice/${uuid}`);
  };

  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  render() {
    const mutableInvoices = this.props.invoices.asMutable
      ? this.props.invoices.asMutable()
      : this.props.invoices;
    return (
        <InvoiceTable
          invoices={mutableInvoices}
          members={this.props.members}
          loading={this.props.loading}
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
    (state) => ({
      members: state.member.all || [],
      invoices: state.invoice.all || [],
      loading: state.invoice.loading || state.member.loading,
    }),
    {
      refreshMembers: memberActions.refresher,
      push: routerPush,
      finalizeInvoice: invoiceActions.finalizeInvoice,
    },
  ),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.invoiceList')),
)(InvoiceList);
