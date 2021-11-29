// @flow

import MUIDataTable from 'mui-datatables';
import React, { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import DoneIcon from '@material-ui/icons/Done';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import DownloadIcon from '@material-ui/icons/Attachment';

import FinalizeInvoiceDialog from '../../libs/invoice/dialog/FinalizeInvoiceDialog.component';

import { formatAsDatetime } from '../../utils/datetime';
import { getCurrencyDisplayWithPrice } from '../../libs/theme/selectors';

import type { Invoice } from '../../libs/invoice/types';

const INVOICE_PER_PAGE = 50;

function renderStatus(invoice: Invoice, t: TFunction) {
  // prettier-ignore
  const payed = (
    -(
      invoice.price_due
      - invoice.price_payed
      - invoice.voucher
      ) >= 0
  );
  if (invoice.reverted) {
    return t('invoice.reverted');
  }
  if (payed) {
    return <DoneIcon color="primary" />;
  }
  return (
    <Typography color="error">
      {getCurrencyDisplayWithPrice(
        -invoice.price_due + invoice.price_payed + invoice.voucher,
      )}
    </Typography>
  );
}
const renderActions = (invoice: Invoice, action, processing) => {
  if (invoice.reverted) {
    return (
      <IconButton>
        <CancelIcon />
      </IconButton>
    );
  }
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

const renderRows = (invoices, processing, actions, t) => {
  return invoices.map((inv) => ({
    uuid: inv.uuid.slice(0, 8).toUpperCase(),
    name: inv.memberName,
    date: formatAsDatetime(inv.date),
    price_due: `${getCurrencyDisplayWithPrice(inv.price_due)}`,
    status: renderStatus(inv, t),
    actions: renderActions(inv, actions, processing.includes(inv.uuid)),
  }));
};

const getColumnData = (
  t: TFunction,
  showOnlyCoreColumns: boolean,
  showOnlyCoreColumnsAndFinalize: boolean,
) => {
  const coreColumns = [
    {
      name: 'uuid',
      label: 'ID',
      options: {
        filter: false,
        sort: false,
      },
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
  ];
  if (showOnlyCoreColumns) {
    return coreColumns;
  }
  if (showOnlyCoreColumnsAndFinalize) {
    return [
      ...coreColumns,
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
  }

  return [
    {
      name: 'name',
      label: t('payment.consumer'),
    },
    ...coreColumns,
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
  t: TFunction,
  finalizeInvoice: (uuid: string) => void,
  downloadInvoice: (uuid: string) => void,
  onInvoiceClick: (uuid: string) => void,
  showOnlyCore: ?boolean,
  title?: string,
  autoFinalize?: boolean,
  showOnlyCoreColumnsAndFinalize?: boolean,
  count: number,
  invoices: Array<Invoice>,

  fetchInvoiceList: (params: any, options: OptionCallback) => void,
  loading: boolean,
};

type State = {
  tableState: { page: number },
  invoiceFinalizing: ?string,
  processing: Array<string>,
};

export class InvoiceTable extends Component<Props, State> {
  state = {
    processing: [],
    invoiceFinalizing: null,
    tableState: {
      page: 1,
    },
  };

  fetchInvoicePage = (page: number) => {
    this.props.fetchInvoiceList(
      {
        page,
        page_size: INVOICE_PER_PAGE,
      },
      {
        onSuccess: () => {
          this.setState((prevState) => ({
            tableState: {
              ...prevState.tableState,
              page,
            },
          }));
        },
      },
    );
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
    if (this.props.autoFinalize) {
      this.props.finalizeInvoice(uuid, {
        onSuccess: () => this.refreshPage(uuid),
      });
    } else {
      event.stopPropagation();
      this.openFinalizingDialog(uuid);
    }
  };

  downloadInvoice = (event: SyntheticEvent, invoice: Invoice) => {
    event.stopPropagation();
    this.props.downloadInvoice(invoice);
  };

  onRowClick = (rowData, { rowIndex }) => {
    if (this.props.onInvoiceClick) {
      return this.props.onInvoiceClick(this.props.invoices[rowIndex].uuid);
    }
    return null;
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
    const { t } = this.props;
    const { processing } = this.state;
    const options = {
      onRowClick: this.onRowClick,
      serverSide: true,
      rowsPerPage: INVOICE_PER_PAGE,
      rowsPerPageOptions: [INVOICE_PER_PAGE],
      loading: this.props.loading,
      count: this.props.count,
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
          noMatch: this.props.loading ? (
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
          data={renderRows(
            this.props.invoices,
            processing,
            {
              finalizeInvoice: this.startFinalizeInvoice,
              downloadInvoice: this.downloadInvoice,
            },
            t,
          )}
          columns={getColumnData(
            t,
            !!this.props.showOnlyCore,
            !!this.props.showOnlyCoreColumnsAndFinalize,
          )}
          options={options}
          title={this.props.title}
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

export default withTranslation()(InvoiceTable);
