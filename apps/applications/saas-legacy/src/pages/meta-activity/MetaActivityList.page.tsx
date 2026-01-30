import React from 'react';
import { push, goBack } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withState, withHandlers, withStateHandlers } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import uniqBy from 'lodash/uniqBy';

import Hidden from '@material-ui/core/Hidden';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { createStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

// @ts-expect-error
import MetaActivityCreate from '#src/libs/meta-activity/components/MetaActivityCreate.drawer';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '#src/components/button/BottomActionsButton.component';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import MetaActivityList from '#src/libs/meta-activity/components/MetaActivityList.component';
import MetaActivityDeleteDialog from '#src/libs/meta-activity/components/MetaActivityDeleteDialog.component';
import {
  getPageEnabledPureMetaActivities,
  getDisabledMetaActivityList,
  getDisabledMetaActivitiesPaginationState,
  getMetaActivityByCategoryWithActivities,
  getEnabledMetaActivities,
  getEnabledWorkshops,
  getActivitiesByIdList,
  getMetaActivityCategories,
  getMetaActivity,
  getIsMetaActivityPublishedOnUSC,
} from '#src/libs/meta-activity/selectors';

import {
  deleteMetaActivity as deleteMetaActivityAction,
  restoreMetaActivity,
  makeActivityCopy as makeActivityCopyAction,
  fetchAllMetaActivityCategory,
  upsertMetaActivityCategory,
  deleteMetaActivityCategory,
  editOrderMetaActivity,
  updateMetaActivityCategoryOrder,
  fetchMetaActivityBulkAfterCategoryDelete,
  upsert,
  fetchActivitiesCompany as fetchActivitiesCompanyAction,
  fetchMetaActivities as fetchMetactivitiesAction,
  fetchDisabledMetaActivityPaginatedList as fetchDisabledMetaActivityPaginatedListAction,
  fetchIsMetaActivityPublishedOnUSC,
} from '#src/libs/meta-activity/actions';
import { PAGINATION_SIZE } from '#src/libs/meta-activity/constants';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '#src/libs/meta-activity/api/common';

import { fetchMarketingNotificationList } from '#src/libs/marketing/actions';
import { withBookingNotification } from '#src/libs/marketing/selectors';
import { CategoryList } from '#src/components/ordering/CategoryList.component';
import MetaActivityListItem from '#src/libs/meta-activity/components/MetaActivityListItem.component';
import {
  MetaActivity,
  MetaActivityCategory,
  MetaActivityCategoryWithActivities,
} from '#src/libs/meta-activity/types';
// import AddCategoryButton from '#src/components/ordering/AddCategoryButton.component';
import CategoryCreationEditDialog from '#src/components/ordering/CategoryCreationEditDialog.component';
import { redirectIfAllowed as redirectIfAllowedAction } from '#src/libs/role/actions';

import {
  fetchAllOffers as fetchAllOffersAction,
  createOffers as createOffersActions,
} from '#src/libs/offer/actions';
import { getActiveCoaches } from '#src/libs/associated-coach/selectors';
import { getEditableSCTs } from '#src/libs/category/selectors';
import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  resetCompatiblePaymentPacks as resetCompatiblePaymentPacksAction,
  createOrUpdate as createOrUpdatePaymentPackAction,
  fetchAllPaymentPackCategory,
} from '#src/libs/payment-packs/actions';

import themeSelectors from '#src/libs/theme/selectors';
import {
  getActivityCompatiblePaymentPacks,
  getAllPaymentPackCategory,
} from '#src/libs/payment-packs/selectors';
import { fetchEstablishments } from '#src/libs/establishment/actions';
import { fetchAssociatedCoachesList } from '#src/libs/associated-coach/actions';
import {
  getAvailableEstablishmentList,
  getAllEstablishments,
} from '#src/libs/establishment/selectors';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#src/libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#src/libs/level/selectors';
import { getAvailableRoomBlueprints } from '#src/libs/spot-scheduling/selector';
import { fetchRoomBlueprints } from '#src/libs/spot-scheduling/actions';
import { fetchAllCoachPaymentRules } from '#src/libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '#src/libs/coach-payment-rules/selectors';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import MetaActivityEditDrawer from '#src/libs/meta-activity/components/MetaActivityEdit.drawer';
import { refreshCompanyTheme as refreshCompanyThemeAction } from '#src/libs/theme/actions';
import NoShowPenaltyDialog from '#src/libs/payment-packs/components/PaymentPackForm/NoShowPenaltyDialog.component';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

