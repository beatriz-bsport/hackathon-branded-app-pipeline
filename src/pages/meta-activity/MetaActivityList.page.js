// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import { push } from 'react-router-redux';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import { getPageEnabledMetaActivities } from '../../libs/meta-activity/selectors';
import {
  deleteMetaActivity,
  fetchAllActivities as fetchAllMetactivities,
} from '../../libs/meta-activity/actions/meta-activity.actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

import type { MetaActivity } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  metaActivities: Array<MetaActivity>,
  loading: boolean,

  fetchAllMetactivities: () => void,
  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
  onCreate: () => void,
  deleteMetaActivity: (metaActivityId: number) => void,
  setActivityToDelete: (number) => void,
  activityToDelete: (?number) => void,

  t: TFunction,
  classes: Object,
};

export class MetaActivityListPage extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchAllMetactivities();
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        <MetaActivityList
          metaActivities={this.props.metaActivities}
          goToDetail={this.props.goToDetail}
          goToEdit={this.props.goToEdit}
          deleteMetaActivity={this.props.setActivityToDelete}
        />
        <MetaActivityDeleteDialog
          metaActivityId={this.props.activityToDelete}
          onClose={() => this.props.setActivityToDelete(null)}
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={this.props.deleteMetaActivity}
        />
        <BottomActionButtons
          onCreateLabel={this.props.t('activity.addActivity')}
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
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:metaActivity.metaActivityList'),
  ),
  connect(
    (state) => ({
      metaActivities: getPageEnabledMetaActivities(state),
      loading:
        state.stats.activities.loading ||
        state.metaActivity.loading ||
        state.metaActivity.delete.loading,
    }),
    {
      fetchAllMetactivities,
      goToDetail: (metaActivityId) => push(`/activity/${metaActivityId}`),
      goToEdit: (metaActivityId) => push(`/activity/${metaActivityId}/edit`),
      deleteMetaActivity,
      onCreate: () => push('/activity/add'),
    },
  ),
  withState('activityToDelete', 'setActivityToDelete', null),
)(MetaActivityListPage);
