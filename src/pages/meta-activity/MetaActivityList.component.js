// @flow

import React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { translate } from 'react-i18next';

import { Grid } from '@material-ui/core';

import i18next from 'i18next';
import withAsyncData from '../../hocs/with-async-data.hoc';
import { MetaActivityCard } from '../../components';
import { stats as statsActions } from '../../actions';
import type { MetaActivity, Stat } from '../../api/types';

import withBottomButtons from '../../hocs/inject-bottom-buttons';

import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  stats: Array<Stat>,
  metaActivities: Array<MetaActivity>,
};

export function Activity(props: Props) {
  return (
    <Grid container direction="row" spacing={24}>
      {props.metaActivities.map((a) => {
        const aStats = (props.stats || []).filter((s) => s.id === a.id);
        const s = aStats || [{}];
        return (
          <Grid item xs={12} sm={6} key={a.id}>
            <MetaActivityCard metaActivity={a} stats={s[0]} />
          </Grid>
        );
      })}
    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    metaActivities: state.metaActivity.all || [],
    stats: state.stats.activities.items,
    loading: state.stats.activities.loading,
  };
}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    {
      fetchStats: statsActions.fetchStatActivities,
    },
  ),
  withAsyncData('fetchStats', 'loading'),
  withBottomButtons({
    addButton: {
      path: '/meta-activity/add',
      text: i18next.t('activity.addActivity'),
    },
  }),
)(withDrawer('metaActivityList')(Activity));
