// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import type { TFunction } from 'react-i18next';
import ConsumerPacks from '../../components/consumer/ConsumerPacks.component';
import ConsumerMenu from '../../components/navigation/ConsumerMenu.component';
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
      <ConsumerMenu>
        <Grid
          container
          direction="column"
          spacing={16}
          className={classes.container}
        >
          <Grid item>
            <Typography variant="h6">{t('consumer.myPaymentPacks')}</Typography>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ConsumerPacks packs={consumerPaymentPacks} />
          </Grid>
        </Grid>
      </ConsumerMenu>
    );
  }
}

function mapStateToProps(state) {
  return {
    consumerPaymentPacks: state.consumer.consumerPaymentPacks,
  };
}

export default withStyles(styles)(
  withNamespaces()(connect(mapStateToProps)(MyPaymentPacks)),
);
