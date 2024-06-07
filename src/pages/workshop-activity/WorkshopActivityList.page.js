// @flow
//
import React from 'react';
import { connect } from 'react-redux';
import { goBack, push } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
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
import type { OptionPropsWithData } from '../../libs/fuzzy-search/types';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#src/libs/level/selectors';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#src/libs/level/actions';
import MetaActivityEditDrawer from '#src/libs/meta-activity/components/MetaActivityEdit.drawer';

import { CoachPaymentRuleByKindSelector } from '../../libs/coach-payment-rules/selectors';
import themeSelectors from '../../libs/theme/selectors';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import { getEditableSCTs } from '../../libs/category/selectors';
import ObjectLevelPermissionProvider from '../../libs/role/permission-utils/ObjectLevelPermissionProvider.component';

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

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import WorkshopDeleteDialog from '../../libs/meta-activity/components/WorkshopDeleteDialog.component';
import MetaActivityCreate from '../../libs/meta-activity/components/MetaActivityCreate.drawer';

import {
  deleteWorkshop as deleteWorkshopAction,
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
import { mapFormData, unmap } from '../form.utils';
import { refreshCompanyTheme as refreshCompanyThemeAction } from '#src/libs/theme/actions';
import NoShowPenaltyDialog from '#src/libs/payment-packs/components/PaymentPackForm/NoShowPenaltyDialog.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import MetaActivityListItem from '#src/libs/meta-activity/components/MetaActivityListItem.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

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
} & WithObjectSearch;

type State = {
  showDisabled: boolean,
};

type WorkshopOption = {
  deleteMetaActivity: () => void,
  goToEdit: () => void,
  label: string,
  metaActivity: MetaActivity,
  onClick: () => void,
  value: number,
};

const searchBarAdditionalParams = {
  is_workshop: true,
  customer_enabled: true,
};

const Option: React.FC<OptionPropsWithData<WorkshopOption>> = (props) => (
  <MetaActivityListItem divider {...props.data} />
);
export class WorkshopActivityList extends React.Component<Props, State> {
  state = {
    showDisabled: false,
  };

  componentDidMount() {
    this.props.fetchAllActivities();
    this.props.fetchMarketingNotificationList({
      active: true,
      kind: NOTIFICATION_KIND.BOOKING_CREATION,
    });
  }

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

