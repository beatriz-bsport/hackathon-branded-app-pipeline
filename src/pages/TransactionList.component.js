// @flow

import React, { Component } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { formatAsDatetime } from '../datetime';
import { FeatureTable } from '../components';

type Props = {
  t: (x: String) => String,
  transactions: Array<Object>, // it is an immutable on which we call .asMutable() but whatever
  loading: boolean,
};

export class TransactionList extends Component<Props> {
  getColumnData = () => {
    const { t } = this.props;
    return [
      {
        id: 'id',
        label: 'ID',
      },
      {
        id: 'name',
        label: t('payment.consumer'),
      },
      {
        id: 'kind',
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

  renderRow = (tx) => (
    <TableRow key={tx.id}>
      <TableCell component="th" scope="row">
        {tx.id.slice(0, 8).toUpperCase()}
      </TableCell>
      <TableCell>{tx.name}</TableCell>
      <TableCell>{tx.kind}</TableCell>
      <TableCell numeric>{tx.price}</TableCell>
      <TableCell numeric>{formatAsDatetime(tx.date)}</TableCell>
    </TableRow>
  );

  render() {
    const { t, transactions, loading } = this.props;
    if (loading) {
      return <CircularProgress />;
    }

    const mutableTransactions = transactions.asMutable
      ? transactions.asMutable()
      : transactions;
    return (
      <Grid container spacing={32} alignItems="flex-end">
        <Grid item xs={12}>
          <FeatureTable
            data={mutableTransactions}
            renderRow={this.renderRow}
            columnData={this.getColumnData()}
            loading={loading}
            title={t('common.transactions')}
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
    transactions: state.transaction.all,
    loading: state.transaction.loading,
  };
}

export default connect(mapStateToProps)(translate()(TransactionList));
