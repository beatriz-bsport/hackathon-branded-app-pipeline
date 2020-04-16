// @flow
//
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withHandlers, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import withTitle from '../../hocs/with-title.hoc';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import FuzeSearch from '../../components/FuzeSearch.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import type { MetaActivity } from '../../api/types';

import { getEnabledWorkshops } from '../../libs/meta-activity/selectors';
import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import {
  deleteWorkshop,
  fetchAll as fetchAllWorkshopsAction,
  makeActivityCopy as makeActivityCopyAction,
} from '../../libs/meta-activity/actions';
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
  makeActivityCopy: (
    id: number,
    suffix: string,
    options?: OptionCallback,
  ) => void,

  t: TFunction,
  classes: Object,
};

export class WorkshopActivityList extends React.Component<Props> {
  state = {
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchAllWorkshops();
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
        {this.props.workshopActivities.length > 0 ? (
          <div className={this.props.classes.search}>
            <FuzeSearch
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              items={this.props.workshopActivities}
              placeholder={t('workshop:search')}
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
                  deleteMetaActivity={this.props.setWorkshopToDelete}
                />
              </Collapse>
            </Paper>
          </div>
        ) : null}
        <MetaActivityList
          metaActivities={this.props.workshopActivities}
          goToDetail={this.props.goToDetail}
          goToEdit={this.props.goToEdit}
          deleteMetaActivity={this.props.setWorkshopToDelete}
          makeActivityCopy={this.props.makeActivityCopy}
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
  withTitle(({ t }) => t('titles:workshopActivity.workshopActivityList')),
  connect(
    (state) => ({
      workshopActivities: getEnabledWorkshops(state),
      loading: state.metaActivity.loading,
    }),
    {
      fetchAllWorkshops: fetchAllWorkshopsAction,
      makeActivityCopy: makeActivityCopyAction,
      onCreate: () => push('/workshop-activity/add'),
      deleteWorkshop,
      goToDetail: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/general`),
      goToEdit: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/edit`),
    },
  ),
  withHandlers({
    makeActivityCopy: ({ makeActivityCopy, fetchAllWorkshops }) => (
      id,
      suffix,
    ) => {
      makeActivityCopy(id, suffix, { onSuccess: fetchAllWorkshops });
    },
  }),
  withState('workshopToDelete', 'setWorkshopToDelete', null),
)(WorkshopActivityList);
