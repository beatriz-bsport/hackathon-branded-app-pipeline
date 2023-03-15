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
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events';

import { withTranslation, TFunction } from 'react-i18next';
import { compose, withHandlers, withState, withStateHandlers } from 'recompose';
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
import { getEditableSCTs } from '../../libs/category/selectors';

import { redirectIfAllowed as redirectIfAllowedAction } from '../../libs/role/actions';

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
  getMetaActivity,
} from '../../libs/meta-activity/selectors';
import { getAvailableEstablishmentList } from '../../libs/establishment/selectors';
import {
  fetchAllOffers as fetchAllOffersActions,
  createOffers as createOffersActions,
} from '../../libs/offer/actions';

import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  createOrUpdate as createOrUpdatePaymentPackAction,
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
import { fetchMarketingNotificationList } from '../../libs/marketing/actions';
import { withBookingNotification } from '../../libs/marketing/selectors';
import MetaActivityEditDrawer from '#libs/meta-activity/components/MetaActivityEdit.drawer';
import { mapFormData, unmap } from '../form.utils';
import { refreshCompanyTheme as refreshCompanyThemeAction } from '#libs/theme/actions';
import NoShowPenaltyDialog from '#libs/payment-packs/components/PaymentPackForm/NoShowPenaltyDialog.component';

