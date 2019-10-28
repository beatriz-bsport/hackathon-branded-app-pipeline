// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';

import Figure from '../../../../components/graph/Figure.component';

type Props = {
  nbBookings: number,
  nbSessions: number,
  total: number,
  t: (x: string) => string,
  classes: *,
};

export function CoachPerformanceSummary(props: Props) {
  const { nbBookings, nbSessions, total, classes, t } = props;

  return (
    <Grid container direction="row" spacing={16} className={classes.root}>
      <Grid item xs={12} md={4} id="nbOffersTotal">
        <Figure
          name={t('coach.performance.nbOffersTotal')}
          count={nbSessions || '-'}
          color="red"
        />
      </Grid>
      <Grid item xs={12} md={4} id="nbBookings">
        <Figure
          name={t('coach.performance.nbBookings')}
          count={nbBookings || '-'}
          color="marine"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Figure
          name={t('coach.performance.payment')}
          count={total ? `${total.toFixed(2)} €` : '-'}
          color="green"
        />
      </Grid>
    </Grid>
  );
}

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 2,
  },
});

export default withNamespaces()(withStyles(styles)(CoachPerformanceSummary));
