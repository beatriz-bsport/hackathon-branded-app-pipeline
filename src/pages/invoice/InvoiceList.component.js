// @flow

import React, { Component } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Grid,
  CircularProgress,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/ErrorOutline';

import { PAYMENT_PACK } from 'bsport-commons/lib/master-data/payment-methods';

import { formatAsDatetime } from '../../datetime';
import { FeatureTable } from '../../components';

import type { Member, Invoice } from '../../api/types';

type Props = {
  t: (x: string) => string,
  invoices: Array<Object>, // it is an immutable on which we call .asMutable() but whatever
  loading: boolean,
  members: Array<Member>,
};

function renderStatus(invoice: Invoice) {
  const payed =
    -(invoice.price_due - invoice.price_payed - invoice.voucher) >= 0;
  if (payed) {
    return <DoneIcon color="primary" />;
  }
  return (
    <Grid container direction="row" alignItems="flex-end" spacing={24}>
      <Grid item>
        <Typography>
          - {invoice.price_due - invoice.price_payed - invoice.voucher} €
        </Typography>
      </Grid>
      <Grid>
        <ErrorIcon color="error" />
      </Grid>
    </Grid>
  );
}

export class InvoiceList extends Component<Props> {
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
        id: 'price_due',
        label: t('payment.amount'),
      },
      {
        id: 'status',
        label: t('payment.fullyPaid'),
      },
    ];
  };

  renderRow = (inv: Invoice) => (
    <TableRow key={inv.uuid}>
      <TableCell component="th" scope="row">
        {inv.uuid.slice(0, 8).toUpperCase()}
      </TableCell>
      <TableCell>
        {this.props.members.filter((m) => m.id === inv.member)[0].name}
      </TableCell>
      <TableCell>{formatAsDatetime(inv.date)}</TableCell>
      <TableCell>{inv.price_due} €</TableCell>
      <TableCell>{renderStatus(inv)}</TableCell>
    </TableRow>
  );

  render() {
    const { t, invoices, loading } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    const mutableInvoices = invoices.asMutable
      ? invoices.asMutable()
      : invoices;
    const moneyInvoices = mutableInvoices.filter(
      (inv) => inv.payment_method !== PAYMENT_PACK,
    );
    return (
      <Grid container spacing={32} alignItems="flex-end">
        <Grid item xs={12}>
          <FeatureTable
            data={moneyInvoices}
            renderRow={this.renderRow}
            columnData={this.getColumnData()}
            loading={loading}
            title={t('common.transactions')}
            orderBy="date"
            order="desc"
          />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    members: state.member.all,
    invoices: state.invoice.all,
    loading: state.invoice.loading || state.member.loading,
  };
}

export default connect(mapStateToProps)(translate()(InvoiceList));
