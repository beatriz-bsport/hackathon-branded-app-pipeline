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
const renderActions = (invoice: Invoice, action) => {
  if (invoice.loading) {
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

const renderRows = (invoices, members, actions) => {
  return invoices.map((inv) => ({
    uuid: inv.uuid.slice(0, 8).toUpperCase(),
    name: (members.find((m) => m.id === inv.member) || {}).name,
    date: formatAsDatetime(inv.date),
    price_due: `${inv.price_due} €`,
    status: renderStatus(inv),
    actions: renderActions(inv, actions),
  }));
};

const getColumnData = (t: TFunction) => {
  return [
    {
      name: 'uuid',
      label: 'ID',
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
    },
    {
      name: 'actions',
      label: t('payment.actions'),
    },
  ];
};

type Props = {
  members: Array<Member>,
  invoices: Array<Invoice>,
  t: TFunction,
  finalizeInvoice: (uuid: string) => void,
  downloadInvoice: (uuid: string) => void,
  onInvoiceClick: (uuid: string) => void,
};

type State = {
  invoices: Array<Invoice>,
  loading: boolean,
  ount: numpber,
  tableState: { page: number },
};

export class InvoiceTable extends Component<Props> {
  state = {
    invoices: [],
    loading: true,
    count: 0,
    tableState: {
      page: 1,
    },
  };

  componentDidMount() {
    api.invoice
      .fetchAll({
        page: 1,
        pageSize: INVOICE_PER_PAGE,
      })
      .then((response) => {
        this.setState((prevState) => ({
          invoices: response.data.results,
          count: response.data.count,
          loading: false,
        }));
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  finalizeInvoice = (event: SyntheticEvent, uuid: string) => {
    event.stopPropagation();
    this.props.finalizeInvoice(uuid);
  };

  downloadInvoice = (event: SyntheticEvent, invoice: Invoice) => {
    event.stopPropagation();
    this.props.downloadInvoice(invoice);
  };

  onRowClick = (rowData, { rowIndex }) => {
    this.props.onInvoiceClick(this.state.invoices[rowIndex].uuid);
  };

  render() {
    const { t, members } = this.props;
    const { invoices, loading } = this.state;
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: INVOICE_PER_PAGE,
      rowsPerPageOptions: [INVOICE_PER_PAGE],
      count: this.state.count,
      tableState: this.state.tableState,
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
        api.invoice
          .fetchAll({ page: tableState.page + 1, pageSize: INVOICE_PER_PAGE })
          .then((res) => {
            this.setState((prevState) => ({
              loading: false,
              invoices: res.data.results,
              tableState: {
                ...prevState.tableState,
                page: prevState.tableState.page + 1,
              },
            }));
          });
      },
    };

    return (
      <MUIDataTable
        data={renderRows(invoices, members, {
          finalizeInvoice: this.finalizeInvoice,
          downloadInvoice: this.downloadInvoice,
        })}
        columns={getColumnData(t)}
        options={options}
      />
    );
  }
}

export default withNamespaces()(InvoiceTable);
