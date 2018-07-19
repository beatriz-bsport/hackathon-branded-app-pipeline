import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

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
    return <PaymentTable data={data} />;
  }
}
