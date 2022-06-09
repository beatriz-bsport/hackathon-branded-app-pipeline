// @flow
import React from 'react';
import { push, goBack } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose, withState, withHandlers } from 'recompose';
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
import { createStyles, Theme } from '@material-ui/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';

import FuzeSearch from '../../components/FuzeSearch.component';

import MetaActivityCreate from '../../libs/meta-activity/components/MetaActivityCreate.drawer';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionButtons from '../../components/button/BottomActionsButton.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';

import MetaActivityList from '../../libs/meta-activity/components/MetaActivityList.component';
import MetaActivityDeleteDialog from '../../libs/meta-activity/components/MetaActivityDeleteDialog.component';
import {
  getPageEnabledMetaActivities,
  getPageDisabledMetaActivities,
  getMetaActivityByCategoryWithActivities,
  getEnabledMetaActivities,
  getEnabledWorkshops,
  getActivitiesByIdList,
  getMetaActivityCategories,
} from '../../libs/meta-activity/selectors';
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
  fetchAllActivities as fetchAllActivitiesAction,
  fetchMetaActivities as fetchMetactivitiesAction,
} from '../../libs/meta-activity/actions';
import { checkCanDeleteMetaActivity as canDeleteMetaActivityAPI } from '../../libs/meta-activity/api/common';

import type { Coach, MetaActivity, Offer } from '../../api/types';
import { fetchMarketingNotificationList } from '../../libs/marketing/actions';
import { withBookingNotification } from '../../libs/marketing/selectors';
import { CategoryList } from '../../components/ordering/CategoryList.component';
import MetaActivityListItem from '#libs/meta-activity/components/MetaActivityListItem.component';
import { OptionCallback, OptionPaginatedCallback } from '../../state/types';
import {
  MetaActivityCategory,
  MetaActivityCategoryWithActivities,
} from '#libs/meta-activity/types';
import { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';
// import AddCategoryButton from '#components/ordering/AddCategoryButton.component';
import CategoryCreationEditDialog from '#components/ordering/CategoryCreationEditDialog.component';

import {
  fetchAllOffers as fetchAllOffersAction,
  createOffers as createOffersActions,
} from '../../libs/offer/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  fetchActivityCompatiblePaymentPacks as fetchActivityCompatiblePaymentPacksAction,
  resetCompatiblePaymentPacks as resetCompatiblePaymentPacksAction,
  createOrUpdate as createPaymentPack,
  fetchAllPaymentPackCategory,
} from '../../libs/payment-packs/actions';

import withTitle from '../../hocs/with-title.hoc';
import themeSelectors from '../../libs/theme/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import {
  getActivityCompatiblePaymentPacks,
  getAllPaymentPackCategory,
} from '../../libs/payment-packs/selectors';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  getAvailableEstablishmentList,
  getAllEstablishments,
} from '../../libs/establishment/selectors';
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
import { Establishment } from '../../libs/establishment/types';
import { PaymentPack } from '../../libs/payment-packs/types';
import { getAvailableRoomBlueprints } from '../../libs/spot-scheduling/selector';
import { fetchRoomBlueprints } from '../../libs/spot-scheduling/actions';
import { RoomBlueprint } from '../../libs/spot-scheduling/types';
import { fetchAllCoachPaymentRules } from '../../libs/coach-payment-rules/actions';
import { CoachPaymentRuleByKindSelector } from '../../libs/coach-payment-rules/selectors';
import { CoachPaymentRule } from '../../libs/coach-payment-rules/types';

import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { Level, LevelFilterSet } from '#libs/level/types';
import { CompanyTheme } from '#libs/theme/types';

type StepType = {
  id: number;
  label: string;
};

