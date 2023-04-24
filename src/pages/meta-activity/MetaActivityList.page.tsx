// @ts-nocheck
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
import Paper from '@material-ui/core/Paper';

import FuzeSearch from '#components/FuzeSearch.component';

import MetaActivityCreate from '#libs/meta-activity/components/MetaActivityCreate.drawer';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '#components/button/BottomActionsButton.component';
import IsEmptyList from '#components/navigation/IsEmptyList.component';

import MetaActivityList from '#libs/meta-activity/components/MetaActivityList.component';
import MetaActivityDeleteDialog from '#libs/meta-activity/components/MetaActivityDeleteDialog.component';
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
} from '#libs/meta-activity/selectors';
import {
  deleteMetaActivity,
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
} from '#libs/meta-activity/actions';
import { PAGINATION_SIZE } from '#libs/meta-activity/constants';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '#libs/meta-activity/api/common';

import { fetchMarketingNotificationList } from '#libs/marketing/actions';
import { withBookingNotification } from '#libs/marketing/selectors';
import { CategoryList } from '#components/ordering/CategoryList.component';
import MetaActivityListItem from '#libs/meta-activity/components/MetaActivityListItem.component';
import { OptionCallback, PaginatedResponse } from '../../state/types';
import {
  MetaActivity,
  MetaActivityCategory,
  MetaActivityCategoryWithActivities,
} from '#libs/meta-activity/types';
import { RootState } from '../../reducers';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
// import AddCategoryButton from '#components/ordering/AddCategoryButton.component';
import CategoryCreationEditDialog from '#components/ordering/CategoryCreationEditDialog.component';
import { redirectIfAllowed as redirectIfAllowedAction } from '#libs/role/actions';

import {
  fetchAllOffers as fetchAllOffersAction,
  createOffers as createOffersActions,
} from '#libs/offer/actions';
import { getActiveCoaches } from '#libs/associated-coach/selectors';
import { getEditableSCTs } from '#libs/category/selectors';
import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  resetCompatiblePaymentPacks as resetCompatiblePaymentPacksAction,
  createOrUpdate as createOrUpdatePaymentPackAction,
  fetchAllPaymentPackCategory,
} from '#libs/payment-packs/actions';

import withTitle from '../../hocs/with-title.hoc';
import themeSelectors from '#libs/theme/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  getActivityCompatiblePaymentPacks,
  getAllPaymentPackCategory,
} from '#libs/payment-packs/selectors';
import { fetchEstablishments } from '#libs/establishment/actions';
import { fetchAssociatedCoachesList } from '#libs/associated-coach/actions';
import {
  getAvailableEstablishmentList,
  getAllEstablishments,
} from '#libs/establishment/selectors';
import {
  fetchLevelList as fetchLevelListAction,
  updateLevel as updateLevelAction,
  createLevel as createLevelAction,
  deleteLevel as deleteLevelAction,
} from '#libs/level/actions';
import {
  getActiveCustomLevels,
  getAllCustomLevels,
} from '#libs/level/selectors';
import { getAvailableRoomBlueprints } from '#libs/spot-scheduling/selector';
import { fetchRoomBlueprints } from '#libs/spot-scheduling/actions';
import { fetchAllCoachPaymentRules } from '#libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '#libs/coach-payment-rules/selectors';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { mapFormData, unmap } from '../form.utils';
import MetaActivityEditDrawer from '#libs/meta-activity/components/MetaActivityEdit.drawer';
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
  StateToProps;

type State = {
  searchText: string;
  searchResult: Array<MetaActivity>;
  showDisabled: boolean;
  showCategoryDialog: boolean;
  selectedCategory: MetaActivityCategory;
};

const BOOKING_CREATION_NOTIFICATION = 2;