const MetaActivityMap = {
  cover_main: 'cover_main',
  description: 'description',
  name: 'name',
  last_booking_minutes: 'last_booking_minutes',
  last_discard_minutes: 'last_discard_minutes',
  first_booking_minutes_until: 'first_booking_minutes_until',
  is_workshop: 'is_workshop',
  SCT: 'SCT',
  color: 'color',
  is_broadcast: 'is_broadcast',
  auto_discard_active: 'auto_discard_active',
  auto_discard_hours_before_start: 'auto_discard_hours_before_start',
  auto_discard_min_bookings_nb: 'auto_discard_min_bookings_nb',
  category: 'category',
  alt_cover_main: 'alt_cover_main',
  custom_restriction_rule: 'custom_restriction_rule',
  id: 'id',
};
type Props = {
  workshopActivities: Array<MetaActivity>,
  disabledWorkshopActivities: Array<MetaActivity>,
  loading: boolean,
  notificationLoading: boolean,

  fetchMarketingNotificationList: (params: any) => void,
  setWorkshopToDelete: (number) => void,
  workshopToDelete: ?number,
  deleteWorkshop: (number) => void,
  restoreMetaActivity: (id: number) => void,
  goToDetail: (metaActivityId: number) => void,
  goToPaymentPack: () => void,
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
  availableEstablishments: Array<Establishment>,
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
  upsertWorkshopActivity: any,
  resetPaymentPacks: () => void,
  fetchAllOffers: any,
  fetchAllActivities: (data?: { customer_enabled: true }) => void,
  fetchMetactivities: () => void,
  goToPaymentPackCreate: () => void,
  fetchAllPaymentPackCategory: () => void,
  fetchAllMetaActivityCategory: (companyId?: number) => void,
  upsertMetaActivity: any,
  selectedMetaActivity: MetaActivityCategoryWithActivities,
  setSelectedMetaActivityId: (id: null | number) => void,
  onSubmit: (values: MetaActivity, options: OptionCallback) => void,
  goToSettings: () => void,
  createOrUpdatePaymentPack: (
    openNoShowPenaltyDialog: () => void,
    onCancelForm: () => void,
  ) => void,
  formIsOpen: boolean,
  setFormIsOpen: (formIsOpen: boolean) => void,
  openNoShowPenaltyDialog: boolean,
  setOpenNoShowPenaltyDialog: (openNoShowPenaltyDialog: boolean) => void,
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
    this.props.fetchAllActivities();
    this.props.fetchMarketingNotificationList({
      active: true,
      kind: NOTIFICATION_KIND.BOOKING_CREATION,
    });
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
    this.props.setFormIsOpen(false);
  };

  renderCreateWorkshopActivity = () => {
    return (
      <MetaActivityCreate
        // goToPaymentPack: (id: number) => push(`/payment-pack/${id}`)
        activeCustomLevels={this.props.activeCustomLevels}
        allCustomLevels={this.props.allCustomLevels}
        allEstablishmentList={this.props.allEstablishmentList}
        allTagsWithTagGroup={this.props.allTagsWithTagGroup}
        associatedCoaches={this.props.associatedCoaches}
        categoryList={this.props.categoryList}
        coaches={this.props.coaches}
        coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
        companyId={this.props.companyId}
        companyTheme={this.props.companyTheme}
        compatiblePaymentPacks={this.props.compatiblePaymentPacks}
        createLevel={this.props.createLevel}
        createOffers={this.props.createOffers}
        createPaymentPack={this.props.createOrUpdatePaymentPack}
        deleteLevel={this.props.deleteLevel}
        availableEstablishments={this.props.availableEstablishments}
        fetchAllActivities={this.props.fetchAllActivities}
        fetchAllCoachPaymentRules={this.props.fetchAllCoachPaymentRules}
        fetchAllMetaActivityCategory={this.props.fetchAllMetaActivityCategory}
        fetchAllOffers={this.props.fetchAllOffers}
        fetchAllPaymentPackCategory={this.props.fetchAllPaymentPackCategory}
        fetchAssociatedCoachesList={this.props.fetchAssociatedCoachesList}
        fetchEstablishments={this.props.fetchEstablishments}
        fetchLevelList={this.props.fetchLevelList}
        fetchMetactivities={this.props.fetchMetactivities}
        fetchPaymentPacks={this.props.fetchPaymentPacks}
        fetchRoomBlueprints={this.props.fetchRoomBlueprints}
        goToMetaActivity={this.props.goToWorkshop}
        goToPaymentPackCreate={this.props.goToPaymentPackCreate}
        goToWorkshop={this.props.goToWorkshop}
        isWorkshop
        metaActivitiesAndWorkshops={this.props.metaActivitiesAndWorkshops}
        metaActivityCategories={this.props.metaActivityCategories}
        metaActivityNames={this.props.metaActivityNames}
        offerHadError={this.props.offerHadError}
        offerIsProcessing={this.props.offerIsProcessing}
        onClose={this.onCancelForm}
        paymentPackCategories={this.props.paymentPackCategories}
        resetPaymentPacks={this.props.resetPaymentPacks}
        roomBlueprints={this.props.roomBlueprints}
        SCTs={this.props.SCTs}
        showPartnership={this.props.showPartnership}
        updateLevel={this.props.updateLevel}
        upsertedWorkshop={this.props.upsertedWorkshop}
        upsertMetaActivity={this.props.upsertMetaActivity}
        upsertWorkshopActivity={this.props.upsertWorkshopActivity}
      />
    );
  };

  editMetaActivity = (id: number) => {
    this.props.setSelectedMetaActivityId(id);
  };

  onCancelEdit = () => {
    this.props.setSelectedMetaActivityId(null);
  };

  getSelectedMetaActivityInitialData = () => {
    const { selectedMetaActivity } = this.props;
    const initialData = selectedMetaActivity
      ? {
          ...unmap(selectedMetaActivity, MetaActivityMap),
          SCT: selectedMetaActivity.SCT,
        }
      : null;
    return initialData;
  };

  openNoShowPenaltyDialog = () => this.props.setOpenNoShowPenaltyDialog(true);

  closeNoShowPenaltyDialog = () => {
    this.props.setOpenNoShowPenaltyDialog(false);
    this.onCancelForm();
    this.props.fetchPaymentPacks();
  };

  render() {
    const { classes, t, selectedMetaActivity } = this.props;

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
              this.props.setFormIsOpen(true);
            }}
          />
          {!!this.props.formIsOpen && this.renderCreateWorkshopActivity()}
        </div>
      );
    }
    return (
      <div className={classes.container}>
        {this.props.loading || this.props.notificationLoading ? (
          <LinearProgress />
        ) : null}
        <NoShowPenaltyDialog
          open={this.props.openNoShowPenaltyDialog}
          onClose={this.closeNoShowPenaltyDialog}
          goToSettings={this.props.goToSettings}
        />
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
                  goToEdit={this.editMetaActivity}
                  deleteMetaActivity={this.props.setWorkshopToDelete}
                />
              </Collapse>
            </Paper>
          </div>
        ) : null}
        <MetaActivityList
          metaActivities={this.props.workshopActivities}
          goToDetail={this.props.goToDetail}
          goToEdit={this.editMetaActivity}
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
                goToEdit={this.editMetaActivity}
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
        <MetaActivityEditDrawer
          initial={{
            ...this.getSelectedMetaActivityInitialData(),
            images: (selectedMetaActivity || {}).images || [],
          }}
          onSubmit={this.props.onSubmit}
          SCTs={this.props.SCTs}
          isWorkshop
          open={!!this.props.selectedMetaActivity}
          onCancel={this.onCancelEdit}
          tags={this.props.allTagsWithTagGroup}
        />
        <BottomActionsButton
          onCreateLabel={this.props.t('actions.addWorkshopActivity')}
          onCreate={() => {
            this.props.setFormIsOpen(true);
          }}
        />
        {this.props.formIsOpen ? this.renderCreateWorkshopActivity() : ''}
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

type StateHandlerInit = {
  formIsOpen: boolean,
  openNoShowPenaltyDialog: boolean,
};

