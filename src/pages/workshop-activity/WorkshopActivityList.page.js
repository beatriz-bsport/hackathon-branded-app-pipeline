// @flow
//
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';

import withTitle from '../../hocs/with-title.hoc';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

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
  onCreate: () => void,

  t: TFunction,
  classes: Object,
};

export class WorkshopActivityList extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllWorkshops();
  }

  render() {
    return (
      <div className={this.props.classes.container}>
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
        <BottomActionsButton
          onCreateLabel={this.props.t('workshopActivity.addWorkshopActivity')}
          onCreate={this.props.onCreate}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing.unit * 16,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withTitle(({ t }) => t('titles:workshopActivity.workshopActivityList')),
  connect(
    (state) => ({
      workshopActivities: getEnabledWorkshops(state),
      loading: state.workshopActivity.loading || state.metaActivity.loading,
    }),
    {
      fetchAllWorkshops,
      onCreate: () => push('/workshop-activity/add'),
      deleteWorkshop,
      goToDetail: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}`),
      goToEdit: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/edit`),
    },
  ),
  withState('workshopToDelete', 'setWorkshopToDelete', null),
)(WorkshopActivityList);
