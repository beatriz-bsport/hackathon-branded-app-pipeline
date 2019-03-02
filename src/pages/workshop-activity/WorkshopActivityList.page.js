// @flow
//
import React from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';
import { push } from 'react-router-redux';

import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import type { MetaActivity } from '../../api/types';

import MetaActivityList from '../../libs/meta-activity/MetaActivityList.component';

type Props = {
  workshopActivities: Array<MetaActivity>,
  loading: boolean,
  isCardView: boolean,

  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
};

export function WorkshopActivityList(props: Props) {
  const { loading, isCardView, workshopActivities } = props;
  if (loading) {
    return <LinearProgress />;
  }
  return (
    <MetaActivityList
      metaActivities={workshopActivities}
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
      workshopActivities: state.workshopActivity.all,
      loading: state.workshopActivity.loading,
    }),
    {
      goToDetail: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}`),
      goToEdit: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/edit`),
    },
  ),
  withBottomButtons({
    addButton: {
      path: '/workshop-activity/add',
      text: i18next.t('workshopActivity.addWorkshopActivity'),
    },
    switchButton: true,
  }),
  withDrawer(({ t }) => t('appbar.title.workshopActivityList')),
)(WorkshopActivityList);
