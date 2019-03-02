// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { push } from 'react-router-redux';
import i18next from 'i18next';

import { stats as statsActions } from '../../actions';
import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';
import withAsyncData from '../../hocs/with-async-data.hoc';

import MetaActivityList from '../../libs/meta-activity/MetaActivityList.component';

import type { MetaActivity, Stat } from '../../api/types';

type Props = {
  stats: Array<Stat>,
  metaActivities: Array<MetaActivity>,
  isCardView: boolean,
  loading: boolean,

  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
};

export function MetaActivityListPage(props: Props) {
  const { metaActivities, stats, loading, isCardView } = props;
  if (loading) {
    return <CircularProgress />;
  }
  if (!(metaActivities || []).length) {
    // TODO
    return null;
  }

  return (
    <MetaActivityList
      stats={stats}
      metaActivities={metaActivities}
      isCardView={isCardView}
      goToDetail={props.goToDetail}
      goToEdit={props.goToEdit}
    />
  );
}

export default compose(
  withNamespaces(),
  connect(
    (state) => ({
      metaActivities: state.metaActivity.all || [],
      stats: state.stats.activities.items,
      loading: state.stats.activities.loading,
    }),
    {
      fetchStats: statsActions.fetchStatActivities,
      goToDetail: (metaActivityId) => push(`/activity/${metaActivityId}`),
      goToEdit: (metaActivityId) => push(`/activity/${metaActivityId}/edit`),
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
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.metaActivityList')),
)(MetaActivityListPage);
