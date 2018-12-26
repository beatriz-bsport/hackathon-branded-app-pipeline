// @flow

import React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import AddIcon from '@material-ui/icons/Add';
import { Grid, withStyles, Button } from '@material-ui/core';

import withAsyncData from '../../hocs/with-async-data.hoc';
import { MetaActivityCard } from '../../components';
import { stats as statsActions } from '../../actions';
import type { MetaActivity, Stat } from '../../api/types';

type Props = {
  // fetchStats: () => void,
  is_manager: boolean,
  classes: Object,
  t: TFunction,
  stats: Array<Stat>,
  metaActivities: Array<MetaActivity>,
  goToCreateActivity: () => void,
};

export function Activity(props: Props) {
  const { is_manager, classes, t, metaActivities, stats } = props;
  return (
    <div>
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
      {is_manager ? (
        <Button
          variant="extendedFab"
          aria-label="Add"
          className={classes.button}
          color="primary"
          onClick={props.goToCreateActivity}
        >
          <AddIcon className={classes.extendedIcon} />
          {t('activity.addActivity')}
        </Button>
      ) : null}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    metaActivities: state.metaActivity.all || [],
    stats: state.stats.activities.items,
    is_manager: state.auth.is_manager,
    loading: state.stats.activities.loading,
  };
}

const styles = (theme) => ({
  button: {
    position: 'fixed',
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  translate(),
  connect(
    mapStateToProps,
    {
      fetchStats: statsActions.fetchStatActivities,
      goToCreateActivity: () => push('/meta-activity/add'),
    },
  ),
  withAsyncData('fetchStats', 'loading'),
)(Activity);
