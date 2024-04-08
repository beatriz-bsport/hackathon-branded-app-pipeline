// @ts-nocheck
// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers, withStateHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import memoize from 'memoize-one';
import { push as pushRouter } from 'connected-react-router';
import Collapse from '@material-ui/core/Collapse';
import Fuse, { FuseOptions } from 'fuse.js';
import { Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import uniqBy from 'lodash/uniqBy';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import themeSelectors from '#libs/theme/selectors';
import withTitle from '#hocs/with-title.hoc';
import BackofficeLinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import {
  getPrivatePassCustomerEnabled,
  getAvailablePrivatePasses,
  getUnavailablePrivatePasses,
  getCompatibilityPassWithService as getCompatibleServicePass,
  getCompatibleServicePassLoading,
  withLinkedPaymentPack,
} from '#libs/private-service/selectors/private-pass';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { getPrivateServices } from '#libs/private-service/selectors/private-service';
import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  createOrUpdatePrivatePass as createOrUpdatePrivatePassAction,
  deletePrivatePass,
  restorePrivatePass,
  editOrderPrivatePass,
  fetchAllPrivatePassCategory,
  upsertPrivatePassCategory as upsertPrivatePassCategoryAction,
  updatePrivatePassCategoryOrder,
  deletePrivatePassCategory,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
  fetchAllPrivateSlots,
  isPrivatePassUsedInCombo,
} from '#libs/private-service/actions';
import PrivatePassListItem from '#libs/private-service/components/pass/PrivatePassListItem.component';
import PrivatePassForm from '#libs/private-service/components/pass/private-pass-form/PrivatePassForm.component';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassCategoryWithPasses,
  ServiceCompatibilityPass,
  PrivateSlot,
} from '#libs/private-service/types';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import FuzeSearch from '#components/FuzeSearch.component';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';
import { PrivatePassCategoryList } from '#libs/private-service/components/category/PrivatePassCategoryList.component';
import PrivatePassCategoryCreationDialog from '#libs/private-service/components/category/PrivatePassCategoryCreationDialog.component';
import {
  getPrivatePassByCategoryWithPasses,
  getPrivatePassCategories,
} from '#libs/private-service/selectors/private-pass-category';
import PaymentPackFilterAndSortHeader, {
  ManagerOnly,
  SortOption,
} from '#libs/payment-packs/components/PaymentPackFilterAndSortHeader.component';
import {
  setPrivatePassCategoryFilter,
  setPrivatePassManagerOnlyFilter,
  setPrivatePassSort,
} from '#libs/user-preference/actions';
import { OptionCallback } from '../../state/types';
import { getFormInitial } from '#libs/private-service/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import { fetchOne as fetchPaymentPackAction } from '#libs/payment-packs/actions';
import type { PaymentPack } from '#libs/payment-packs/types';
import { getAllEstablishments } from '#libs/establishment/selectors';
import { getEditableSCTs } from '#libs/category/selectors';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#libs/meta-activity/selectors';
import { fetchEstablishments } from '../../libs/establishment/actions';
import {
  fetchActivitiesCompany,
  fetchMetaActivities as fetchMetaActivitiesAction,
} from '../../libs/meta-activity/actions';
import PrivatePassDeleteDialog from '#libs/private-service/components/pass/PrivatePassDeleteDialog.component';
import UniversalPassRestoreDialog from '#libs/universal-pass/components/UniversalPassRestoreDialog.component';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { fetchTags } from '#libs/tag/actions';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#libs/payment/constants';

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PrivatePassCategory,
);

type OwnProps = {
  setOpenDeleteCompatibility: (id: number) => void;
  openDeleteCompatibilityDialog: number;
  archivationWarning: { [id: number]: { use_in_combo: boolean } };
};