export class MetaActivityListPage extends React.Component<Props, State> {
  state: State = {
    searchText: '',
    searchResult: [],
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

  changeSearch = (fuse: MetaActivity) => (ev: any) => {
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

  renderCreateActivity = () => {
    return (
      <MetaActivityCreate
        onClose={this.onCancelForm}
        offerIsProcessing={this.props.offerIsProcessing}
        offerHadError={this.props.offerHadError}
        availableEstablishments={this.props.availableEstablishments}
        SCTs={this.props.SCTs}
        metaActivityNames={this.props.metaActivityNames}
        coaches={this.props.coaches}
        upsertedMetaActivity={this.props.upsertedMetaActivity}
        companyTheme={this.props.companyTheme}
        compatiblePaymentPacks={this.props.compatiblePaymentPacks}
        roomBlueprints={this.props.roomBlueprints}
        coachPaymentRulesByKind={this.props.coachPaymentRulesByKind}
        allEstablishmentList={this.props.allEstablishmentList}
        allTagsWithTagGroup={this.props.allTagsWithTagGroup}
        paymentPackCategories={this.props.paymentPackCategories}
        metaActivities={this.props.metaActivities}
        categoryList={this.props.SCTs}
        showPartnership={this.props.showPartnership}
        metaActivityCategories={this.props.metaActivityCategories}
        activeCustomLevels={this.props.activeCustomLevels}
        allCustomLevels={this.props.allCustomLevels}
        companyId={this.props.companyId}
        goBack={this.props.goBack}
        fetchEstablishments={this.props.fetchEstablishments}
        fetchAssociatedCoachesList={this.props.fetchAssociatedCoachesList}
        fetchPaymentPacks={this.props.fetchPaymentPacks}
        upsertMetaActivity={this.props.upsertMetaActivity}
        resetPaymentPacks={this.props.resetPaymentPacks}
        goToMetaActivity={this.props.goToMetaActivity}
        goToPaymentPackCreate={this.props.goToPaymentPackCreate}
        // goToPaymentPack: (id: number) => push(`/payment-pack/${id}`)
        fetchAllOffers={this.props.fetchAllOffers}
        fetchRoomBlueprints={this.props.fetchRoomBlueprints}
        fetchAllCoachPaymentRules={this.props.fetchAllCoachPaymentRules}
        fetchAllActivities={this.fetchEnabledMetaActivityList}
        fetchMetactivities={this.props.fetchMetactivities}
        fetchAllPaymentPackCategory={this.props.fetchAllPaymentPackCategory}
        createPaymentPack={this.props.createOrUpdatePaymentPack}
        fetchAllMetaActivityCategory={this.props.fetchAllMetaActivityCategory}
        createOffers={this.props.createOffers}
        fetchLevelList={this.props.fetchLevelList}
        updateLevel={this.props.updateLevel}
        createLevel={this.props.createLevel}
        deleteLevel={this.props.deleteLevel}
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
      (this.props.enabledMetaActivities || []).length +
        (this.props.disabledMetaActivities || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <div>
          <IsEmptyList
            text={this.props.t('noActivities')}
            button={this.props.t('actions.addActivity')}
            onCreate={() => {
              this.props.setFormIsOpen(true);
            }}
            onCreateLabel={this.props.t('actions.addActivity')}
          />
          {!!this.props.formIsOpen && this.renderCreateActivity()}
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
        {this.props.enabledMetaActivities.length > 0 && (
          <div className={classes.search}>
            <div className={classes.header}>
              <div className={classes.searchField}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={this.props.enabledMetaActivities}
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
                  startIcon={<ArrowForwardIcon className={classes.leftIcon} />}
                >
                  {t('navigation.goToPaymentPack')}
                </Button>
              </Hidden>
            </div>
            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? classes.searchPaperDisplayed
                  : null
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
                  deleteMetaActivity={this.props.setActivityToDelete}
                />
              </Collapse>
            </Paper>
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
            open={this.state.showCategoryDialog}
            onClose={() =>
              this.setState({
                showCategoryDialog: false,
                selectedCategory: null,
              })
            }
            onSubmit={this.props.upsertMetaActivityCategory}
            categorySelected={this.state.selectedCategory}
          />
        )}
        {!this.props.categoryLoading && (
          <CategoryList
            onClickItem={this.props.goToDetail}
            onEditItem={this.editMetaActivity}
            onDeleteItem={this.props.setActivityToDelete}
            onDuplicateItem={this.onDuplicate}
            updateItemOrder={this.props.editOrderMetaActivity}
            itemLoading={this.props.loading}
            hideTitle
            categoryWithItems={this.props.metaActivityCategoriesWithActivities}
            editCategory={this.onEditCategory}
            deleteCategory={this.onDeleteCategory}
            updateCategoryOrder={this.props.updateMetaActivityCategoryOrder}
            ListItemComponent={MetaActivityListItem}
          />
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
            <Collapse
              in={this.state.showDisabled}
              className={classes.collapse}
              unmountOnExit
            >
              <MetaActivityList
                metaActivities={this.props.disabledMetaActivities}
                goToDetail={this.props.goToDetail}
                goToEdit={this.editMetaActivity}
                deleteMetaActivity={this.props.setActivityToDelete}
                makeActivityCopy={this.props.makeActivityCopy}
                restoreMetaActivity={this.restoreMetaActivity}
              />
              {!!this.props.disabledMetaActivitiesPagination?.nextPage &&
                !!this.props.disabledMetaActivitiesPagination
                  ?.remainingCount && (
                  <div className={classes.showMoreContainer}>
                    <Button
                      variant="outlined"
                      onClick={this.fetchMoreDisabledMetaActivities}
                      color="primary"
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
          metaActivityId={this.props.activityToDelete}
          onClose={() => this.props.setActivityToDelete(null)}
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={this.props.deleteMetaActivity}
        />

        <MetaActivityEditDrawer
          initial={{
            ...this.getSelectedMetaActivityInitialData(),
            images: (selectedMetaActivity || {}).images || [],
          }}
          onSubmit={this.props.onSubmit}
          SCTs={this.props.SCTs}
          open={!!this.props.selectedMetaActivity}
          onCancel={this.onCancelEdit}
          tags={this.props.allTagsWithTagGroup}
        />

        <BottomActionButtons
          onCreateLabel={this.props.t('actions.addActivity')}
          onCreate={() => {
            this.props.setFormIsOpen(true);
          }}
        />
        {this.props.formIsOpen ? this.renderCreateActivity() : ''}
      </div>
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
  }),
  {
    makeActivityCopy: makeActivityCopyAction,
    goToDetail: (metaActivityId: number) =>
      push(`/activity/${metaActivityId}/general`),
    redirectIfAllowed: redirectIfAllowedAction,
    deleteMetaActivity,
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
  },
);

type HandlersProps = MetaActivityConnectedProps &
  RouterParamsToProps &
  StateToProps;

const handlers = {
  makeActivityCopy:
    ({ makeActivityCopy, fetchActivitiesCompany, companyId }: HandlersProps) =>
    (id: number, suffix: string) => {
      makeActivityCopy(id, suffix, {
        onSuccess: () =>
          fetchActivitiesCompany(companyId, { customer_enabled: true }),
      });
    },
  onSubmit:
    ({
      selectedMetaActivityId,
      upsertMetaActivity,
      setSelectedMetaActivityId,
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
