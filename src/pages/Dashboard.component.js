import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  CircularProgress,
  Paper,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';

import { translate } from 'react-i18next';

export class Dashboard extends Component {
  state = {};

  renderStatCard = ({ name, old_stat, new_stat }) => {
    const { classes } = this.props;

    const evolutionPercent = parseInt(new_stat / old_stat * 100, 10);
    const positiveEvolution = new_stat >= old_stat;
    const evolutionColor = positiveEvolution ? 'primary' : 'error';
    const formattedEvolutionPercent = isFinite(evolutionPercent)
      ? `${positiveEvolution ? '+' : ''}${evolutionPercent}%`
      : ' - ';

    return (
      <Paper className={classes.statPaper}>
        <Grid container direction="column" alignItems="center" spacing={8}>
          <Grid item style={{ marginLeft: 80 }}>
            <Grid container direction="row" justify="space-between" spacing={8}>
              <Grid item>
                <Typography variant="title">
                  {formattedEvolutionPercent}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography color={evolutionColor} variant="display3">
              {new_stat}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subheading">{name}</Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  renderWeekStat = () => {
    const { t, classes, stats } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography variant="display1">{t('dashboard.thisWeek')}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16}>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.newMembers'),
                old_stat: stats.previous_week.new_members,
                new_stat: stats.current_week.new_members,
              })}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.turnover'),
                old_stat: stats.previous_week.turnover,
                new_stat: stats.current_week.turnover,
              })}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.nbOffers'),
                old_stat: stats.previous_week.offers,
                new_stat: stats.current_week.offers,
              })}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.nbBookings'),
                old_stat: stats.previous_week.bookings,
                new_stat: stats.current_week.bookings,
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  renderMonthStat = () => {
    const { t, classes, stats } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          <Typography variant="display1">{t('dashboard.thisMonth')}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16}>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.newMembers'),
                old_stat: stats.previous_month.new_members,
                new_stat: stats.current_month.new_members,
              })}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.turnover'),
                old_stat: stats.previous_month.turnover,
                new_stat: stats.current_month.turnover,
              })}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.nbOffers'),
                old_stat: stats.previous_month.offers,
                new_stat: stats.current_month.offers,
              })}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {this.renderStatCard({
                name: t('dashboard.nbBookings'),
                old_stat: stats.previous_month.bookings,
                new_stat: stats.current_month.bookings,
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { loading, stats } = this.props;

    // FIXME set loading on all reducers state at logoff
    if (loading || !stats.previous_week) {
      return <CircularProgress />;
    }
    return (
      <Grid container direction="column" spacing={24}>
        <Grid item xs={12}>
          {this.renderWeekStat()}
        </Grid>
        <Grid item xs={12}>
          {this.renderMonthStat()}
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    stats: state.stats.dashboard,
    loading: state.stats.dashboardLoading,
  };
}

const styles = (theme) => ({
  container: {},
  statPaper: {
    padding: theme.spacing.unit * 3,
  },
});

export default translate()(
  connect(mapStateToProps)(withStyles(styles)(Dashboard)),
);