type StateHandlerInit = {
  openCreateForm: boolean;
  openEditForm: boolean;
  openDeletePassDialog: number | null;
  showDisabled: boolean;
  showCategoryDialog: boolean;
  selectedPrivatePass: PrivatePass<PaymentPack> | null;
  selectedCategory: PrivatePassCategory | null;
  compatibleServicePassOfSelectedPass: ServiceCompatibilityPass | null;
  compatibilityLoading: boolean;
  openRestoreUniversalPassDialog: boolean;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;

type Props = OwnProps &
  ConnectedProps &
  StateHandlerType &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

type State = {
  searchText: string;
  searchResult: Array<PrivatePass>;
  selectedCategories: Array<number>;
  selectedDisponibility: ManagerOnly;
  selectedSortOption: SortOption;
  privatePassOrderByCategory: Array<{
    id: number;
    ordering_in_category: number;
  }> | null;
};
export class PrivatePassList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
      searchResult: [],
      selectedCategories: this.props.userPreferenceSelectedCategories,
      selectedDisponibility: this.props.userPreferenceSelectedDisponibility,
      selectedSortOption: this.props.userPreferenceSortOption,
      privatePassOrderByCategory: null,
    };
  }

  componentDidMount() {
    this.props.fetchPrivatePassList();
    this.props.fetchAllPrivateServices();
    this.props.fetchAllPrivatePassCategory();

    this.props.fetchEstablishments();
    this.props.fetchActivitiesCompany(this.props.theme.company, {
      customer_enabled: true,
    });
    this.props.fetchMetaActivities();
    this.props.fetchTags();
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchBookkeepingAccountList();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (prevState.selectedSortOption !== this.state.selectedSortOption)
      this.updateSortOption(this.state.selectedSortOption);
    if (prevState.selectedCategories !== this.state.selectedCategories)
      this.props.setPrivatePassCategoryFilter(this.state.selectedCategories);
    if (prevState.selectedDisponibility !== this.state.selectedDisponibility)
      this.props.setPrivatePassManagerOnlyFilter(
        this.state.selectedDisponibility,
      );
    if (
      prevProps.privatePassByCategory.length !==
      this.props.privatePassByCategory.length
    )
      this.categoryOptions.apply({}, []);
    if (
      prevProps.selectedPrivatePass?.id !== this.props.selectedPrivatePass?.id
    ) {
      this.props.fetchCompatibleServicePasses();
      if (this.props.selectedPrivatePass?.linked_payment_pack?.id) {
        this.props.fetchPaymentPack(
          this.props.selectedPrivatePass.linked_payment_pack.id,
        );
      }
    }
  }

  onShowDisabled = () => {
    this.props.setShowDisabled(!this.props.showDisabled);
  };

  restorePrivatePass = async (id: number) => {
    if (this.props.disabledPrivatePassList.length === 1) {
      this.props.setShowDisabled(false);
    }
    const restorePrivatePassIsUniversal =
      !!this.props.disabledPrivatePassList?.find(
        (private_pass: PrivatePass) => private_pass.id === id,
      )?.linked_payment_pack;

    this.props.restorePrivatePass(id, {
      onSuccess: () => {
        if (restorePrivatePassIsUniversal) {
          this.props.setOpenRestoreUniversalPassdialog(true);
        }
      },
    });
  };

  changeSearch =
    (fuse: Fuse<PrivatePass, FuseOptions<PrivatePass>>) =>
    (ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      this.setState({
        searchText: ev.target.value,
        searchResult: fuse.search(ev.target.value),
      });
    };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  categoryOptions = memoize(() => [
    ...this.props.privatePassByCategory.map((cat) => {
      return {
        value: cat.id || -1,
        label: cat.name || this.props.t('paymentPack:noCategory.name'),
      };
    }),
  ]);

  updateOrderBySortOption(
    sortFunction: (pp1: PrivatePass, pp2: PrivatePass) => number,
  ) {
    const toUpdate: Array<{
      id: number;
      ordering_in_category: number;
    }> | null = [];
    this.props.privatePassByCategory.forEach(
      (category: PrivatePassCategoryWithPasses) => {
        const sorted = [...category.passes].sort((pp1, pp2) =>
          sortFunction(pp1, pp2),
        );
        toUpdate.push(
          ...sorted
            .map((pp, index) => {
              return pp.ordering_in_category !== index
                ? {
                    id: pp.id,
                    ordering_in_category: index,
                  }
                : null;
            })
            .filter((data) => data),
        );
      },
    );
    this.setState({ privatePassOrderByCategory: toUpdate });
  }

  updateSortOption(option: SortOption) {
    this.props.setPrivatePassSort(option);
    switch (option) {
      case SortOption.ascendingPrice:
        return this.updateOrderBySortOption(
          (pp1, pp2) => pp1.price - pp2.price,
        );
      case SortOption.descendingPrice:
        return this.updateOrderBySortOption(
          (pp1, pp2) => pp2.price - pp1.price,
        );
      case SortOption.ascendingCredit:
        return this.updateOrderBySortOption((pp1, pp2) => {
          if (pp1.credits !== 0 && !pp1.credits) return 1;
          if (pp2.credits !== 0 && !pp2.credits) return -1;
          return pp1.credits - pp2.credits;
        });
      case SortOption.descendingCredit:
        return this.updateOrderBySortOption((pp1, pp2) => {
          if (pp2.credits !== 0 && !pp2.credits) return 1;
          if (pp1.credits !== 0 && !pp1.credits) return -1;
          return pp2.credits - pp1.credits;
        });
      default:
        return this.setState({ privatePassOrderByCategory: null });
    }
  }

  categoryFilterOnchange = (categories: Array<number>) => {
    this.setState({
      selectedCategories: categories,
    });
  };

  managerOnlyOnChange = (value: number) =>
    this.setState({
      selectedDisponibility: value,
    });

  sortOnChange = (sortOpt: number) => {
    this.setState({
      selectedSortOption: sortOpt,
    });
  };

  openFormAndUploadCompatibilityInfo = (pass: PrivatePass) => {
    this.props.setSelectedPrivatePass(pass);
    this.props.setOpenEditForm(true);
  };

  openDeletePassDialog = (passId: number) => {
    this.props.isPrivatePassUsedInCombo(passId);
    this.props.setOpenDeletePassDialog(passId);
  };

  OpenEditForm = (privatePass: PrivatePass) =>
    this.openFormAndUploadCompatibilityInfo(privatePass);

  getOpenEditFormHandler = (privatePass: PrivatePass) => () =>
    this.openFormAndUploadCompatibilityInfo(privatePass);

  getRestorePrivatePassHandler = (pass: PrivatePass) => () =>
    this.restorePrivatePass(pass.id);

  getDeletePassHandler = (pass: PrivatePass) => () =>
    this.openDeletePassDialog(pass.id);

  render() {
    const { classes, t, establishmentList, metaActivities, categoryList } =
      this.props;
    const paymentPackCategoryList = [...categoryList]
      .filter(
        (category) =>
          metaActivities.map((a) => a.SCT).indexOf(category.id) !== -1,
      )
      .concat(this.props.videoCategories)
      .filter(
        (value, index, arr) =>
          arr.findIndex((sct) => sct.id === value.id) === index,
      );

    const passSelectedForDelete = this.props.privatePassList.find(
      (private_pass: PrivatePass) =>
        private_pass.id === this.props.openDeletePassDialog,
    );
    if (
      (this.props.privatePassList || []).length +
        (this.props.disabledPrivatePassList || []).length ===
        0 &&
      !this.props.loading
    ) {
      return (
        <div>
          <IsEmptyList
            button={this.props.t('privatePass.list.createButton')}
            onCreate={() => this.props.setOpenCreateForm(true)}
            onCreateLabel={this.props.t('privatePass.list.createButton')}
            text={this.props.t('noPrivatePass')}
          />
          <GenericResponsiveDrawer
            onClose={() => this.props.closePrivatePassForm()}
            open={this.props.openCreateForm}
            title={this.props.t('privatePass.form.title')}
            trackingObjectIdentifier={
              SegmentAnalyticsFormObjectIdentifier.PrivatePass
            }
          >
            <PrivatePassForm
              bookkeepingAccountById={this.props.bookingAccountById}
              bookkeepingAccounts={this.props.bookingAccounts}
              categoryList={paymentPackCategoryList}
              compatibleServicePass={this.props.compatibleServicePass}
              establishmentList={establishmentList}
              metaActivityList={metaActivities}
              onCancel={() => this.props.closePrivatePassForm()}
              onSubmit={this.props.createOrUpdatePrivatePass}
              privatePassCategories={this.props.privatePassCategories}
              privateServices={this.props.privateServices}
              tagList={this.props.allTagsWithTagGroup}
            />
          </GenericResponsiveDrawer>
        </div>
      );
    }
    return (
      <ObjectLevelPermissionProviderComponent
        requiredPermission={[
          'product.privatePass.allowed_actions.create',
          'product.privatePass.allowed_actions.edit',
          'product.privatePass.allowed_actions.delete',
        ]}
      >
        {([
          hasCreatePermission,
          hasEditPermission,
          hasDeletePermission,
        ]: boolean[]) => (
          <div>
            {!!this.props.loading && <BackofficeLinearProgress />}
            <div className={classes.search}>
              <div className={classes.buttonRow}>
                <div style={{ flex: 1 }}>
                  <FuzeSearch
                    changeSearch={this.changeSearch}
                    clearSearch={this.clearSearch}
                    items={this.props.privatePassListCustomerEnabled}
                    placeholder={t('searshAppointmentPass')}
                    searchFields={['name']}
                    searchResult={this.state.searchResult}
                    searchText={this.state.searchText}
                  />
                </div>
                {hasCreatePermission && (
                  <Button
                    color="primary"
                    onClick={() => {
                      this.props.setShowCategoryDialog(true);
                      trackFormAdd();
                    }}
                    variant="outlined"
                  >
                    <AddIcon color="primary" />
                    {t('paymentPack:category.add')}
                  </Button>
                )}
              </div>
            </div>
            <Paper
              className={
                this.state.searchResult.length > 0 &&
                this.state.searchText !== ''
                  ? classes.searchPaperDisplayed
                  : classes.searchPaperHidden
              }
            >
              <Collapse
                in={
                  this.state.searchResult.length > 0 &&
                  this.state.searchText !== ''
                }
              >
                <List disablePadding>
                  {this.state.searchResult
                    .filter((pp) => !pp.manager_only)
                    .map((pass) => (
                      <PrivatePassListItem
                        key={pass.id}
                        divider
                        draggable={hasEditPermission}
                        onClick={() => {
                          this.props.goToPass(pass.id);
                        }}
                        onDelete={
                          hasDeletePermission && this.getDeletePassHandler(pass)
                        }
                        onEdit={
                          hasEditPermission && this.getOpenEditFormHandler(pass)
                        }
                        pass={pass}
                        updatePrivatePass={this.props.createOrUpdatePrivatePass}
                      />
                    ))}
                </List>
              </Collapse>
            </Paper>
            <PaymentPackFilterAndSortHeader
              categoryFilterOnchange={this.categoryFilterOnchange}
              categoryOptions={this.categoryOptions()}
              categoryValue={this.state.selectedCategories}
              managerOnlyOnChange={this.managerOnlyOnChange}
              managerOnlyValue={this.state.selectedDisponibility}
              sortOnChange={this.sortOnChange}
              sortValue={this.state.selectedSortOption}
            />
            <div className={this.props.classes.leftPanel}>
              {!this.props.privatePassList.length && !this.props.loading && (
                <Typography variant="caption">
                  {this.props.t('privatePass.list.isEmpty')}
                </Typography>
              )}
              <PrivatePassCategoryList
                deletePrivatePassCategory={this.props.deletePrivatePassCategory}
                filteredCategories={this.state.selectedCategories}
                filterManagerOnly={this.state.selectedDisponibility}
                goToPass={this.props.goToPass}
                itemsDraggable={hasEditPermission}
                onEditPass={hasEditPermission && this.OpenEditForm}
                privatePassCategoryById={this.props.privatePassByCategory}
                privatePassOrder={this.state.privatePassOrderByCategory}
                setOpenDeletePassDialog={
                  hasDeletePermission && this.openDeletePassDialog
                }
                setSelectedCategory={this.props.setSelectedCategory}
                showCategoryEditDialog={() =>
                  this.props.setShowCategoryDialog(true)
                }
                updateCategoryOrder={this.props.updatePrivatePassCategoryOrder}
                updatePassOrder={this.props.editOrderPrivatePass}
              />
            </div>
            {this.props.disabledPrivatePassList?.length ? (
              <div className={classes.disbabledList}>
                <div className={classes.buttonTitle}>
                  <Typography className={classes.sectionTitle} variant="h5">
                    {`${t('disabledPacksTitle')} (${
                      (this.props.disabledPrivatePassList || []).length
                    })`}
                  </Typography>

                  <IconButton onClick={this.onShowDisabled}>
                    {this.props.showDisabled ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </div>
                <Divider className={classes.divider} />
                <Collapse
                  unmountOnExit
                  className={classes.collapse}
                  in={this.props.showDisabled}
                >
                  <List disablePadding>
                    {this.props.disabledPrivatePassList.map(
                      (pass: PrivatePass) => (
                        <PrivatePassListItem
                          key={pass.id}
                          disabled
                          divider
                          onRestore={
                            hasEditPermission &&
                            this.getRestorePrivatePassHandler(pass)
                          }
                          pass={pass}
                        />
                      ),
                    )}
                  </List>
                </Collapse>
              </div>
            ) : null}
            <GenericResponsiveDrawer
              onClose={() => this.props.closePrivatePassForm()}
              open={
                (this.props.openEditForm || this.props.openCreateForm) &&
                !this.props.compatibleServicePassLoading
              }
              subtitle={this.props.selectedPrivatePass?.name}
              title={this.props.t('privatePass.form.title')}
              trackingObjectId={this.props.selectedPrivatePass?.id}
              trackingObjectIdentifier={
                SegmentAnalyticsFormObjectIdentifier.PrivatePass
              }
            >
              <PrivatePassForm
                bookkeepingAccountById={this.props.bookingAccountById}
                bookkeepingAccounts={this.props.bookingAccounts}
                categoryList={paymentPackCategoryList}
                compatibleServicePass={this.props.compatibleServicePass}
                establishmentList={establishmentList}
                initial={getFormInitial(
                  this.props.selectedPrivatePass,
                  this.props.compatibleServicePass,
                )}
                metaActivityList={metaActivities}
                onCancel={(ev: { stopPropagation: () => void }) => {
                  ev.stopPropagation();
                  this.props.closePrivatePassForm();
                }}
                onSubmit={this.props.createOrUpdatePrivatePass}
                privatePassCategories={this.props.privatePassCategories}
                privateServices={this.props.privateServices}
                provincialTax={this.props.theme?.provincial_tax_value}
                tagList={this.props.allTagsWithTagGroup}
              />
            </GenericResponsiveDrawer>
            <PrivatePassDeleteDialog
              onCancel={() => this.props.setOpenDeletePassDialog(null)}
              onConfirm={() =>
                this.props.deletePrivatePass(this.props.openDeletePassDialog)
              }
              open={!!this.props.openDeletePassDialog}
              pass={passSelectedForDelete}
              usedInCombo={
                this.props.archivationWarning[this.props.openDeletePassDialog]
                  ?.used_in_combo
              }
            />

            {hasCreatePermission && (
              <Fab
                className={this.props.classes.addButton}
                color="primary"
                onClick={() => this.props.setOpenCreateForm(true)}
                variant="extended"
              >
                <AddIcon className={this.props.classes.leftIcon} />
                {this.props.t('privatePass.list.createButton')}
              </Fab>
            )}
            {this.props.showCategoryDialog && (
              <PrivatePassCategoryCreationDialog
                handleClose={() => {
                  this.props.closePrivatePassCategoryForm();
                  trackFormCancel(this.props.selectedCategory?.id);
                }}
                onSubmit={this.props.upsertPrivatePassCategory}
                open={this.props.showCategoryDialog}
                privatePassCategorySelected={this.props.selectedCategory}
                trackIntent={() =>
                  trackFormSubmitIntent(this.props.selectedCategory?.id)
                }
              />
            )}
            {this.props.openRestoreUniversalPassDialog && (
              <UniversalPassRestoreDialog
                open
                onConfirm={() =>
                  this.props.setOpenRestoreUniversalPassdialog(false)
                }
              />
            )}
          </div>
        )}
      </ObjectLevelPermissionProviderComponent>
    );
  }
}

