// @flow
//
import React from 'react';
import { connect } from 'react-redux';
import { goBack, push } from 'connected-react-router';
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
import { CoachPaymentRuleByKindSelector } from '../../libs/coach-payment-rules/selectors';
import themeSelectors from '../../libs/theme/selectors';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import FuzeSearch from '../../components/FuzeSearch.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import type { MetaActivity } from '../../api/types';

import {
  getActivityCompatiblePaymentPacks,
  getAllPaymentPackCategory,
} from '../../libs/payment-packs/selectors';
import {
  getEnabledMetaActivities,
  getEnabledWorkshops,
  getMetaActivityCategories,
  getDisabledWorkshops,
} from '../../libs/meta-activity/selectors';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import {
  fetchAllOffers as fetchAllOffersActions,
  createOffers as createOffersActions,
} from '../../libs/offer/actions';

import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  createOrUpdate as createOrUpdatePaymentPack,
} from '../../libs/payment-packs/actions';
import { getAvailableRoomBlueprints } from '../../libs/spot-scheduling/selector';

import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import { getAllTagsWithTagGroup } from '../../libs/tag/selectors';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#libs/level/selectors';

import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#libs/level/actions';

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import MetaActivityCreate from '../../libs/meta-activity/components/MetaActivityCreate.drawer';

import {
  deleteWorkshop,
  restoreMetaActivity,
  fetchMetaActivities as fetchMetaActivitiesAction,
  makeActivityCopy as makeActivityCopyAction,
  upsert,
} from '../../libs/meta-activity/actions';

import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import { fetchRoomBlueprints } from '../../libs/spot-scheduling/actions';
import { fetchAllCoachPaymentRules } from '../../libs/coach-payment-rules/actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';
import { fetchFirstTimeNotifications as fetchNotifications } from '../../libs/booking/actions';
import { withBookingNotifications } from '../../libs/booking/selectors';

type Props = {
  workshopActivities: Array<MetaActivity>,
  disabledWorkshopActivities: Array<MetaActivity>,
  loading: boolean,
  notificationLoading: boolean,

  fetchNotifications: (params?: Object) => void,
  setWorkshopToDelete: (number) => void,
  workshopToDelete: ?number,
  deleteWorkshop: (number) => void,
  restoreMetaActivity: (id: number) => void,
  goToDetail: (metaActivityId: number) => void,
  goToPaymentPack: () => void,
  goToEdit: (metaActivityId: number) => void,
  makeActivityCopy: (
    id: number,
    suffix: string,
    options?: OptionCallback,
  ) => void,

  t: TFunction,
  classes: Object,
  loading: ?boolean,
  classes: Object,

  associatedCoaches: *[],
  establishments: Array<Establishment>,
  SCTs: *[],

  metaActivitiesAndWorkshops: Array<MetaActivity>,
  upsertedWorkshop: ?MetaActivity,

  offerHadError: ?Error,
  createOffers: () => void,
  offerIsProcessing: boolean,
  goToWorkshop: (id: number) => void,
  fetchEstablishments: () => void,
  fetchAssociatedCoachesList: () => void,

  t: TFunction,
  companyTheme: CompanyTheme,
  fetchRoomBlueprints: () => void,
  roomBlueprints: Array<RoomBlueprint>,
  fetchAllCoachPaymentRules: () => void,
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> },
  paymentPackCategories: Array<PaymentPackCategory>,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,
  showPartnership: boolean,

  activeCustomLevels: Level[],
  allCustomLevels: Level[],
  createOffers: (data: Offer, options: OptionCallback) => void,
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void,
  updateLevel: (id: number, data: Level, options: OptionCallback) => void,
  createLevel: (data: Level, options?: OptionCallback<Level>) => void,
  deleteLevel: (id: number, options?: OptionCallback) => void,
  companyId: number,
  metaActivityNames: any,
  coaches: any,
  compatiblePaymentPacks: any,
  allEstablishmentList: any,
  categoryList: any,
  metaActivityCategories: Array<MetaActivityCategoryWithActivities>,
  fetchPaymentPacks: () => void,
  createPass: any,
  upsertWorkshopActivity: any,
  resetPaymentPacks: () => void,
  fetchAllOffers: any,
  fetchAllActivities: (data: { customer_enabled: true }) => void,
  fetchMetactivities: () => void,
  goToPaymentPackCreate: () => void,
  fetchAllPaymentPackCategory: () => void,
  createOrUpdatePaymentPackAction: (data: any, options: any) => void,
  fetchAllMetaActivityCategory: (companyId?: number) => void,
  upsertMetaActivity: any,
};

