// @flow

import React, { Component } from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import DoneIcon from '@material-ui/icons/Done';
import SaveIcon from '@material-ui/icons/Save';
import DownloadIcon from '@material-ui/icons/Attachment';

import { PAYMENT_PACK } from '@bsport/common/lib/master-data/payment-methods';

import { formatAsDatetime } from '../../utils/datetime';
import FeatureTable from '../../components/FeatureTable';
import { getCurrencyDisplayWithPrice } from '../theme/selectors';

import type { Member, Invoice } from '../../api/types';

type Props = {
  t: TFunction,
  invoices: Array<Object>, // it is an immutable on which we call .asMutable() but whatever
  loading: boolean,
  members: Array<Member>,
  onInvoiceClick: (uuid: string) => void,
  downloadInvoice: (invoice: Invoice) => void,
  finalizeInvoice: (uuid: string) => void,
};

type State = {
  selectedInvoiceUuid: ?string,
};

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
      -{' '}
      {getCurrencyDisplayWithPrice(
        invoice.price_due - invoice.price_payed - invoice.voucher,
      )}
    </Typography>
  );
}

export class InvoiceTable extends Component<Props, State> {
  finalizeInvoice = (event: SyntheticEvent, uuid: string) => {
    event.stopPropagation();
    this.props.finalizeInvoice(uuid);
  };

  downloadInvoice = (event: SyntheticEvent, invoice: Invoice) => {
    event.stopPropagation();
    this.props.downloadInvoice(invoice);
  };

  renderActions = (invoice: Invoice) => {
    if (invoice.loading) {
      return (
        <Grid container item alignItems="center">
          <CircularProgress size={20} />
        </Grid>
      );
    }
    if (invoice.is_finalized) {
      return (
        <IconButton onClick={(event) => this.downloadInvoice(event, invoice)}>
          <DownloadIcon />
        </IconButton>
      );
    }
    return (
      <IconButton
        onClick={(event) => this.finalizeInvoice(event, invoice.uuid)}
      >
        <SaveIcon />
      </IconButton>
    );
  };

  getColumnData = () => {
    const { t } = this.props;
    return [
      {
        id: 'iuud',
        label: 'ID',
      },
      {
        id: 'name',
        label: t('payment.consumer'),
      },
      {
        id: 'date',
        label: t('payment.paymentDate'),
      },
      {
        id: 'price_payed',
        label: t('payment.amount'),
      },
      {
        id: 'status',
        label: t('payment.fullyPaid'),
      },
      {
        id: 'actions',
        label: t('payment.actions'),
      },
    ];
  };

  renderRow = (inv: Invoice) => (
    <TableRow
      key={inv.uuid}
      hover
      onClick={() => this.props.onInvoiceClick(inv.uuid)}
    >
      <TableCell component="th" scope="row">
        {inv.uuid.slice(0, 8).toUpperCase()}
      </TableCell>
      <TableCell>
        {(this.props.members.find((m) => m.id === inv.member) || {}).name}
      </TableCell>
      <TableCell>{formatAsDatetime(inv.date)}</TableCell>
      <TableCell>{getCurrencyDisplayWithPrice(inv.price_due)}</TableCell>
      <TableCell>{renderStatus(inv)}</TableCell>
      <TableCell>{this.renderActions(inv)}</TableCell>
    </TableRow>
  );

  render() {
    const moneyInvoices = this.props.invoices.filter(
      (inv) => inv.payment_method !== PAYMENT_PACK,
    );
    return (
      <FeatureTable
        data={moneyInvoices}
        renderRow={this.renderRow}
        columnData={this.getColumnData()}
        loading={this.props.loading}
        orderBy="date"
        order="desc"
      />
    );
  }
}

export default withTranslation([])(InvoiceTable);
