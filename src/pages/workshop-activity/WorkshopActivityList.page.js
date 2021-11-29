// @flow
//
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { withTranslation, TFunction } from 'react-i18next';
import { compose, withHandlers, withState } from 'recompose';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import withTitle from '../../hocs/with-title.hoc';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import FuzeSearch from '../../components/FuzeSearch.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import type { MetaActivity } from '../../api/types';

import {
  getEnabledWorkshops,
  getDisabledWorkshops,
} from '../../libs/meta-activity/selectors';
import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import {
  deleteWorkshop,
  restoreMetaActivity,
  fetchAll as fetchAllWorkshopsAction,
  makeActivityCopy as makeActivityCopyAction,
} from '../../libs/meta-activity/actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';
import { fetchFirstTimeNotifications as fetchNotifications } from '../../libs/booking/actions';
import { withBookingNotifications } from '../../libs/booking/selectors';

type Props = {
  workshopActivities: Array<MetaActivity>,
  disabledWorkshopActivities: Array<MetaActivity>,
  loading: boolean,
  notificationLoading: boolean,

  fetchAllWorkshops: () => void,
  fetchNotifications: (params?: Object) => void,
  setWorkshopToDelete: (number) => void,
  workshopToDelete: ?number,
  deleteWorkshop: (number) => void,
  restoreMetaActivity: (id: number) => void,
  goToDetail: (metaActivityId: number) => void,
  goToPaymentPack: () => void,
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

type State = {
  searchText: string,
  searchResult: Array<MetaActivity>,
  showDisabled: boolean,
};

export class WorkshopActivityList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    showDisabled: false,
  };

  componentDidMount() {
    this.props.fetchAllWorkshops();
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
    if (this.props.disabledWorkshopActivities.length === 1) {
      this.setState({ showDisabled: false });
    }
    this.props.restoreMetaActivity(id);
  };

  render() {
    const { classes, t } = this.props;

    if (
      (this.props.workshopActivities || []).length +
        (this.props.disabledWorkshopActivities || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <IsEmptyList
          text={this.props.t('noWorkshops')}
          button={this.props.t('actions.addWorkshopActivity')}
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('actions.addWorkshopActivity')}
        />
      );
    }
    return (
      <div className={classes.container}>
        {this.props.loading || this.props.notificationLoading ? (
          <LinearProgress />
        ) : null}
        {this.props.workshopActivities.length > 0 ? (
          <div className={this.props.classes.search}>
            <div className={classes.header}>
              <div className={classes.searchField}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={this.props.workshopActivities}
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
        {(this.props.disabledWorkshopActivities || []).length ? (
          <div>
            <ButtonBase
              className={this.props.classes.buttonTitle}
              onClick={this.onShowDisabled}
            >
              <Typography
                variant="h5"
                className={this.props.classes.titleContainer}
              >
                {`${t('workshop:disabledWorkshops')} (${
                  (this.props.disabledWorkshopActivities || []).length
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
                metaActivities={this.props.disabledWorkshopActivities}
                goToDetail={this.props.goToDetail}
                goToEdit={this.props.goToEdit}
                deleteMetaActivity={this.props.setWorkshopToDelete}
                restoreMetaActivity={this.restoreMetaActivity}
                makeActivityCopy={this.props.makeActivityCopy}
              />
            </Collapse>
          </div>
        ) : null}

        <WorkshopDeleteDialog
          workshopId={this.props.workshopToDelete}
          onClose={() => this.props.setWorkshopToDelete(null)}
          canDeleteWorkshopChecker={canDeleteMetaActivityAPI}
          deleteWorkshop={this.props.deleteWorkshop}
        />
        <BottomActionsButton
          onCreateLabel={this.props.t('actions.addWorkshopActivity')}
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
  leftIcon: {
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
  withTranslation(['workshop', 'titles']),
  withTitle(({ t }) => t('titles:workshopActivity.workshopActivityList')),
  connect(
    (state) => ({
      workshopActivities: withBookingNotifications(getEnabledWorkshops)(state),
      disabledWorkshopActivities: getDisabledWorkshops(state),
      loading: state.metaActivity.loading,
      notificationLoading: state.booking.notification.loading,
    }),
    {
      fetchAllWorkshops: fetchAllWorkshopsAction,
      makeActivityCopy: makeActivityCopyAction,
      onCreate: () => push('/workshop-activity/add'),
      goToPaymentPack: () => push('/payment-pack'),
      deleteWorkshop,
      restoreMetaActivity,
      fetchNotifications,
      goToDetail: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/general`),
      goToEdit: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/edit`),
    },
  ),
  withHandlers({
    makeActivityCopy:
      ({ makeActivityCopy, fetchAllWorkshops }) =>
      (id, suffix) => {
        makeActivityCopy(id, suffix, { onSuccess: fetchAllWorkshops });
      },
  }),
  withState('workshopToDelete', 'setWorkshopToDelete', null),
)(WorkshopActivityList);
