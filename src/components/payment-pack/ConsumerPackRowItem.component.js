// @flow

import React, { Component } from 'react';
import { Grid, Typography, Button, CircularProgress } from '@material-ui/core';
import { translate } from 'react-i18next';

import ConsumerRowSummary from '../consumer/ConsumerRowSummary.component';
import RedButton from '../button/RedButton.component';

type Props = {
  loading: boolean,
  consumerPack: Object,
  paymentPack: Object,
  incrementCredit: (id: Number) => void,
  decrementCredit: (id: Number) => void,
  t: (x: String) => String,
};

export class ConsumerPackRowItem extends Component<Props> {
  renderButton = () => {
    const {
      t,
      loading,
      paymentPack,
      consumerPack,
      incrementCredit,
      decrementCredit,
    } = this.props;

    if (loading) {
      return (
        <Grid container item direction="row" spacing={16} alignItems="center">
          <CircularProgress />
        </Grid>
      );
    }

    const { credits } = paymentPack;
    const { available_credits } = consumerPack;
    const negativeCredit = available_credits <= 0;
    return (
      <Grid container direction="row" spacing={16} alignItems="center">
        <Grid item>
          <Typography color={negativeCredit ? 'error' : 'default'}>
            {`${available_credits} / ${credits} ${t(
              'paymentPack.credits',
            ).toLowerCase()}`}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="outlined"
            disabled={available_credits >= credits}
            onClick={() => incrementCredit(consumerPack.id)}
          >
            +1
          </Button>
        </Grid>
        <Grid item>
          <RedButton
            variant="outlined"
            onClick={() => decrementCredit(consumerPack.id)}
          >
            -1
          </RedButton>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { consumerPack, paymentPack } = this.props;

    const { unlimited } = paymentPack;
    const { consumer } = consumerPack;

    if (unlimited) {
      return <ConsumerRowSummary consumer={consumer} />;
    }
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-between"
        spacing={24}
      >
        <Grid item>
          <ConsumerRowSummary consumer={consumer} />
        </Grid>
        <Grid item>{this.renderButton()}</Grid>
      </Grid>
    );
  }
}

export default translate()(ConsumerPackRowItem);
