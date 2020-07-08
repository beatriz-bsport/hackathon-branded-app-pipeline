// @flow

import React, { Component } from 'react';

import { push as routerPush } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';

import withStyles from '@material-ui/core/styles/withStyles';
import { getInvoiceList } from '../../libs/invoice/selectors';
import { finalizeInvoice, fetchInvoiceList } from '../../libs/invoice/actions';

import type { Invoice } from '../../libs/invoice/types';
import withTitle from '../../hocs/with-title.hoc';

import InvoiceTable from './InvoiceTable.component';

type Props = {
  push: (path: string) => void,
  finalizeInvoice: (uuid: string) => void,
  invoiceList: Array<Invoice>,
  loading: boolean,
  count: number,
  classes: Object,
  fetchInvoiceList: (params: *, options: OptionCallback) => void,
};

export class InvoiceList extends Component<Props> {
  pushToInvoiceDetail = (uuid: string) => {
    this.props.push(`/invoice/${uuid}`);
  };

  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  render() {
    if (!this.props.invoiceList) {
      return <LinearProgress />;
    }
    return (
      <div className={this.props.classes.container}>
        <InvoiceTable
          onInvoiceClick={this.pushToInvoiceDetail}
          finalizeInvoice={this.props.finalizeInvoice}
          downloadInvoice={this.downloadInvoice}
          count={this.props.count}
          invoices={this.props.invoiceList}
          loading={this.props.loading}
          fetchInvoiceList={this.props.fetchInvoiceList}
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
  withTranslation(),
  withStyles(styles),
  connect(
    (state) => ({
      invoiceList: getInvoiceList(state),
      count: state.invoice.list.count,
      loading: state.invoice.list.loading,
    }),
    {
      push: routerPush,
      finalizeInvoice,
      fetchInvoiceList,
    },
  ),
  withTitle(({ t }: { t: TFunction }) => t('titles:invoice.invoiceList')),
)(InvoiceList);
