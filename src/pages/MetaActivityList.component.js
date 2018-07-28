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
    const { metaActivities, stats } = this.props;
    return (
      <Grid container direction="row" spacing={24}>
        {metaActivities.map((a) => {
          const aStats = stats.filter((s) => s.id === a.id);
          const s = aStats || [null];
          return (
            <Grid item xs={12} sm={6} key={a.id}>
              <ActivityCard activity={a} stats={s[0]} />
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    metaActivities: state.metaActivity.all,
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

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(Activity),
);
