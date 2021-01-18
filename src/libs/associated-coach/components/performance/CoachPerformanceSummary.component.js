// @flow

import React from 'react';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';

import Figure from '../../../../components/graph/Figure.component';
import { getCurrencyDisplay } from '../../../theme/selectors';

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
    <Grid container direction="row" spacing={2} className={classes.root}>
      <Grid item xs={12} md={4} id="nbOffersTotal">
        <Figure
          name={t('performance.nbOffersTotal')}
          count={nbSessions || '-'}
          color="red"
        />
      </Grid>
      <Grid item xs={12} md={4} id="nbBookings">
        <Figure
          name={t('performance.nbBookings')}
          count={nbBookings || '-'}
          color="marine"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Figure
          name={t('performance.payment')}
          count={total ? `${total.toFixed(2)} ${getCurrencyDisplay()}` : '-'}
          color="green"
        />
      </Grid>
    </Grid>
  );
}

const styles = (theme) => ({
  root: {
    paddingTop: theme.spacing(1) * 1,
    paddingBottom: theme.spacing(2),
  },
});

export default withTranslation(['coach'])(
  withStyles(styles)(CoachPerformanceSummary),
);