type OwnProps = {
  classes: Object;

  id: number;

  compatiblePacksLoading: boolean;
  goBack: () => void;
  metaActivityNames: Array<string>;
  compatiblePaymentPacks: Array<PaymentPack>;
  establishments: Array<Establishment>;
  fetchEstablishments: () => void;
  SCTs: any;

  onSubmitMetaActivity: () => void;
  coaches: Array<Coach>;
  fetchAssociatedCoachesList: () => void;
  setStep: (step: StepType) => void;
  step: StepType;
  upsertedMetaActivity: MetaActivity;
  fetchPaymentPacks: (id: number) => void;
  offerHadError: Error;
  // createOffers: () => void,
  offerIsProcessing: boolean;
  goToMetaActivity: (id: number) => void;
  t: TFunction;
  goToPaymentPackCreate: () => void;
  resetPaymentPacks: () => void;
  companyTheme: CompanyTheme;
  fetchRoomBlueprints: () => void;
  roomBlueprints: Array<RoomBlueprint>;
  fetchAllCoachPaymentRules: () => void;
  coachPaymentRulesByKind: { [kind: number]: Array<CoachPaymentRule> };
  fetchAllActivities: (data: { customer_enabled: true }) => void;
  fetchMetactivities: () => void;
  fetchAllPaymentPacks: () => void;
  fetchAllPaymentPackCategory: () => void;
  fetchAllOffers: any;
  establishmentList: any;
  allEstablishmentList: any;
  createOrUpdatePaymentPackAction: (data: any, options: any) => void;
  // metaActivities: any,
  allTagsWithTagGroup: any;
  paymentPackCategories: any;
  createPaymentPack: (data: any, options: any) => void;
  categoryList: any;
  showPartnership: boolean;
  metaActivityCategories: Array<MetaActivityCategoryWithActivities>;

  activeCustomLevels: Level[];
  allCustomLevels: Level[];
  createOffers: (data: Offer, options: OptionCallback) => void;
  fetchLevelList: (
    params: LevelFilterSet,
    options?: OptionPaginatedCallback<Level>,
  ) => void;
  updateLevel: (id: number, data: Level, options: OptionCallback) => void;
  createLevel: (data: Level, options?: OptionCallback<Level>) => void;
  deleteLevel: (id: number, options?: OptionCallback) => void;
  companyId: number;

  enabledMetaActivities: Array<MetaActivity>;
  metaActivities: Array<MetaActivity>;
  disabledMetaActivities: Array<MetaActivity>;
  loading: boolean;
  notificationLoading: boolean;

  fetchAllMetactivities: () => void;
  goToDetail: (metaActivityId: number) => void;
  goToEdit: (metaActivityId: number) => void;
  onCreate: () => void;
  deleteMetaActivity: (metaActivityId: number) => void;
  restoreMetaActivity: (MetaActivityId: number) => void;
  setActivityToDelete: (id: number) => void;
  activityToDelete: (activity: number) => void;
  fetchMarketingNotificationList: (params: any) => void;

  goToPaymentPack: (id: number) => void;

  makeActivityCopy: (
    id: number,
    suffix: string,
    options?: OptionCallback,
  ) => void;

  metaActivityCategoriesWithActivities: Array<MetaActivityCategoryWithActivities>;
  fetchAllMetaActivityCategory: (companyId?: number) => void;
  upsertMetaActivityCategory: (
    category: MetaActivityCategory,
    options?: OptionCallback,
  ) => void;
  deleteMetaActivityCategory: (
    category: MetaActivityCategoryWithActivities,
    options?: OptionCallback<MetaActivityCategoryWithActivities>,
  ) => void;
  editOrderMetaActivity: (
    data: Array<{ id: number; ordering_in_category: number }>,
    options?: OptionCallback,
  ) => void;
  updateMetaActivityCategoryOrder: (
    data: Array<{ id: number; category_ordering: number }>,
    options?: OptionCallback,
  ) => void;
  categoryLoading: boolean;
  fetchMetaActivityBulkAfterCategoryDelete: (ids: Array<number>) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  searchText: string;
  searchResult: Array<MetaActivity>;
  showDisabled: boolean;
  showCategoryDialog: boolean;
  selectedCategory: MetaActivityCategory;
  formIsOpen: boolean;
};

const BOOKING_CREATION_NOTIFICATION = 2;

export class MetaActivityListPage extends React.Component<Props, State> {
  state: State = {
    searchText: '',
    searchResult: [],
    showDisabled: false,
    showCategoryDialog: false,
    selectedCategory: null,
    formIsOpen: false,
  };

  componentDidMount() {
    this.props.fetchAllActivities();

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
    this.setState({ formIsOpen: false });
  };