const styles = (theme: Theme): any => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  disbabledList: {
    paddingBottom: theme.spacing(16),
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  leftPanel: {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingRight: theme.spacing(2),
    },
  },
  buttonTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: theme.spacing(1),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  search: { marginBottom: theme.spacing(2) },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    borderTop: '0px',
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
  searchPaperHidden: {
    border: '1px solid',
    borderTop: '0px',
    borderBottom: '0px',
  },
  divider: {
    marginBottom: theme.spacing(2),
  },
  buttonRow: {
    display: 'flex',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  buttonAdd: {
    display: 'flex',
    whiteSpace: 'nowrap',
  },
  collapse: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  formTitle: {
    fontWeight: 500,
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
});

const mapStateToProps = (state: RootState) => ({
  privatePassListCustomerEnabled: withLinkedPaymentPack(
    getPrivatePassCustomerEnabled,
  )(state),
  privatePassList: withLinkedPaymentPack(getAvailablePrivatePasses)(state),
  disabledPrivatePassList: getUnavailablePrivatePasses(state),
  privatePassCategories: getPrivatePassCategories(state),
  privatePassByCategory: getPrivatePassByCategoryWithPasses(
    withLinkedPaymentPack(getAvailablePrivatePasses),
  )(state),
  loading: state.privateService.privatePass.loading,
  theme: themeSelectors.getTheme(state),
  userPreferenceSortOption: state.userPreference.privatePassSort,
  userPreferenceSelectedCategories:
    state.userPreference.privatePassCategoryFilter,
  userPreferenceSelectedDisponibility:
    state.userPreference.privatePassManagerOnlyFilter,
  privateServices: getPrivateServices(state),
  compatibleServicePass: getCompatibleServicePass(state),
  compatibleServicePassLoading: getCompatibleServicePassLoading(state),
  archivationWarning: state.privateService.privatePass.archivationWarning,
  categoryList: getEditableSCTs(state),
  establishmentList: getAllEstablishments(state),
  metaActivities: uniqBy(
    [
      ...getEnabledMetaActivities(state),
      ...getEnabledWorkshops(state),
      ...getActivitiesByIdList(state, []),
    ],
    'id',
  ),
  allTagsWithTagGroup: getAllTagsWithTagGroup(state),
  videoCategories: state.video.filterableParams.items.SCTs,
  bookingAccounts: getBookkeepingAccountList(state),
  bookingAccountById: getBookkeepingAccountById(state),
});