type State = {
  searchText: string,
  searchResult: Array<MetaActivity>,
  showDisabled: boolean,
  formIsOpen: Boolean,
};

export class WorkshopActivityList extends React.Component<Props, State> {
  state = {
    searchText: '',
    searchResult: [],
    showDisabled: false,
    formIsOpen: false,
  };

  componentDidMount() {
    this.props.fetchAllActivities();
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

  onCancelForm = () => {
    this.setState({ formIsOpen: false });
  };

  renderCreateWorkshopActivity = () => {
    return (
      <MetaActivityCreate
        isWorkshop
        onClose={this.onCancelForm}
        offerIsProcessing={this.props.offerIsProcessing}
        offerHadError={this.props.offerHadError}
        associatedCoaches={this.props.associatedCoaches}
        establishments={this.props.establishments}
        SCTs={this.props.SCTs}
        metaActivityNames={this.props.metaActivityNames}
        metaActivitiesAndWorkshops={this.props.metaActivitiesAndWorkshops}
        upsertedWorkshop={this.props.upsertedWorkshop}
        coaches={this.props.coaches}
        companyTheme={this.props.companyTheme}
        compatiblePaymentPacks={this.props.compatiblePaymentPacks}
        roomBlueprints={this.props.roomBlueprints}
        coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
        allEstablishmentList={this.props.allEstablishmentList}
        allTagsWithTagGroup={this.props.allTagsWithTagGroup}
        paymentPackCategories={this.props.paymentPackCategories}
        categoryList={this.props.categoryList}
        showPartnership={this.props.showPartnership}
        metaActivityCategories={this.props.metaActivityCategories}
        activeCustomLevels={this.props.activeCustomLevels}
        allCustomLevels={this.props.allCustomLevels}
        companyId={this.props.companyId}
        fetchEstablishments={this.props.fetchEstablishments}
        fetchAssociatedCoachesList={this.props.fetchAssociatedCoachesList}
        fetchPaymentPacks={this.props.fetchPaymentPacks}
        upsertMetaActivity={this.props.upsertMetaActivity}
        resetPaymentPacks={this.props.resetPaymentPacks}
        goToMetaActivity={this.props.goToWorkshop}
        goToPaymentPackCreate={this.props.goToPaymentPackCreate}
        // goToPaymentPack: (id: number) => push(`/payment-pack/${id}`)
        fetchAllOffers={this.props.fetchAllOffers}
        fetchRoomBlueprints={this.props.fetchRoomBlueprints}
        fetchAllCoachPaymentRules={this.props.fetchAllCoachPaymentRules}
        fetchAllActivities={this.props.fetchAllActivities}
        fetchMetactivities={this.props.fetchMetactivities}
        fetchAllPaymentPackCategory={this.props.fetchAllPaymentPackCategory}
        createOrUpdatePaymentPackAction={
          this.props.createOrUpdatePaymentPackAction
        }
        fetchAllMetaActivityCategory={this.props.fetchAllMetaActivityCategory}
        createOffers={this.props.createOffers}
        fetchLevelList={this.props.fetchLevelList}
        updateLevel={this.props.updateLevel}
        createLevel={this.props.createLevel}
        deleteLevel={this.props.deleteLevel}
        upsertWorkshopActivity={this.props.upsertWorkshopActivity}
        createPass={this.props.createPass}
        goToWorkshop={this.props.goToWorkshop}
      />
    );
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
        <div>
          <IsEmptyList
            text={this.props.t('noWorkshops')}
            button={this.props.t('actions.addWorkshopActivity')}
            onCreateLabel={this.props.t('actions.addWorkshopActivity')}
            onCreate={() => {
              this.setState({ formIsOpen: true });
            }}
          />
          {!!this.state.formIsOpen && this.renderCreateWorkshopActivity()}
        </div>
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
                {`${t('disabledWorkshops')} (${
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
          onCreate={() => {
            this.setState({ formIsOpen: true });
          }}
        />
        {this.state.formIsOpen ? this.renderCreateWorkshopActivity() : ''}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing(2),
    paddingBottom: theme.spacing(16),
  },
  search: { marginBottom: theme.spacing(2) },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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

  withTranslation(['workshop']),
  connect(
    (state) => ({
      workshopActivities: withBookingNotifications(getEnabledWorkshops)(state),
      disabledWorkshopActivities: getDisabledWorkshops(state),
      loading: state.metaActivity.loading,
      notificationLoading: state.booking.notification.loading,
      // from WorkshopActivityCreate now
      offerIsProcessing: state.offer.create.loading,
      offerHadError: state.offer.create.error,
      associatedCoaches: getActiveCoaches(state),
      establishments: getAllEstablishments(state),
      SCTs: state.category.SCTs,
      companyTheme: themeSelectors.getTheme(state),
      metaActivityNames: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ].map((ma) => ma.name),
      metaActivitiesAndWorkshops: [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
      ],
      compatiblePaymentPacks: {
        items: getActivityCompatiblePaymentPacks(state),
        count: state.paymentPack.byActivity.count,
        page: state.paymentPack.byActivity.page,
        loading: state.paymentPack.byActivity.loading,
      },
      upsertedWorkshop: state.metaActivity.upsert.data,
      roomBlueprints: getAvailableRoomBlueprints(state),
      coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
      paymentPackCategories: getAllPaymentPackCategory(state),
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      showPartnership: state.theme.theme.has_partnership,
      metaActivityCategories: getMetaActivityCategories(state),
      activeCustomLevels: getActiveCustomLevels(state),
      allCustomLevels: getAllCustomLevels(state),
      companyId: state.theme.theme.company,
    }),
    {
      fetchAllActivities: fetchMetaActivitiesAction,
      makeActivityCopy: makeActivityCopyAction,
      goToPaymentPack: () => push('/payment-pack'),
      deleteWorkshop,
      restoreMetaActivity,
      fetchNotifications,
      goToDetail: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/general`),
      goToEdit: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/edit`),
      upsertWorkshopActivity: upsert,
      goToPreviousPage: goBack,
      goToWorkshop: (id: number) => push(`/workshop-activity/${id}/general`),
      fetchPaymentPacks: fetchActivityCompatiblePaymentPacksAction,
      createPass: createOrUpdatePaymentPack,
      fetchAllOffers: fetchAllOffersActions,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchRoomBlueprints,
      createOrUpdatePaymentPackAction: createOrUpdatePaymentPack,

      fetchAllCoachPaymentRules,
      createOffers: createOffersActions,
      fetchLevelList: fetchLevelListAction,
      updateLevel: updateLevelAction,
      createLevel: createLevelAction,
      deleteLevel: deleteLevelAction,
    },
  ),
  withHandlers({
    makeActivityCopy:
      ({ makeActivityCopy, fetchMetaActivities }) =>
      (id, suffix) => {
        makeActivityCopy(id, suffix, { onSuccess: fetchMetaActivities });
      },
  }),
  withState('workshopToDelete', 'setWorkshopToDelete', null),
)(WorkshopActivityList);