  renderCreateActivity = () => {
    return (
      <MetaActivityCreate
        onClose={this.onCancelForm}
        offerIsProcessing={this.props.offerIsProcessing}
        offerHadError={this.props.offerHadError}
        establishments={this.props.establishments}
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
        categoryList={this.props.categoryList}
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
      />
    );
  };

  render() {
    const { classes, t } = this.props;
    if (
      (this.props.enabledMetaActivities || []).length +
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
                  goToEdit={this.props.goToEdit}
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
            onEditItem={this.props.goToEdit}
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
                goToEdit={this.props.goToEdit}
                deleteMetaActivity={this.props.setActivityToDelete}
                makeActivityCopy={this.props.makeActivityCopy}
                restoreMetaActivity={this.restoreMetaActivity}
              />
            </Collapse>
          </div>
        )}

        <MetaActivityDeleteDialog
          metaActivityId={this.props.activityToDelete}
          onClose={() => this.props.setActivityToDelete(null)}
          canDeleteMetaActivityChecker={canDeleteMetaActivityAPI}
          deleteMetaActivity={this.props.deleteMetaActivity}
        />
        <BottomActionButtons
          onCreateLabel={this.props.t('actions.addActivity')}
          onCreate={() => {
            this.setState({ formIsOpen: true });
          }}
        />
        {this.state.formIsOpen ? this.renderCreateActivity() : ''}
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
  });

export default compose(
  withStyles(styles),
  withTranslation(['metaActivity', 'titles']),
  routerParamsToProps({ id: 'id:number' }),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:metaActivity.metaActivityList'),
  ),
  connect(
    (state: RootState) => ({
      metaActivities: uniqBy(
        [
          ...getEnabledMetaActivities(state),
          ...getEnabledWorkshops(state),
          ...getActivitiesByIdList(state, []),
        ],
        'id',
      ),
      enabledMetaActivities: withBookingNotification(
        getPageEnabledMetaActivities,
      )(state),
      disabledMetaActivities: getPageDisabledMetaActivities(state),
      loading: state.metaActivity.loading || state.metaActivity.delete.loading,
      notificationLoading: state.booking.notification.loading,
      metaActivityCategories: getMetaActivityCategories(state),
      metaActivityCategoriesWithActivities:
        getMetaActivityByCategoryWithActivities(
          withBookingNotification(getPageEnabledMetaActivities),
        )(state),
      categoryLoading: state.metaActivity.metaActivityCategory.loading,
      // from MetaActivityCreate now
      offerIsProcessing: state.offer.create.loading,
      offerHadError: state.offer.create.error,
      establishments: getAvailableEstablishmentList(state),
      SCTs: state.category.SCTs,
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
      categoryList: state.category.SCTs,
      showPartnership: state.theme.theme.has_partnership,
      activeCustomLevels: getActiveCustomLevels(state),
      allCustomLevels: getAllCustomLevels(state),
      companyId: state.theme.theme.company,
    }),
    {
      makeActivityCopy: makeActivityCopyAction,
      goToDetail: (metaActivityId: number) =>
        push(`/activity/${metaActivityId}/general`),
      goToEdit: (metaActivityId: number) =>
        push(`/activity/${metaActivityId}/edit`),
      goToPaymentPack: () => push('/payment-pack'),
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
      fetchAllActivities: fetchAllActivitiesAction,
      fetchMetactivities: fetchMetactivitiesAction,
      fetchAllPaymentPackCategory,
      createOrUpdatePaymentPackAction: createPaymentPack,
      createOffers: createOffersActions,
      fetchLevelList: fetchLevelListAction,
      updateLevel: updateLevelAction,
      createLevel: createLevelAction,
      deleteLevel: deleteLevelAction,
    },
  ),
  withHandlers({
    makeActivityCopy:
      ({ makeActivityCopy, fetchAllActivities }) =>
      (id: number, suffix: string) => {
        makeActivityCopy(id, suffix, {
          onSuccess: () => fetchAllActivities({ customer_enabled: true }),
        });
      },
  }),
  withState('activityToDelete', 'setActivityToDelete', null),
)(MetaActivityListPage);