const mapDispatchToProps = {
  fetchPrivatePassList,
  fetchAllPrivateServices: () => fetchAllPrivateServices({ mine: true }),
  goToPass: (id: number) => pushRouter(`/private-service/pass/${id}`),
  createOrUpdatePrivatePassAction,
  deletePrivatePass,
  restorePrivatePass,
  editOrderPrivatePass,
  fetchAllPrivatePassCategory,
  upsertPrivatePassCategoryAction,
  updatePrivatePassCategoryOrder,
  deletePrivatePassCategory,
  setPrivatePassCategoryFilter,
  setPrivatePassManagerOnlyFilter,
  setPrivatePassSort,
  fetchPrivateSlotsByService: fetchAllPrivateSlots,
  fetchCompatibleServicePassList: fetchCompatibleServicePassListAction,
  isPrivatePassUsedInCombo,
  fetchPaymentPack: fetchPaymentPackAction,
  fetchEstablishments,
  fetchActivitiesCompany,
  fetchMetaActivities: fetchMetaActivitiesAction,
  fetchTags,
  fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
};

const withStateHandlersInit: StateHandlerInit = {
  openCreateForm: false,
  openEditForm: false,
  openDeletePassDialog: null,
  showDisabled: false,
  showCategoryDialog: false,
  selectedPrivatePass: null,
  selectedCategory: null,
  openRestoreUniversalPassDialog: false,
};

