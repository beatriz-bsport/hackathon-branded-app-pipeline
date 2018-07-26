import React from 'react';
import { withStyles, Divider, Grid, Typography } from '@material-ui/core';
import { translate } from 'react-i18next';

const styles = (theme) => ({});

export function ActivityStats(props) {
  const { stats, t, classes } = props;
  const { total_customers, average_fillrate, gross_volume } = stats;

  return (
    <Grid
      container
      justify="space-around"
      alignItems="baseline"
      direction="row"
    >
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Grid item>
            <Typography variant="display1">
              {parseInt(total_customers, 10) || '-'}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {t('activity.totalCustomers')}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Grid item>
            <Grid container direction="row" spacing={8} alignItems="center">
              <Grid item>
                <Typography variant="display1" color="primary">
                  {parseInt(gross_volume, 10) || '-'}
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary">€</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="caption">
              {t('activity.grossVolume')}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          spacing={8}
        >
          <Grid item>
            <Grid container direction="row" spacing={8} alignItems="center">
              <Grid item>
                <Typography variant="display1">
                  {parseInt(average_fillrate * 100, 10) || '-'}
                </Typography>
              </Grid>
              <Grid item>%</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="caption">{t('activity.fillrate')}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

ActivityStats.defaultProps = {
  stats: {},
};

export default withStyles(styles)(translate()(ActivityStats));
