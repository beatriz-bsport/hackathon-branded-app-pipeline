import React, { Component } from 'react';

import { Grid, Typography, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import ConsumerPacks from '../../components/consumer/ConsumerPacks.component';

const styles = () => ({
  container: {},
});

type Props = {};

export class MyPaymentPacks extends Component<Props> {
  render() {
    const { consumerPaymentPacks, t } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
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