// @ts-expect-error
import { mapFormData, unmap } from '../form.utils';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { OptionCallback, PaginatedResponse } from '../../state/types';

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
const searchBarAdditionalParams = {
  is_workshop: false,
  customer_enabled: true,
};

type RouterParamsToProps = { id: number };

type MetaActivityConnectedProps = ConnectedProps<typeof connector>;

type MetaActivityHandlers = WithHandlerType<typeof handlers>;

type StateToProps = {
  setSelectedMetaActivityId: (metaActivityId: null | number) => void;
  selectedMetaActivityId: null | number;
  setActivityToDelete: (metaActivityId: number) => void;
  activityToDelete: number;
};

type Props = RouterParamsToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  MetaActivityConnectedProps &
  MetaActivityHandlers &
  StateToProps &
  WithObjectSearch;

type State = {
  showDisabled: boolean;
  showCategoryDialog: boolean;
  selectedCategory: MetaActivityCategory;
};

const BOOKING_CREATION_NOTIFICATION = 2;

type MetaActivityOption = {
  deleteMetaActivity: () => void;
  goToEdit: () => void;
  label: string;
  metaActivity: MetaActivity;
  onClick: () => void;
  value: number;
};

const Option: React.FC<OptionPropsWithData<MetaActivityOption>> = (props) => (
  <MetaActivityListItem divider {...props.data} />
);

export class MetaActivityListPage extends React.Component<Props, State> {
  state: State = {
    showDisabled: false,
    showCategoryDialog: false,
    selectedCategory: null,
  };