  renderCreateWorkshopActivity = (hasAddSessionPermission: boolean) => {
    return (
      <MetaActivityCreate
        // goToPaymentPack: (id: number) => push(`/payment-pack/${id}`)
        isWorkshop
        activeCustomLevels={this.props.activeCustomLevels}
        allCustomLevels={this.props.allCustomLevels}
        allEstablishmentList={this.props.allEstablishmentList}
        allTagsWithTagGroup={this.props.allTagsWithTagGroup}
        associatedCoaches={this.props.associatedCoaches}
        availableEstablishments={this.props.availableEstablishments}
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
        skipOfferStep={!hasAddSessionPermission}
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

  workshopOptionsFormatter =
    (
      hasWorkshopEditPermission: boolean,
      hasWorkshopDeletePermission: boolean,
    ) =>
    (workshops: MetaActivity[]): WorkshopOption[] =>
      workshops.map((workshop) => {
        return {
          label: workshop.name,
          deleteMetaActivity: hasWorkshopEditPermission
            ? () => this.props.setWorkshopToDelete(workshop.id)
            : null,
          goToEdit: hasWorkshopDeletePermission
            ? () => this.editMetaActivity(workshop.id)
            : null,
          metaActivity: workshop,
          onClick: workshop.customer_enabled
            ? () => this.props.goToDetail(workshop.id)
            : null,
          value: workshop.id,
        };
      });

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
            button={this.props.t('actions.addWorkshopActivity')}
            onCreate={() => {
              this.props.setFormIsOpen(true);
            }}
            onCreateLabel={this.props.t('actions.addWorkshopActivity')}
            text={this.props.t('noWorkshops')}
          />
          {!!this.props.formIsOpen && this.renderCreateWorkshopActivity()}
        </div>
      );
    }
    return (
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'management.workshop.allowed_actions.create',
          'session.workshop.allowed_actions.create',
          'management.workshop.allowed_actions.edit',
          'management.workshop.allowed_actions.delete',
        ]}
      >
        {([
          hasCreatePermission,
          hasAddSessionPermission,
          hasWorkshopEditPermission,
          hasWorkshopDeletePermission,
        ]: boolean[]) => (
          <div className={classes.container}>
            {this.props.loading || this.props.notificationLoading ? (
              <LinearProgress />
            ) : null}
            <NoShowPenaltyDialog
              goToSettings={this.props.goToSettings}
              onClose={this.closeNoShowPenaltyDialog}
              open={this.props.openNoShowPenaltyDialog}
            />
            {this.props.workshopActivities.length > 0 ? (
              <div className={this.props.classes.search}>
                <div className={classes.header}>
                  <div className={classes.searchField}>
                    <ObjectSearchComponent
                      additionalParams={searchBarAdditionalParams}
                      components={{
                        Option,
                      }}
                      optionsFormatter={this.workshopOptionsFormatter(
                        hasWorkshopEditPermission,
                        hasWorkshopDeletePermission,
                      )}
                      placeholder={t('actions.search')}
                      searchedObjectType="meta_activity"
                      variant="underlined"
                    />
                  </div>
                  <Hidden smDown>
                    <Button
                      color="primary"
                      onClick={this.props.goToPaymentPack}
                      variant="outlined"
                    >
                      <ArrowForwardIcon className={classes.leftIcon} />
                      {t('navigation.goToPaymentPack')}
                    </Button>
                  </Hidden>
                </div>
              </div>
            ) : null}
            <MetaActivityList
              isWorkshop
              deleteMetaActivity={this.props.setWorkshopToDelete}
              goToDetail={this.props.goToDetail}
              goToEdit={this.editMetaActivity}
              makeActivityCopy={this.props.makeActivityCopy}
              metaActivities={this.props.workshopActivities}
            />
            {(this.props.disabledWorkshopActivities || []).length ? (
              <div>
                <ButtonBase
                  className={this.props.classes.buttonTitle}
                  onClick={this.onShowDisabled}
                >
                  <Typography
                    className={this.props.classes.titleContainer}
                    variant="h5"
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
                    isWorkshop
                    deleteMetaActivity={this.props.setWorkshopToDelete}
                    goToDetail={this.props.goToDetail}
                    goToEdit={this.editMetaActivity}
                    makeActivityCopy={this.props.makeActivityCopy}
                    metaActivities={this.props.disabledWorkshopActivities}
                    restoreMetaActivity={this.restoreMetaActivity}
                  />
                </Collapse>
              </div>
            ) : null}
            <WorkshopDeleteDialog
              canDeleteWorkshopChecker={canDeleteMetaActivityAPI}
              deleteWorkshop={this.props.deleteWorkshop}
              onClose={() => this.props.setWorkshopToDelete(null)}
              workshopId={this.props.workshopToDelete}
            />
            <MetaActivityEditDrawer
              isWorkshop
              initial={{
                ...this.getSelectedMetaActivityInitialData(),
                images: (selectedMetaActivity || {}).images || [],
              }}
              onCancel={this.onCancelEdit}
              onSubmit={this.props.onSubmit}
              open={!!this.props.selectedMetaActivity}
              SCTs={this.props.SCTs}
              tags={this.props.allTagsWithTagGroup}
            />

            {hasCreatePermission && (
              <BottomActionsButton
                onCreate={() => {
                  this.props.setFormIsOpen(true);
                }}
                onCreateLabel={this.props.t('actions.addWorkshopActivity')}
              />
            )}
            {this.props.formIsOpen &&
              this.renderCreateWorkshopActivity(hasAddSessionPermission)}
          </div>
        )}
      </ObjectLevelPermissionProvider>
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
  withObjectSearch,
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
      deleteWorkshopAction,
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
      ({ makeActivityCopy, goToDetail }) =>
      (id, suffix) => {
        makeActivityCopy(id, suffix, {
          onSuccess: (data: MetaActivity) => {
            // eslint-disable-next-line no-unused-expressions
            data?.id && goToDetail(data.id);
          },
        });
      },
    onSubmit:
      ({
        selectedMetaActivityId,
        upsertWorkshopActivity,
        setSelectedMetaActivityId,
        refreshOptions,
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
              refreshOptions('meta_activity', searchBarAdditionalParams);
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
    deleteWorkshop: (props) => (id: number, options: OptionCallback) => {
      props.deleteWorkshopAction(id, {
        onSuccess: () => {
          props.refreshOptions('meta_activity', searchBarAdditionalParams);
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },
  }),
  withState('workshopToDelete', 'setWorkshopToDelete', null),
)(WorkshopActivityList);
