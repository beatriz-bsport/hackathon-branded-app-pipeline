import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { PaymentTable } from '../components';

export default class Payment extends Component<{}> {
  render() {
    const data = [
      {
        payment_type: 'Pass',
        payment_object: 'Pack illimité toute activité',
        payment_date: '21/07/2018',
        amount: 200,
        consumer: 'Jean Jacques',
      },
      {
        payment_type: 'Réservation',
        payment_object: 'Séance 22/04/2019 18h',
        payment_date: '21/07/2018',
        amount: 20,
        consumer: 'Jean Jacques',
      },
    ];
    return (
      <Grid container spacing={32} alignItems="flex-end">
        <Grid item xs={12}>
          <PaymentTable data={data} />
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
