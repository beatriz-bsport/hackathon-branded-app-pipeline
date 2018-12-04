// @flow
import React, { Component } from 'react';
import { CircularProgress, Grid, withStyles, Button } from '@material-ui/core';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';

import { MetaActivityCard } from '../../components';
import { stats as statsActions } from '../../actions';
import type { MetaActivity, Stat } from '../../api/types';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

type Props = {
  // fetchStats: () => void,
  is_manager: boolean,
  classes: Object,
  t: (x: string) => string,
  stats: Array<Stat>,
  metaActivities: Array<MetaActivity>,
  loading: boolean,
};

class Activity extends Component<Props> {
  componentDidMount() {
    this.props.fetchStats();
  }

  render() {
    const {
      is_manager,
      classes,
      t,
      loading,
      metaActivities,
      stats,
    } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    return (
      <Grid container justify="center" alignItems="center" spacing={32}>
        <Grid item>
          <Grid container direction="row" spacing={24}>
            {metaActivities.map((a) => {
              const aStats = (stats || []).filter((s) => s.id === a.id);
              const s = aStats || [{}];
              return (
                <Grid item xs={12} sm={6} key={a.id}>
                  <MetaActivityCard metaActivity={a} stats={s[0]} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        {is_manager ? (
          <Grid item>
            <Link to="/meta-activity/add" style={{ textDecoration: 'none' }}>
              <Button
                variant="extendedFab"
                aria-label="Add"
                className={classes.button}
                color="primary"
              >
                <AddIcon className={classes.extendedIcon} />
                {t('activity.addActivity')}
              </Button>
            </Link>
          </Grid>
        ) : null}
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    metaActivities: state.metaActivity.all,
    stats: state.stats.activities.items,
    is_manager: state.auth.is_manager,
    loading: state.activity.loading,
  };
}

export default translate()(
  connect(
    mapStateToProps,
    { fetchStats: statsActions.fetchStatActivities },
  )(withStyles(styles)(translate()(Activity))),
);
