// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Paper, List, Grid } from '@material-ui/core';
import i18next from 'i18next';

import { stats as statsActions } from '../../actions';
import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';
import withAsyncData from '../../hocs/with-async-data.hoc';

import MetaActivityListItem from '../../libs/meta-activity/list/MetaActivityListItem.component';
import MetaActivityCard from '../../libs/meta-activity/list/MetaActivityCard.component';

import type { MetaActivity, Stat } from '../../api/types';

type Props = {
  stats: Array<Stat>,
  metaActivities: Array<MetaActivity>,
  isCardView: boolean,
};

export function Activity(props: Props) {
  const { metaActivities, stats, isCardView } = props;
  if (!metaActivities.length) {
    // TODO
    return null;
  }

  if (isCardView) {
    return (
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
    );
  }
  return (
    <Paper>
      <List disablePadding>
        {metaActivities.map((ma) => (
          <MetaActivityListItem divider metaActivity={ma} />
        ))}
      </List>
    </Paper>
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
      path: '/activity/add',
      text: i18next.t('activity.addActivity'),
    },
    switchButton: true,
  }),
)(withDrawer('metaActivityList')(Activity));