  componentDidMount() {
    this.fetchEnabledMetaActivityList();
    this.fetchDisabledMetaActivityList();

    this.props.fetchAllMetaActivityCategory();
    this.props.fetchMarketingNotificationList({
      active: true,
      kind: BOOKING_CREATION_NOTIFICATION,
    });
  }

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
  };

  restoreMetaActivity = async (id: number) => {
    if (this.props.disabledMetaActivities.length === 1) {
      this.setState({ showDisabled: false });
    }
    // @ts-expect-error
    this.props.restoreMetaActivity(id);
  };

  onEditCategory = (category: MetaActivityCategory) => {
    this.setState({ showCategoryDialog: true, selectedCategory: category });
  };

  onDeleteCategory = (category: MetaActivityCategoryWithActivities) => {
    this.props.deleteMetaActivityCategory(category, {
      onSuccess: () => {
        this.props.fetchMetaActivityBulkAfterCategoryDelete(
          category.items.map((item) => item.id),
        );
      },
    });
    this.setState({ selectedCategory: null });
  };

  onDuplicate = (id: number) =>
    this.props.makeActivityCopy(
      id,
      this.props.t('translation:common.copySuffix'),
    );

  onCancelForm = () => {
    // @ts-expect-error
    this.props.setFormIsOpen(false);
  };

  fetchEnabledMetaActivityList = (options?: OptionCallback) =>
    this.props.fetchActivitiesCompany(
      this.props.companyId,
      {
        customer_enabled: true,
        is_workshop: false,
      },
      options,
    );

  fetchDisabledMetaActivityList = (
    options?: OptionCallback<PaginatedResponse<MetaActivity>>,
  ) =>
    this.props.fetchDisabledMetaActivityPaginatedList(
      this.props.companyId,
      {
        page: 1,
        pageSize: PAGINATION_SIZE,
        isWorkshop: false,
      },
      options,
    );

  fetchMoreDisabledMetaActivities = () => {
    this.props.fetchDisabledMetaActivityPaginatedList(this.props.companyId, {
      page: this.props.disabledMetaActivitiesPagination.nextPage,
      pageSize: PAGINATION_SIZE,
      isWorkshop: false,
    });
  };

  renderCreateActivity = (hasAddSessionPermission: boolean) => {
    return (
      <MetaActivityCreate
        activeCustomLevels={this.props.activeCustomLevels}
        allCustomLevels={this.props.allCustomLevels}
        allEstablishmentList={this.props.allEstablishmentList}
        allTagsWithTagGroup={this.props.allTagsWithTagGroup}
        availableEstablishments={this.props.availableEstablishments}
        categoryList={this.props.SCTs}
        coaches={this.props.coaches}
        coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
        companyId={this.props.companyId}
        companyTheme={this.props.companyTheme}
        compatiblePaymentPacks={this.props.compatiblePaymentPacks}
        createLevel={this.props.createLevel}
        createOffers={this.props.createOffers}
        createPaymentPack={this.props.createOrUpdatePaymentPack}
        deleteLevel={this.props.deleteLevel}
        fetchAllActivities={this.fetchEnabledMetaActivityList}
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
        goBack={this.props.goBack}
        goToMetaActivity={this.props.goToMetaActivity}
        goToPaymentPackCreate={this.props.goToPaymentPackCreate}
        metaActivities={this.props.metaActivities}
        // goToPaymentPack: (id: number) => push(`/payment-pack/${id}`)
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
        upsertedMetaActivity={this.props.upsertedMetaActivity}
        upsertMetaActivity={this.props.upsertMetaActivity}
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

  // @ts-expect-error
  openNoShowPenaltyDialog = () => this.props.setOpenNoShowPenaltyDialog(true);

  closeNoShowPenaltyDialog = () => {
    // @ts-expect-error
    this.props.setOpenNoShowPenaltyDialog(false);
    this.onCancelForm();
    // @ts-expect-error
    this.props.fetchPaymentPacks();
  };

  metaActivityOptionsFormatter =
    (
      hasMetaActivityEditPermission: boolean,
      hasMetaActivityDeletePermission: boolean,
    ) =>
    (metaActivities: MetaActivity[]): MetaActivityOption[] =>
      metaActivities.map((metaActivity) => {
        return {
          label: metaActivity.name,
          deleteMetaActivity: hasMetaActivityDeletePermission
            ? () => this.props.setActivityToDelete(metaActivity.id)
            : null,
          goToEdit: hasMetaActivityEditPermission
            ? () => this.editMetaActivity(metaActivity.id)
            : null,
          metaActivity,
          onClick: metaActivity.customer_enabled
            ? () => this.props.goToDetail(metaActivity.id)
            : null,
          value: metaActivity.id,
        };
      });

  render() {
    const { classes, t, selectedMetaActivity } = this.props;
    if (
      (this.props.enabledMetaActivities ?? []).length +
        (this.props.disabledMetaActivities ?? []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <div>
          <IsEmptyList
            button={this.props.t('actions.addActivity')}
            onCreate={() => {
              // @ts-expect-error
              this.props.setFormIsOpen(true);
            }}
            onCreateLabel={this.props.t('actions.addActivity')}
            text={this.props.t('noActivities')}
          />
          {/* @ts-expect-error */}
          {!!this.props.formIsOpen && this.renderCreateActivity()}
        </div>
      );
    }

    return (
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'management.activity.allowed_actions.create',
          'session.activity.allowed_actions.create',
          `management.activity.allowed_actions.edit`,
          `management.activity.allowed_actions.delete`,
        ]}
      >
        {([
          hasCreatePermission,
          hasAddSessionPermission,
          hasMetaActivityEditPermission,
          hasMetaActivityDeletePermission,
        ]: boolean[]) => (
          <div className={classes.container}>
            {this.props.loading || this.props.notificationLoading ? (
              <LinearProgress />
            ) : null}
            <NoShowPenaltyDialog
              goToSettings={this.props.goToSettings}
              onClose={this.closeNoShowPenaltyDialog}
              // @ts-expect-error
              open={this.props.openNoShowPenaltyDialog}
            />
            {this.props.enabledMetaActivities.length > 0 && (
              <div className={classes.search}>
                <div className={classes.header}>
                  <div className={classes.searchField}>
                    <ObjectSearchComponent
                      additionalParams={searchBarAdditionalParams}
                      components={{
                        Option,
                      }}
                      optionsFormatter={this.metaActivityOptionsFormatter(
                        hasMetaActivityEditPermission,
                        hasMetaActivityDeletePermission,
                      )}
                      placeholder={this.props.t('search')}
                      searchedObjectType="meta_activity"
                      variant="underlined"
                    />
                  </div>
                  <Hidden smDown>
                    <Button
                      color="primary"
                      onClick={this.props.goToPaymentPack}
                      startIcon={
                        <ArrowForwardIcon className={classes.leftIcon} />
                      }
                      variant="outlined"
                    >
                      {t('navigation.goToPaymentPack')}
                    </Button>
                  </Hidden>
                </div>
              </div>
            )}
            {/*
        <AddCategoryButton
          setShowCategoryDialog={(showCategoryDialog: boolean) =>
            this.setState({ showCategoryDialog })
          }
          />
          */}
            {this.state.showCategoryDialog && (
              <CategoryCreationEditDialog
                categorySelected={this.state.selectedCategory}
                onClose={() =>
                  this.setState({
                    showCategoryDialog: false,
                    selectedCategory: null,
                  })
                }
                onSubmit={this.props.upsertMetaActivityCategory}
                open={this.state.showCategoryDialog}
              />
            )}
            {!this.props.categoryLoading && (
              <ObjectLevelPermissionProvider
                requiredPermission={[
                  'management.activity.allowed_actions.edit',
                  'management.activity.allowed_actions.delete',
                ]}
              >
                {([hasEditPermission, hasDeletePermission]: boolean[]) => (
                  <CategoryList
                    hideTitle
                    // @ts-expect-error
                    categoryWithItems={
                      this.props.metaActivityCategoriesWithActivities
                    }
                    deleteCategory={this.onDeleteCategory}
                    disabledDragAndDrop={!hasDeletePermission}
                    editCategory={this.onEditCategory}
                    itemLoading={this.props.loading}
                    ListItemComponent={MetaActivityListItem}
                    onClickItem={this.props.goToDetail}
                    onDeleteItem={
                      hasDeletePermission
                        ? this.props.setActivityToDelete
                        : null
                    }
                    onDuplicateItem={
                      hasEditPermission ? this.onDuplicate : null
                    }
                    onEditItem={
                      hasEditPermission ? this.editMetaActivity : null
                    }
                    updateCategoryOrder={
                      this.props.updateMetaActivityCategoryOrder
                    }
                    updateItemOrder={this.props.editOrderMetaActivity}
                  />
                )}
              </ObjectLevelPermissionProvider>
            )}
            {!!this.props.disabledMetaActivities?.length && (
              <div>
                <ButtonBase
                  className={this.props.classes.buttonTitle}
                  onClick={this.onShowDisabled}
                >
                  <Typography variant="h5">
                    {`${t('metaActivity:disabledMetaActivities')} (${
                      this.props.disabledMetaActivitiesPagination?.count ||
                      (this.props.disabledMetaActivities ?? []).length
                    })`}
                  </Typography>

                  {this.state.showDisabled ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ButtonBase>
                <Divider />
                <Collapse
                  unmountOnExit
                  className={classes.collapse}
                  in={this.state.showDisabled}
                >
                  <MetaActivityList
                    deleteMetaActivity={this.props.setActivityToDelete}
                    goToDetail={this.props.goToDetail}
                    goToEdit={this.editMetaActivity}
                    isWorkshop={false}
                    makeActivityCopy={this.props.makeActivityCopy}
                    metaActivities={this.props.disabledMetaActivities.map(
                      (metaActivity) => metaActivity.asMutable({ deep: true }),
                    )}
                    restoreMetaActivity={this.restoreMetaActivity}
                  />
                  {!!this.props.disabledMetaActivitiesPagination?.nextPage &&
                    !!this.props.disabledMetaActivitiesPagination
                      ?.remainingCount && (
                      <div className={classes.showMoreContainer}>
                        <Button
                          color="primary"
                          onClick={this.fetchMoreDisabledMetaActivities}
                          variant="outlined"
                        >
                          {this.props.t('common:showMore', {
                            count:
                              this.props.disabledMetaActivitiesPagination
                                .remainingCount,
                          })}
                        </Button>
                      </div>
                    )}
                </Collapse>
              </div>
            )}
            <MetaActivityDeleteDialog
              // @ts-expect-error
              canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
              // @ts-expect-error
              deleteMetaActivity={this.props.deleteMetaActivity}
              metaActivityId={this.props.activityToDelete}
              onClose={() => this.props.setActivityToDelete(null)}
            />
            <MetaActivityEditDrawer
              fetchIsMetaActivityPublishedOnUSC={
                this.props.fetchIsMetaActivityPublishedOnUSC
              }
              getIsMetaActivityPublishedOnUSC={
                this.props.getIsMetaActivityPublishedOnUSC
              }
              id={this.props.selectedMetaActivity?.id}
              initial={{
                ...this.getSelectedMetaActivityInitialData(),
                images: (selectedMetaActivity || {}).images || [],
              }}
              onCancel={this.onCancelEdit}
              onSubmit={this.props.onSubmit}
              open={!!this.props.selectedMetaActivity}
              SCTs={this.props.SCTs}
              // @ts-expect-error
              tags={this.props.allTagsWithTagGroup}
            />
            {hasCreatePermission && (
              <BottomActionButtons
                onCreate={() => {
                  // @ts-expect-error
                  this.props.setFormIsOpen(true);
                }}
                onCreateLabel={this.props.t('actions.addActivity')}
              />
            )}
            {/*  @ts-expect-error */}
            {this.props.formIsOpen &&
              this.renderCreateActivity(hasAddSessionPermission)}
          </div>
        )}
      </ObjectLevelPermissionProvider>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(16),
    },
    search: { marginBottom: theme.spacing(2) },
    searchPaperDisplayed: {
      border: '1px solid',
      // @ts-expect-error
      borderColor: theme.primary_color,
      borderTop: '0px',
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
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
    collapse: {
      width: '100%',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    showMoreContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing(2),
    },
  });

const connector = connect(
  (
    state: RootState,
    { selectedMetaActivityId }: { selectedMetaActivityId: number | null },
  ) => ({
    metaActivities: uniqBy(
      [
        ...getEnabledMetaActivities(state),
        ...getEnabledWorkshops(state),
        ...getActivitiesByIdList(state, []),
      ],
      'id',
    ),
    selectedMetaActivity: getMetaActivity(state, selectedMetaActivityId),
    SCTs: getEditableSCTs(state),
    enabledMetaActivities: withBookingNotification(
      getPageEnabledPureMetaActivities,
    )(state),
    disabledMetaActivities: getDisabledMetaActivityList(state),
    disabledMetaActivitiesPagination:
      getDisabledMetaActivitiesPaginationState(state),
    loading: state.metaActivity.loading, // REMOVED (glitch): || state.metaActivity.delete.loading,
    notificationLoading: state.marketingNotification.loading,
    metaActivityCategories: getMetaActivityCategories(state),
    metaActivityCategoriesWithActivities:
      getMetaActivityByCategoryWithActivities(
        withBookingNotification(getPageEnabledPureMetaActivities),
      )(state),
    categoryLoading: state.metaActivity.metaActivityCategory.loading,
    // from MetaActivityCreate now
    offerIsProcessing: state.offer.create.loading,
    offerHadError: state.offer.create.error,
    availableEstablishments: getAvailableEstablishmentList(state),
    metaActivityNames: [
      ...getEnabledMetaActivities(state),
      ...getEnabledWorkshops(state),
    ].map((ma) => ma.name),
    coaches: getActiveCoaches(state),
    upsertedMetaActivity: state.metaActivity.upsert.data,
    companyTheme: themeSelectors.getTheme(state),
    compatiblePaymentPacks: {
      items: getActivityCompatiblePaymentPacks(state),
      count: state.paymentPack.byActivity.count,
      page: state.paymentPack.byActivity.page,
      loading: state.paymentPack.byActivity.loading,
    },
    roomBlueprints: getAvailableRoomBlueprints(state),
    coachPaymentRulesByKind: CoachPaymentRuleByKindSelector(state),
    allEstablishmentList: getAllEstablishments(state),
    allTagsWithTagGroup: getAllTagsWithTagGroup(state),
    paymentPackCategories: getAllPaymentPackCategory(state),
    showPartnership: state.theme.theme.has_partnership,
    activeCustomLevels: getActiveCustomLevels(state),
    allCustomLevels: getAllCustomLevels(state),
    companyId: state.theme.theme.company,
    isRollCallMandatory: state.theme.theme.is_roll_call_mandatory,
    getIsMetaActivityPublishedOnUSC: (metaActivityId: number) =>
      getIsMetaActivityPublishedOnUSC(state, metaActivityId),
  }),
  {
    makeActivityCopy: makeActivityCopyAction,
    goToDetail: (metaActivityId: number) =>
      push(`/activity/${metaActivityId}/general`),
    redirectIfAllowed: redirectIfAllowedAction,
    deleteMetaActivityAction,
    restoreMetaActivity,
    fetchMarketingNotificationList,
    fetchAllMetaActivityCategory,
    upsertMetaActivityCategory,
    deleteMetaActivityCategory,
    editOrderMetaActivity,
    updateMetaActivityCategoryOrder,
    fetchMetaActivityBulkAfterCategoryDelete,
    goBack,
    fetchEstablishments,
    fetchAssociatedCoachesList,
    fetchPaymentPacks: fetchActivityCompatiblePaymentPacksAction,
    upsertMetaActivity: upsert,
    resetPaymentPacks: resetCompatiblePaymentPacksAction,
    goToMetaActivity: (id: number) => push(`/activity/${id}/general`),
    goToPaymentPackCreate: () => push('/payment-pack/add'),
    fetchAllOffers: fetchAllOffersAction,
    fetchRoomBlueprints,
    fetchAllCoachPaymentRules,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchMetactivities: fetchMetactivitiesAction,
    fetchAllPaymentPackCategory,
    createOffers: createOffersActions,
    fetchLevelList: fetchLevelListAction,
    updateLevel: updateLevelAction,
    createLevel: createLevelAction,
    deleteLevel: deleteLevelAction,
    fetchDisabledMetaActivityPaginatedList:
      fetchDisabledMetaActivityPaginatedListAction,
    createOrUpdate: createOrUpdatePaymentPackAction,
    fetchCompanyTheme: refreshCompanyThemeAction,
    push,
    fetchIsMetaActivityPublishedOnUSC,
  },
);

type HandlersProps = MetaActivityConnectedProps &
  RouterParamsToProps &
  StateToProps &
  WithObjectSearch;

const handlers = {
  makeActivityCopy:
    ({ makeActivityCopy, goToDetail }: HandlersProps) =>
    (id: number, suffix: string) => {
      makeActivityCopy(id, suffix, {
        // @ts-expect-error
        onSuccess: (data: MetaActivity) => {
          data?.id && goToDetail(data.id);
        },
      });
    },
  onSubmit:
    ({
      selectedMetaActivityId,
      upsertMetaActivity,
      setSelectedMetaActivityId,
      refreshOptions,
    }: HandlersProps) =>
    (values: any, options: OptionCallback) => {
      try {
        const formData = mapFormData(values, MetaActivityMap);
        formData.append('id', selectedMetaActivityId);
        formData.append('is_workshop', false);
        upsertMetaActivity(formData, {
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
    ({ redirectIfAllowed }: HandlersProps) =>
    () => {
      redirectIfAllowed('/payment-pack', {
        newWindow: false,
        deniedAccessDialog: { display: true },
      });
    },
  // @ts-expect-error
  goToSettings: (props) => () => {
    props.push('/settings/personalization');
  },
  createOrUpdatePaymentPack:
    ({
      // @ts-expect-error
      createOrUpdate,
      // @ts-expect-error
      fetchCompanyTheme,
      // @ts-expect-error
      fetchPaymentPacks,
      // @ts-expect-error
      companyId,
      // @ts-expect-error
      isRollCallMandatory,
      // @ts-expect-error
      setFormIsOpen,
      // @ts-expect-error
      setOpenNoShowPenaltyDialog,
    }) =>
    (data: any, options: OptionCallback) => {
      createOrUpdate(data, {
        ...options,
        // @ts-expect-error
        onSuccess: (res) => {
          options.onSuccess(res);
          fetchCompanyTheme(companyId, {
            // @ts-expect-error
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
  deleteMetaActivity:
    (props: HandlersProps) => (id: number, options: OptionCallback) => {
      props.deleteMetaActivityAction(id, {
        onSuccess: () => {
          props.refreshOptions('meta_activity', searchBarAdditionalParams);
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },
};

type StateHandlerInit = {
  formIsOpen: boolean;
  openNoShowPenaltyDialog: boolean;
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
  withTranslation(['metaActivity', 'titles', 'common']),
  withObjectSearch,
  withState('selectedMetaActivityId', 'setSelectedMetaActivityId', null),
  withState('activityToDelete', 'setActivityToDelete', null),
  routerParamsToProps({ id: 'id:number' }),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:metaActivity.metaActivityList'),
  ),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connector,
  withHandlers(handlers),
)(MetaActivityListPage);