const withStateHandlersSetter = {
  setOpenCreateForm: () => (openCreateForm: boolean) => {
    return { openCreateForm };
  },
  setOpenEditForm: () => (openEditForm: boolean) => {
    return { openEditForm };
  },
  setOpenDeletePassDialog: () => (openDeletePassDialog: number | null) => {
    return { openDeletePassDialog };
  },
  setShowDisabled: () => (showDisabled: boolean) => {
    return { showDisabled };
  },
  setShowCategoryDialog: () => (showCategoryDialog: boolean) => {
    return { showCategoryDialog };
  },
  setSelectedPrivatePass: () => (selectedPrivatePass: PrivatePass | null) => {
    return { selectedPrivatePass };
  },
  setSelectedCategory: () => (selectedCategory: PrivatePassCategory | null) => {
    return { selectedCategory };
  },
  closePrivatePassForm: () => () => ({
    openCreateForm: false,
    openEditForm: false,
    openDeletePassDialog: null,
    selectedPrivatePass: null,
  }),
  closePrivatePassCategoryForm: () => () => {
    return { showCategoryDialog: false, selectedCategory: null };
  },

  setOpenRestoreUniversalPassdialog:
    () => (openRestoreUniversalPassDialog: boolean) => {
      return { openRestoreUniversalPassDialog };
    },
};

