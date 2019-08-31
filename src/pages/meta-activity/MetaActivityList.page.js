// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push } from 'react-router-redux';
import i18next from 'i18next';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import { getEnabledMetaActivities } from '../../libs/meta-activity/selectors';
import { deleteMetaActivity } from '../../libs/meta-activity/actions/meta-activity.actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

import type { MetaActivity } from '../../api/types';

type Props = {
  metaActivities: Array<MetaActivity>,
  isCardView: boolean,
  loading: boolean,

  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
  deleteMetaActivity: (metaActivityId: number) => void,
  setActivityToDelete: (number) => void,
  activityToDelete: (?number) => void,
};

export const MetaActivityListPage = (props: Props) => (
  <div>
    {props.loading ? <LinearProgress /> : null}
    <MetaActivityList
      metaActivities={props.metaActivities}
      isCardView={props.isCardView}
      goToDetail={props.goToDetail}
      goToEdit={props.goToEdit}
      deleteMetaActivity={props.setActivityToDelete}
    />
    <MetaActivityDeleteDialog
      metaActivityId={props.activityToDelete}
      onClose={() => props.setActivityToDelete(null)}
      canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
      deleteMetaActivity={props.deleteMetaActivity}
    />
  </div>
);

export default compose(
  withNamespaces(),
  connect(
    (state) => ({
      metaActivities: getEnabledMetaActivities(state),
      loading:
        state.stats.activities.loading ||
        state.metaActivity.loading ||
        state.metaActivity.delete.loading,
    }),
    {
      goToDetail: (metaActivityId) => push(`/activity/${metaActivityId}`),
      goToEdit: (metaActivityId) => push(`/activity/${metaActivityId}/edit`),
      deleteMetaActivity,
    },
  ),
  withState('activityToDelete', 'setActivityToDelete', null),
  withBottomButtons({
    addButton: {
      path: '/activity/add',
      text: i18next.t('activity.addActivity'),
    },
    switchButton: true,
  }),
  withDrawer(({ t }: { t: TFunction }) => t('appbar.title.metaActivityList')),
)(MetaActivityListPage);
