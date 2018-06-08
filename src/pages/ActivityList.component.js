import React, { Component } from 'react';
import { Grid, withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { GreatFilter, ActivityCard } from '../components';
import { stats as statsActions } from '../actions';

type Props = {};

class Activity extends Component<Props> {
  componentDidMount() {
    this.props.fetchStats();
  }

  render() {
    const { activities, stats } = this.props;
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="center"
        spacing={24}
      >
        <Grid item>
          <GreatFilter />
        </Grid>
        <Grid item>
          <Grid container spacing={24}>
            {activities.map((a) => {
              const aStats = stats.filter((s) => s.id === a.id);
              const s = aStats || [null];
              return (
                <Grid item xs={12} sm={6} md={4} key={a.id}>
                  <ActivityCard activity={a} stats={s[0]} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activity.all,
    stats: state.stats.activities,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchStats() {
      dispatch(statsActions.fetchActivities());
    },
  };
}

export default withStyles()(
  translate()(connect(mapStateToProps, mapDispatchToProps)(Activity)),
);
