// @flow
import React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import { push } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

import FuzeSearch from '../../components/FuzeSearch.component';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import {
  getPageEnabledMetaActivities,
  getPageDisabledMetaActivities,
} from '../../libs/meta-activity/selectors';
import {
  deleteMetaActivity,
  restoreMetaActivity,
  fetchAllActivities as fetchAllMetactivitiesAction,
  makeActivityCopy as makeActivityCopyAction,
} from '../../libs/meta-activity/actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

import type { MetaActivity } from '../../api/types';
import withTitle from '../../hocs/with-title.hoc';
import { fetchFirstTimeNotifications as fetchNotifications } from '../../libs/booking/actions';
import { withBookingNotifications } from '../../libs/booking/selectors';

type Props = {
  metaActivities: Array<MetaActivity>,
  disabledMetaActivities: Array<MetaActivity>,
  loading: boolean,
  notificationLoading: boolean,

  fetchAllMetactivities: () => void,
  goToDetail: (metaActivityId: number) => void,
  goToEdit: (metaActivityId: number) => void,
  onCreate: () => void,
  deleteMetaActivity: (metaActivityId: number) => void,
  restoreMetaActivity: (MetaActivityId: number) => void,
  setActivityToDelete: (number) => void,
  activityToDelete: (?number) => void,
  fetchNotifications: (params?: Object) => void,

  t: TFunction,
  classes: Object,
  goToPaymentPack: (id: number) => void,

  makeActivityCopy: (
    id: number,
    suffix: string,
    options: OptionCallback,
  ) => void,
};

type State = {
  searchText: string,
  searchResult: Array<MetaActivity>,
  showDisabled: boolean,
};

export class MetaActivityListPage extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    showDisabled: false,
  };

  componentDidMount() {
    this.props.fetchAllMetactivities();
    this.props.fetchNotifications({ is_meta_activity_notification: true });
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

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
  };

  restoreMetaActivity = async (id: number) => {
    if (this.props.disabledMetaActivities.length === 1) {
      this.setState({ showDisabled: false });
    }
    this.props.restoreMetaActivity(id);
  };

  render() {
    const { classes, t } = this.props;

    if (
      (this.props.metaActivities || []).length +
        (this.props.disabledMetaActivities || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <IsEmptyList
          text={this.props.t('noActivities')}
          button={this.props.t('actions.addActivity')}
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('actions.addActivity')}
        />
      );
    }
    return (
      <div className={classes.container}>
        {this.props.loading || this.props.notificationLoading ? (
          <LinearProgress />
        ) : null}
        {this.props.metaActivities.length > 0 ? (
          <div className={classes.search}>
            <div className={classes.header}>
              <div className={classes.searchField}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={this.props.metaActivities}
                  placeholder={t('actions.search')}
                  searchFields={['name', 'description']}
                  searchResult={this.state.searchResult}
                />
              </div>
              <Hidden smDown>
                <Button
                  onClick={this.props.goToPaymentPack}
                  color="primary"
                  variant="outlined"
                >
                  <ArrowForwardIcon className={classes.leftIcon} />
                  {t('navigation.goToPaymentPack')}
                </Button>
              </Hidden>
            </div>
            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? classes.searchPaperDisplayed
                  : classes.searchPaperHiden
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
          makeActivityCopy={this.props.makeActivityCopy}
        />
        {(this.props.disabledMetaActivities || []).length ? (
          <div>
            <ButtonBase
              className={this.props.classes.buttonTitle}
              onClick={this.onShowDisabled}
            >
              <Typography
                variant="h5"
                component="h2"
                className={this.props.classes.titleContainer}
              >
                {`${t('metaActivity:disabledMetaActivities')} (${
                  (this.props.disabledMetaActivities || []).length
                })`}
              </Typography>

              {this.state.showDisabled ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ButtonBase>
            <Divider />
            <Collapse in={this.state.showDisabled}>
              <MetaActivityList
                metaActivities={this.props.disabledMetaActivities}
                goToDetail={this.props.goToDetail}
                goToEdit={this.props.goToEdit}
                deleteMetaActivity={this.props.setActivityToDelete}
                makeActivityCopy={this.props.makeActivityCopy}
                restoreMetaActivity={this.restoreMetaActivity}
              />
            </Collapse>
          </div>
        ) : null}

        <MetaActivityDeleteDialog
          metaActivityId={this.props.activityToDelete}
          onClose={() => this.props.setActivityToDelete(null)}
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={this.props.deleteMetaActivity}
        />
        <BottomActionButtons
          onCreateLabel={this.props.t('actions.addActivity')}
          onCreate={this.props.onCreate}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
  search: { marginBottom: theme.spacing(2) },
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
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchField: {
    flex: 1,
    marginRight: theme.spacing(1),
  },
  buttonTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['metaActivity', 'titles']),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:metaActivity.metaActivityList'),
  ),
  connect(
    (state) => ({
      metaActivities: withBookingNotifications(getPageEnabledMetaActivities)(
        state,
      ),
      disabledMetaActivities: getPageDisabledMetaActivities(state),
      loading: state.metaActivity.loading || state.metaActivity.delete.loading,
      notificationLoading: state.booking.notification.loading,
    }),
    {
      makeActivityCopy: makeActivityCopyAction,
      fetchAllMetactivities: fetchAllMetactivitiesAction,
      goToDetail: (metaActivityId) =>
        push(`/activity/${metaActivityId}/general`),
      goToEdit: (metaActivityId) => push(`/activity/${metaActivityId}/edit`),
      goToPaymentPack: () => push('/payment-pack'),
      deleteMetaActivity,
      restoreMetaActivity,
      fetchNotifications,
      onCreate: () => push('/activity/add'),
    },
  ),
  withHandlers({
    makeActivityCopy: ({ makeActivityCopy, fetchAllMetactivities }) => (
      id,
      suffix,
    ) => {
      makeActivityCopy(id, suffix, {
        onSuccess: () => fetchAllMetactivities({ customer_enabled: true }),
      });
    },
  }),
  withState('activityToDelete', 'setActivityToDelete', null),
)(MetaActivityListPage);
