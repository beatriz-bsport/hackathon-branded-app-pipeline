// @flow
import React, { Component } from 'react';

import { Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';
import ConsumerPacks from '../../components/consumer/ConsumerPacks.component';
import type { ConsumerPaymentPackConsumerView } from '../../api/types';

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflow: 'auto',
    maxWidth: '100vw',
  },
});

type Props = {
  consumerPaymentPacks: Array<ConsumerPaymentPackConsumerView>,
  t: TFunction,
  classes: Object,
};

export class MyPaymentPacks extends Component<Props> {
  render() {
    const { consumerPaymentPacks, t, classes } = this.props;
    return (
      <Grid
        container
        direction="column"
        spacing={16}
        className={classes.container}
      >
        <Grid item>
          <Typography variant="title">
            {t('consumer.myPaymentPacks')}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8}>
          <ConsumerPacks packs={consumerPaymentPacks} />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    consumerPaymentPacks: state.consumer.consumerPaymentPacks,
  };
}

export default withStyles(styles)(
  translate()(connect(mapStateToProps)(MyPaymentPacks)),
);
