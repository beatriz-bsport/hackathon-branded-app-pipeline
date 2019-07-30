// @flow
import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'react-router-redux';
import i18next from 'i18next';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import { getEnabledMetaActivities } from '../../libs/meta-activity/selectors';

import type { MetaActivity } from '../../api/types';

type Props = {
  metaActivities: Array<MetaActivity>,
  isCardView: boolean,
  loading: boolean,

  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
};

export function MetaActivityListPage(props: Props) {
  const { metaActivities, loading, isCardView } = props;
  if (loading) {
    return <LinearProgress />;
  }
  if (!(metaActivities || []).length) {
    // TODO
    return null;
  }

  return (
    <MetaActivityList
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
      metaActivities: getEnabledMetaActivities(state),
      loading: state.stats.activities.loading,
    }),
    {
      goToDetail: (metaActivityId) => push(`/activity/${metaActivityId}`),
      goToEdit: (metaActivityId) => push(`/activity/${metaActivityId}/edit`),
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/activity/add',
      text: i18next.t('activity.addActivity'),
    },
    switchButton: true,
  }),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.metaActivityList')),
)(MetaActivityListPage);
