// @flow

import React, { Component } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import CONTENT_TYPES from 'bsport-commons/lib/master-data/content-types';

import { formatAsDatetime } from '../datetime';
import { FeatureTable } from '../components';

import type { Member, Invoice } from '../api/types';

type Props = {
  t: (x: String) => String,
  invoices: Array<Object>, // it is an immutable on which we call .asMutable() but whatever
  loading: boolean,
  members: Array<Member>,
};

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
        id: 'content_type',
        label: t('payment.type'),
      },
      {
        id: 'price',
        label: t('payment.amount'),
      },
      {
        id: 'date',
        label: t('payment.paymentDate'),
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
      <TableCell>
        {this.props.t(
          `content_type.${
            CONTENT_TYPES.filter((ct) => ct.id === inv.content_type)[0]
          }`,
        )}
      </TableCell>
      <TableCell numeric>{inv.price}</TableCell>
      <TableCell numeric>{formatAsDatetime(inv.date)}</TableCell>
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
    return (
      <Grid container spacing={32} alignItems="flex-end">
        <Grid item xs={12}>
          <FeatureTable
            data={mutableInvoices}
            renderRow={this.renderRow}
            columnData={this.getColumnData()}
            loading={loading}
            title={t('common.transactions')}
            orderBy="date"
            order="desc"
          />
        </Grid>
        <Grid item>
          <div style={{ right: 0 }}>
            <Button variant="raised" color="primary">
              Voir mes factures
            </Button>
          </div>
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