const withStateHandlersInit: StateHandlerInit = {
  formIsOpen: false,
  openNoShowPenaltyDialog: false,
};

const withStateHandlersSetter = {
  setOpenNoShowPenaltyDialog: () => (openNoShowPenaltyDialog: boolean) => {
    return { openNoShowPenaltyDialog };
  },
  setFormIsOpen: () => (formIsOpen: boolean) => {
    return { formIsOpen };
  },
};

export default compose(
  withStyles(styles),
  withState('selectedMetaActivityId', 'setSelectedMetaActivityId', null),
  withTranslation(['workshop']),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(
    (state, { selectedMetaActivityId }) => ({
      workshopActivities: withBookingNotification(getEnabledWorkshops)(state),
      disabledWorkshopActivities: getDisabledWorkshops(state),
      loading: state.metaActivity.loading,
      notificationLoading: state.marketingNotification.loading,
      selectedMetaActivity: getMetaActivity(state, selectedMetaActivityId),
      // from WorkshopActivityCreate now
      offerIsProcessing: state.offer.create.loading,
      offerHadError: state.offer.create.error,
      associatedCoaches: getActiveCoaches(state),
      availableEstablishments: getAvailableEstablishmentList(state),
      SCTs: getEditableSCTs(state),
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
      isRollCallMandatory: state.theme.theme.is_roll_call_mandatory,
    }),
    {
      fetchAllActivities: fetchMetaActivitiesAction,
      makeActivityCopy: makeActivityCopyAction,
      redirectIfAllowed: redirectIfAllowedAction,
      deleteWorkshop,
      restoreMetaActivity,
      fetchMarketingNotificationList,
      goToDetail: (metaActivityId) =>
        push(`/workshop-activity/${metaActivityId}/general`),
      upsertWorkshopActivity: upsert,
      goToPreviousPage: goBack,
      goToWorkshop: (id: number) => push(`/workshop-activity/${id}/general`),
      fetchPaymentPacks: fetchActivityCompatiblePaymentPacksAction,
      fetchAllOffers: fetchAllOffersActions,
      fetchEstablishments,
      fetchAssociatedCoachesList,
      fetchRoomBlueprints,
      fetchAllCoachPaymentRules,
      createOffers: createOffersActions,
      fetchLevelList: fetchLevelListAction,
      updateLevel: updateLevelAction,
      createLevel: createLevelAction,
      deleteLevel: deleteLevelAction,
      fetchCompanyTheme: refreshCompanyThemeAction,
      push,
      createOrUpdate: createOrUpdatePaymentPackAction,
    },
  ),
  withHandlers({
    makeActivityCopy:
      ({ makeActivityCopy, fetchMetaActivities }) =>
      (id, suffix) => {
        makeActivityCopy(id, suffix, { onSuccess: fetchMetaActivities });
      },
    onSubmit:
      ({
        selectedMetaActivityId,
        upsertWorkshopActivity,
        setSelectedMetaActivityId,
      }) =>
      (values: any, options: OptionCallback) => {
        try {
          const formData = mapFormData(values, MetaActivityMap);
          formData.append('id', selectedMetaActivityId);
          formData.append('is_workshop', true);
          upsertWorkshopActivity(formData, {
            ...options,
            onSuccess: () => {
              if (options.onSuccess) options.onSuccess();
              setSelectedMetaActivityId(null);
            },
            onError: (err) => {
              console.error(err);
              if (options?.onError) options.onError(err);
            },
          });
        } catch (err) {
          console.error(err);
          if (options?.onError) options.onError(err);
        }
      },
    goToPaymentPack:
      ({ redirectIfAllowed }) =>
      () => {
        redirectIfAllowed('/payment-pack', {
          newWindow: false,
          deniedAccessDialog: { display: true },
        });
      },

    goToSettings: (props) => () => {
      props.push('/settings/personalization');
    },
    createOrUpdatePaymentPack:
      ({
        createOrUpdate,
        fetchCompanyTheme,
        fetchPaymentPacks,
        companyId,
        isRollCallMandatory,
        setFormIsOpen,
        setOpenNoShowPenaltyDialog,
      }) =>
      (data: any, options: OptionCallback) => {
        createOrUpdate(data, {
          ...options,
          onSuccess: (res) => {
            options.onSuccess(res);
            fetchCompanyTheme(companyId, {
              onSuccess: (theme) => {
                if (!isRollCallMandatory && theme.is_roll_call_mandatory) {
                  setOpenNoShowPenaltyDialog(true);
                } else {
                  fetchPaymentPacks();
                  setFormIsOpen(false);
                }
              },
            });
          },
        });
      },
  }),
  withState('workshopToDelete', 'setWorkshopToDelete', null),
)(WorkshopActivityList);
