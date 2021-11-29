// @flow

import React, { Component } from 'react';

import { push as routerPush } from 'connected-react-router';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import { compose, withHandlers } from 'recompose';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  getInvoiceList,
  withInvoiceItem,
  withPayment,
} from '../../libs/invoice/selectors';
import {
  finalizeInvoice as finalizeInvoiceAction,
  fetchInvoiceList,
  fetchInvoiceItemList,
  fetchPaymentList,
  sendInvoiceToQuickbooks,
  fetchSpecificInvoice,
} from '../../libs/invoice/actions';

import type { Invoice } from '../../libs/invoice/types';
import withTitle from '../../hocs/with-title.hoc';

import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';
import themeSelectors from '../../libs/theme/selectors';
import type { Theme as CompanyTheme } from '../../libs/theme/types';

type Props = {
  push: (path: string) => void,
  finalizeInvoice: (uuid: string) => void,
  invoiceList: Array<Invoice>,
  loading: boolean,
  count: number,
  classes: Object,
  fetchInvoiceList: (params: any, options: OptionCallback) => void,
  fetchPaymentList: (params: any) => void,
  fetchInvoiceItemList: (params: any) => void,
  nestedDataLoading: boolean,
  page: number,
  companyTheme: CompanyTheme,
  quickbooksLoading: boolean,
  sendInvoiceToQuickbooks: (uuid: string) => void,
};

export class InvoiceList extends Component<Props> {
  pushToInvoiceDetail = (uuid: string) => {
    this.props.push(`/invoice/${uuid}`);
  };

  fetchInvoiceDataNested = (uuid: string) => {
    this.props.fetchPaymentList({ invoice__uuid: uuid, page_size: 100 });
    this.props.fetchInvoiceItemList({ invoice__uuid: uuid, page_size: 100 });
  };

  onChangePage = (page) => {
    this.props.fetchInvoiceList({ page_size: 50, page });
  };

  componentDidMount() {
    this.onChangePage(1);
  }

  render() {
    if (!this.props.invoiceList) {
      return <LinearProgress />;
    }
    const quickbooksIntegrated =
      this.props.companyTheme.is_quickbook_integration_allowed &&
      this.props.companyTheme.is_quickbook_integration_enabled;
    return (
      <div className={this.props.classes.container}>
        <InvoiceTable
          loading={this.props.loading}
          nestedDataLoading={this.props.nestedDataLoading}
          showType
          onInvoiceExpand={this.fetchInvoiceDataNested}
          invoiceList={this.props.invoiceList}
          containerComponent={Paper}
          onChangePage={this.onChangePage}
          count={this.props.count}
          page={this.props.page}
          onClickInvoice={this.pushToInvoiceDetail}
          finalizeInvoice={this.props.finalizeInvoice}
          quickbooksIntegrated={quickbooksIntegrated}
          sendInvoiceToQuickbooks={(uuid: string) =>
            this.props.sendInvoiceToQuickbooks(uuid)
          }
          quickbooksLoading={this.props.quickbooksLoading}
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
      invoiceList: withInvoiceItem(withPayment(getInvoiceList))(state),
      count: state.invoice.list.count,
      page: state.invoice.list.page,
      loading: state.invoice.list.loading,
      quickbooksLoading: state.invoice.quickbooks.loading,
      nestedDataLoading:
        state.invoice.invoiceItem.loading || state.invoice.payment.loading,
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      push: routerPush,
      finalizeInvoice: finalizeInvoiceAction,
      fetchInvoiceList,
      fetchInvoiceItemList,
      fetchPaymentList,
      sendInvoiceToQuickbooksAction: sendInvoiceToQuickbooks,
      fetchSpecificInvoiceAction: fetchSpecificInvoice,
    },
  ),
  withHandlers({
    finalizeInvoice:
      ({ finalizeInvoice }) =>
      (uuid, options) =>
        finalizeInvoice(uuid, {
          onError: (err) => {
            if (options && options.onError) options.onError(err);
          },
          onSuccess: (invoice) => {
            window.open(invoice.stripe_invoice_pdf);
            if (options && options.onSuccess) options.onSuccess();
          },
        }),
  }),
  withHandlers({
    sendInvoiceToQuickbooks:
      ({ sendInvoiceToQuickbooksAction, fetchSpecificInvoiceAction }) =>
      (uuid) => {
        sendInvoiceToQuickbooksAction(uuid, {
          onSuccess: () => fetchSpecificInvoiceAction(uuid),
        });
      },
  }),
  withTitle(({ t }: { t: TFunction }) => t('titles:invoice.invoiceList')),
)(InvoiceList);
