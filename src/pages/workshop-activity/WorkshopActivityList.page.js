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
import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import {
  deleteWorkshop,
  fetchAll as fetchAllWorkshops,
} from '../../libs/meta-activity/actions/workshop-activity.actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

type Props = {
  workshopActivities: Array<MetaActivity>,
  loading: boolean,

  fetchAllWorkshops: () => void,
  setWorkshopToDelete: (number) => void,
  workshopToDelete: ?number,
  deleteWorkshop: (number) => void,
  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
};

export class WorkshopActivityList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllWorkshops();
  }

  render() {
    return (
      <div>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityList
          metaActivities={this.props.workshopActivities}
          goToDetail={this.props.goToDetail}
          goToEdit={this.props.goToEdit}
          deleteMetaActivity={this.props.setWorkshopToDelete}
        />
        <WorkshopDeleteDialog
          workshopId={this.props.workshopToDelete}
          onClose={() => this.props.setWorkshopToDelete(null)}
          canDeleteWorkshopChecker={canDeleteMetaActivityAPI}
          deleteWorkshop={this.props.deleteWorkshop}
        />
      </div>
    );
  }
}

export default compose(
  withNamespaces(),
  connect(
    (state) => ({
      workshopActivities: getEnabledWorkshops(state),
      loading: state.workshopActivity.loading || state.metaActivity.loading,
    }),
    {
      fetchAllWorkshops,
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
  }),
  withDrawer(({ t }) => t('appbar.title.workshopActivityList')),
)(WorkshopActivityList);
