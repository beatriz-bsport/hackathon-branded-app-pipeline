// @flow
//
import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { push } from 'react-router-redux';

import { withNamespaces } from 'react-i18next';
import { compose, withState } from 'recompose';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import type { MetaActivity } from '../../api/types';

import { getEnabledWorkshops } from '../../libs/meta-activity/selectors';
import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import WorkshopConfirmDeleteDialog from '../../libs/meta-activity/components/WorkshopConfirmDeleteDialog.component';
import { deleteWorkshop } from '../../libs/meta-activity/actions/workshop-activity.actions';

type Props = {
  workshopActivities: Array<MetaActivity>,
  loading: boolean,
  isCardView: boolean,

  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
};

export function WorkshopActivityList(props: Props) {
  const { loading, isCardView, workshopActivities } = props;
  return (
    <div>
      {loading ? <LinearProgress /> : null}
      <MetaActivityList
        metaActivities={workshopActivities}
        isCardView={isCardView}
        goToDetail={props.goToDetail}
        goToEdit={props.goToEdit}
        deleteMetaActivity={props.setWorkshopToDelete}
      />
      <WorkshopConfirmDeleteDialog
        open={!!props.workshopToDelete}
        onClose={() => props.setWorkshopToDelete(null)}
        onSubmit={() => {
          props.setWorkshopToDelete(null);
          props.deleteWorkshop(props.workshopToDelete);
        }}
      />
    </div>
  );
}

export default compose(
  withNamespaces(),
  connect(
    (state) => ({
      workshopActivities: getEnabledWorkshops(state),
      loading: state.workshopActivity.loading,
    }),
    {
      deleteWorkshop,
      goToDetail: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}`),
      goToEdit: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/edit`),
    },
  ),
  withState('workshopToDelete', 'setWorkshopToDelete', null),
  withBottomButtons({
    addButton: {
      path: '/workshop-activity/add',
      text: i18next.t('workshopActivity.addWorkshopActivity'),
    },
    switchButton: true,
  }),
  withDrawer(({ t }) => t('appbar.title.workshopActivityList')),
)(WorkshopActivityList);