const mapWithHandlers = {
  upsertPrivatePassCategory:
    (props: OwnAndConnectedProps) => (category: PrivatePassCategory) => {
      props.upsertPrivatePassCategoryAction(category, {
        onSuccess: () => {
          trackFormSuccess(category?.id);
          props.closePrivatePassCategoryForm();
          props.fetchAllPrivatePassCategory();
        },
      });
    },
  deletePrivatePassCategory:
    (props: OwnAndConnectedProps) =>
    (category: PrivatePassCategoryWithPasses) => {
      props.deletePrivatePassCategory(category, {
        onSuccess: () => {
          props.closePrivatePassCategoryForm();
          props.fetchPrivatePassList(
            category.passes.filter((p) => p?.id).map((p) => p.id),
          );
        },
      });
    },
  deletePrivatePass: (props: OwnAndConnectedProps) => (id: number) => {
    props.deletePrivatePass(id);
    props.closePrivatePassForm();
  },
  createOrUpdatePrivatePass:
    (props: OwnAndConnectedProps) => (data: any, options?: OptionCallback) => {
      props.createOrUpdatePrivatePassAction(
        data,
        props.selectedPrivatePass?.id || null,
        {
          onSuccess: () => {
            if (options?.onSuccess) options.onSuccess();
            props.closePrivatePassForm();
          },
          onError: () => {
            if (options?.onError) options.onError();
          },
        },
      );
    },
  fetchCompatibleServicePasses: (props: OwnAndConnectedProps) => () => {
    if (props.selectedPrivatePass) {
      props.fetchCompatibleServicePassList(props.selectedPrivatePass.id, {
        onSuccess: (csps) => {
          const private_service__in = csps?.map(
            (c: PrivateSlot) => c.private_service,
          );
          if (private_service__in?.length !== 0) {
            props.fetchPrivateSlotsByService({
              private_service__in,
            });
          }
        },
      });
    }
  },
  fetchBookkeepingAccountList:
    ({ fetchBookkeepingAccountList }) =>
    () => {
      fetchBookkeepingAccountList({ is_active: true });
    },
};

export default compose(
  routerParamsToProps({
    id: 'id:number',
  }),
  withTranslation(['privateService']),
  withTitle(({ t }) => t('pageTitles.passList')),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withState(
    'openDeleteCompatibilityDialog',
    'setOpenDeleteCompatibility',
    false,
  ),
  withHandlers(mapWithHandlers),
)(PrivatePassList);
