// @flow

import MUIDataTable from 'mui-datatables';
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  Typography,
  Grid,
  CircularProgress,
  IconButton,
} from '@material-ui/core';

import type { TFunction } from 'react-i18next';
import DoneIcon from '@material-ui/icons/Done';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/Attachment';

import FinalizeInvoiceDialog from '../../libs/invoice/dialog/FinalizeInvoiceDialog.component';

import api from '../../api';

import { formatAsDatetime } from '../../datetime';

import type { Member, Invoice } from '../../api/types';

const INVOICE_PER_PAGE = 50;

function renderStatus(invoice: Invoice) {
  // prettier-ignore
  const payed = (
    -(
      invoice.price_due
      - invoice.price_payed
      - invoice.voucher
      ) >= 0
  );
  if (payed) {
    return <DoneIcon color="primary" />;
  }
  return (
    <Typography color="error">
      - {invoice.price_due - invoice.price_payed - invoice.voucher} €
    </Typography>
  );
}
const renderActions = (invoice: Invoice, action, processing) => {
  if (invoice.loading || processing) {
    return (
      <Grid container item alignItems="center">
        <CircularProgress size={20} />
      </Grid>
    );
  }
  if (invoice.is_finalized) {
    return (
      <IconButton onClick={(event) => action.downloadInvoice(event, invoice)}>
        <DownloadIcon />
      </IconButton>
    );
  }
  return (
    <IconButton
      onClick={(event) => action.finalizeInvoice(event, invoice.uuid)}
    >
      <SaveIcon />
    </IconButton>
  );
};

const renderRows = (invoices, members, processing, actions) => {
  return invoices.map((inv) => ({
    uuid: inv.uuid.slice(0, 8).toUpperCase(),
    name: (members.find((m) => m.id === inv.member) || {}).name,
    date: formatAsDatetime(inv.date),
    price_due: `${inv.price_due} €`,
    status: renderStatus(inv),
    actions: renderActions(inv, actions, processing.includes(inv.uuid)),
  }));
};

const getColumnData = (t: TFunction) => {
  return [
    {
      name: 'uuid',
      label: 'ID',
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'name',
      label: t('payment.consumer'),
    },
    {
      name: 'date',
      label: t('payment.paymentDate'),
    },
    {
      name: 'price_due',
      label: t('payment.amount'),
    },
    {
      name: 'status',
      label: t('payment.fullyPaid'),
      options: {
        download: false,
        filter: false,
        sort: false,
        print: false,
      },
    },
    {
      name: 'actions',
      label: t('payment.actions'),
      options: {
        download: false,
        filter: false,
        sort: false,
        print: false,
      },
    },
  ];
};

type Props = {
  members: Array<Member>,
  t: TFunction,
  finalizeInvoice: (uuid: string) => void,
  downloadInvoice: (uuid: string) => void,
  onInvoiceClick: (uuid: string) => void,
};

type State = {
  invoices: Array<Invoice>,
  loading: boolean,
  count: number,
  tableState: { page: number },
  invoiceFinalizing: ?string,
  processing: Array<string>,
};

export class InvoiceTable extends Component<Props, State> {
  state = {
    invoices: [],
    loading: true,
    count: 0,
    processing: [],
    invoiceFinalizing: null,
    tableState: {
      page: 1,
    },
  };

  fetchInvoicePage = (page: number) => {
    api.invoice
      .fetchAll({
        page,
        pageSize: INVOICE_PER_PAGE,
      })
      .then((response) => {
        this.setState((prevState) => ({
          invoices: response.data.results,
          count: response.data.count,
          loading: false,
          tableState: {
            ...prevState.tableState,
            page,
          },
        }));
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  };

  componentDidMount() {
    this.fetchInvoicePage(1);
  }

  refreshPage = (uuid: string) => {
    this.setState((prevState) => ({
      processing: [...prevState.processing, uuid],
    }));
    setTimeout(() => {
      this.fetchInvoicePage(this.state.tableState.page);
      this.setState((prevState) => ({
        processing: [...prevState.processing.filter((u) => u !== uuid)],
      }));
    }, 5000);
  };

  startFinalizeInvoice = (event: SyntheticEvent, uuid: string) => {
    event.stopPropagation();
    this.openFinalizingDialog(uuid);
  };

  downloadInvoice = (event: SyntheticEvent, invoice: Invoice) => {
    event.stopPropagation();
    this.props.downloadInvoice(invoice);
  };

  onRowClick = (rowData, { rowIndex }) => {
    this.props.onInvoiceClick(this.state.invoices[rowIndex].uuid);
  };

  finalizeInvoice = () => {
    this.props.finalizeInvoice(this.state.invoiceFinalizing);
    this.refreshPage(this.state.invoiceFinalizing);
    this.closeFinalizingDialog();
  };

  openFinalizingDialog = (uuid: string) => {
    this.setState({ invoiceFinalizing: uuid });
  };

  closeFinalizingDialog = () => {
    this.setState({ invoiceFinalizing: null });
  };

  render() {
    const { t, members } = this.props;
    const { invoices, processing, loading } = this.state;
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: INVOICE_PER_PAGE,
      rowsPerPageOptions: [INVOICE_PER_PAGE],
      loading,
      count: this.state.count,
      tableState: this.state.tableState,
      filter: false,
      search: false,
      sort: false,
      responsive: 'scroll',
      selectableRows: false,
      downloadOptions: {
        filename: 'invoices.csv',
        separator: ',',
      },
      textLabels: {
        body: {
          noMatch: loading ? (
            <CircularProgress />
          ) : (
            'Sorry, there is no invoice data to display'
          ),
        },
      },
      onTableChange: (action, tableState) => {
        this.fetchInvoicePage(tableState.page + 1);
      },
    };

    return (
      <div>
        <MUIDataTable
          data={renderRows(invoices, members, processing, {
            finalizeInvoice: this.startFinalizeInvoice,
            downloadInvoice: this.downloadInvoice,
          })}
          columns={getColumnData(t)}
          options={options}
        />
        <FinalizeInvoiceDialog
          open={!!this.state.invoiceFinalizing}
          onClose={this.closeFinalizingDialog}
          onSubmit={this.finalizeInvoice}
        />
      </div>
    );
  }
}

export default withNamespaces()(InvoiceTable);
