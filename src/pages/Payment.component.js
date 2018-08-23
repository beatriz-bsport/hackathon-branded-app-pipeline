import React, { Component } from 'react';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';

import { PaymentTable } from '../components';

export class Payment extends Component<{}> {
  render() {
    const { transactions, loading } = this.props;
    if (loading) {
      return <CircularProgress />;
    }

    return (
      <Grid container spacing={32} alignItems="flex-end">
        <Grid item xs={12}>
          <PaymentTable data={transactions} />
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

export default connect(mapStateToProps)(Payment);
