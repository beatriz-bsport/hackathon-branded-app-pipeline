// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import { push } from 'react-router-redux';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';

import FuzeSearch from '../../components/FuzeSearch.component';

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

export class MetaActivityListPage extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchAllMetactivities();
  }

  changeSearch = (fuse) => (ev) => {
    this.setState({
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  render() {
    const { classes, t } = this.props;

    return (
      <div className={classes.container}>
        {this.props.loading ? <LinearProgress /> : null}
        {this.props.metaActivities.length > 0 ? (
          <div className={this.props.classes.search}>
            <FuzeSearch
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              items={this.props.metaActivities}
              placeHolder={t('metaActivity:search')}
              searchFields={['name', 'description']}
              searchResult={this.state.searchResult}
            />
            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? this.props.classes.searchPaperDisplayed
                  : this.props.classes.searchPaperHiden
              }
            >
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <MetaActivityList
                  metaActivities={this.state.searchResult}
                  goToDetail={this.props.goToDetail}
                  goToEdit={this.props.goToEdit}
                  deleteMetaActivity={this.props.setActivityToDelete}
                />
              </Collapse>
            </Paper>
          </div>
        ) : null}
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
  search: { marginBottom: theme.spacing.unit * 2 },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
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
      loading: state.metaActivity.loading || state.metaActivity.delete.loading,
    }),
    {
      fetchAllMetactivities,
      goToDetail: (metaActivityId) =>
        push(`/activity/${metaActivityId}/general`),
      goToEdit: (metaActivityId) => push(`/activity/${metaActivityId}/edit`),
      deleteMetaActivity,
      onCreate: () => push('/activity/add'),
    },
  ),
  withState('activityToDelete', 'setActivityToDelete', null),
)(MetaActivityListPage);
