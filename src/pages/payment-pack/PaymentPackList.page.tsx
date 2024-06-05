import React, { MouseEvent } from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Theme, createStyles } from '@material-ui/core/styles';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { push as pushRouter } from 'connected-react-router';
import IconButton from '@material-ui/core/IconButton';
import memoize from 'memoize-one';
import uniqBy from 'lodash/uniqBy';
import { Alert } from '@material-ui/lab';
import type { OptionPropsWithData } from '#src/libs/fuzzy-search/types';

import { VideoStatusEnum } from '#src/libs/video/types';
import PaginatedConsumerPackList from '#src/libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import IsEmptyList from '#src/components/navigation/IsEmptyList.component';
import PaymentPackListItem from '#src/libs/payment-packs/components/PaymentPackListItem.component';
import PaymentPackDeleteDialog from '#src/libs/payment-packs/components/PaymentPackDeleteDialog.component';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import {
  fetchPaymentPackList as fetchPaymentPackListAction,
  patch as patchPaymentPack,
  fetchAllPaymentPackCategory,
  upsertPaymenPackCategory,
  deletePaymentPackCategory,
  fetchPaymentPackBulk,
  updatePaymentPackCategoryOrder,
  updateOrder as updatePaymentPack,
  createOrUpdate as createOrUpdatePaymentPackAction,
  isPaymentPackUsedInCombo,
  resetDisabledPaymentPack,
} from '#src/libs/payment-packs/actions';
import BottomActionsButton from '#src/components/button/BottomActionsButton.component';
import {
  withSCT,
  getEnabledPaymentPacks,
  getDisabledPaymentPacks,
  groupByCategory,
  getAllPaymentPackCategory,
  withLinkedPrivatePass,
} from '#src/libs/payment-packs/selectors';
import { fetchVideoFilterableParams } from '#src/libs/video/actions';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';
import { getAvailableEstablishmentList } from '#src/libs/establishment/selectors';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#src/libs/meta-activity/selectors';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { getPrivateServices } from '#src/libs/private-service/selectors/private-service';
import { getCompatibilityPassWithService as getCompatibleServicePass } from '#src/libs/private-service/selectors/private-pass';
import type { PrivatePass, PrivateSlot } from '#src/libs/private-service/types';
import { getEditableSCTs } from '#src/libs/category/selectors';

import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
} from '#src/libs/private-service/actions';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { refreshCompanyTheme as refreshCompanyThemeAction } from '#src/libs/theme/actions';
import NoShowPenaltyDialog from '#src/libs/payment-packs/components/PaymentPackForm/NoShowPenaltyDialog.component';
import DeleteNoShowPenaltyDialog from '#src/libs/payment-packs/components/PaymentPackForm/DeleteNoShowPenaltyDialog.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '#src/libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '#src/libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '#src/libs/payment/constants';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import {
  withObjectSearch,
  WithObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';

import themeSelectors from '../../libs/theme/selectors';
import {
  fetchActivitiesCompany,
  fetchMetaActivities as fetchMetaActivitiesAction,
} from '../../libs/meta-activity/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import PaymentPackFormDrawer from '../../libs/payment-packs/components/PaymentPackForm';
import PaymentPackFilterAndSortHeader, {
  ManagerOnly,
  SortOption,
} from '../../libs/payment-packs/components/PaymentPackFilterAndSortHeader.component';
import {
  setPaymentPackCategoryFilter,
  setPaymentPackManagerOnlyFilter,
  setPaymentPackSort,
} from '../../libs/user-preference/actions';
import PaymentPackCategoryList from '../../libs/payment-packs/components/category/PaymentPackCategoryList.component';
import PaymentPackCategoryCreationDialog from '../../libs/payment-packs/components/category/PaymentPackCategoryCreationDialog.component';
import { withPaymentPackNotification } from '../../libs/marketing/selectors';
import { fetchMarketingNotificationList } from '../../libs/marketing/actions';
import withTitle from '../../hocs/with-title.hoc';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
  PaymentPackFormValues,
} from '../../libs/payment-packs/types';
import {
  updateCredit as updateCreditAction,
  resetByPaymentPack as resetByPaymentPackAction,
  fetchByPaymentPack as fetchByPaymentPackAction,
} from '../../libs/consumer-payment-pack/actions';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import { OptionCallback } from '../../state/types';

type PaymentPackOption = {
  label: string;
  pack: PaymentPack;
  onClick: () => void;
  onDelete: () => void;
  onEdit: () => void;
  value: number;
};

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.PaymentPackCategory,
);
type StateHandlerInit = {
  showCategoryDialog: boolean;
  selectedCategory: PaymentPackCategory;
  upsertCategoryLoading: boolean;
  paymentPackToEdit: PaymentPack;
  openPaymentPackFormDialog: boolean;
  openNoShowPenaltyDialog: boolean;
  openDeleteNoShowPenaltyDialog: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps &
  ConnectedProps &
  StateHandlerType &
  WithObjectSearch;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  paymentPackToDelete?: PaymentPack;
  showDisabled: boolean;
  searchText: string;
  searchResult: Array<PaymentPack>;
  selectedCategories: Array<number>;
  selectedDisponibility: ManagerOnly;
  selectedSortOption: SortOption;
  paymentPackOrderByCategory: Array<{
    id: number;
    ordering_in_category: number;
  }> | null;
  paymentPackToEdit: PaymentPack<PrivatePass>;
  disabledLoading: boolean;
  showAlert: boolean;
};

const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3;
const CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT = 4;
const CONSUMER_PACK_PAGINATION_SIZE = 10;

const searchBarAdditionalParams = {
  disabled: false,
};

const Option: React.FC<OptionPropsWithData<PaymentPackOption>> = (props) => (
  <PaymentPackListItem divider {...props.data} />
);

export class PaymentPackList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paymentPackToDelete: null,
      showDisabled: false,
      disabledLoading: false,
      searchText: '',
      searchResult: [],
      selectedCategories: this.props.userPreferenceSelectedCategories,
      selectedDisponibility: this.props.userPreferenceSelectedDisponibility,
      selectedSortOption: this.props.userPreferenceSortOption,
      paymentPackOrderByCategory: null,
      paymentPackToEdit: null,
      showAlert: false,
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>) {
    if (prevState.selectedSortOption !== this.state.selectedSortOption)
      this.updateSortOption(this.state.selectedSortOption);
    if (prevState.selectedCategories !== this.state.selectedCategories)
      this.props.setPaymentPackCategoryFilter(this.state.selectedCategories);
    if (prevState.selectedDisponibility !== this.state.selectedDisponibility)
      this.props.setPaymentPackManagerOnlyFilter(
        this.state.selectedDisponibility,
      );
    if (
      prevProps.paymentPackByCategory.length !==
      this.props.paymentPackByCategory.length
    )
      this.categoryOptions.apply({}, []);

    if (
      prevState.paymentPackToEdit?.id !== this.state.paymentPackToEdit?.id &&
      this.state.paymentPackToEdit?.id
    ) {
      this.props.fetchCompatibleServicePasses(this.state.paymentPackToEdit);
    }
  }

  componentWillUnmount() {
    this.props.resetDisabledPaymentPack();
  }

  componentDidMount() {
    this.props.fetchPrivatePassList();
    this.props.fetchAllPrivateServices();
    this.props.fetchEstablishments();
    this.props.fetchActivitiesCompany(this.props.companyId, {
      customer_enabled: true,
    });
    this.props.fetchMetaActivities();
    this.props.fetchPaymentPackList({ disabled: false, page_size: 70000 });
    this.props.fetchAllPaymentPackCategory();
    this.props.fetchVideoFilterableParams({
      company: this.props.companyId,
      status: VideoStatusEnum.processed,
    });
    this.props.fetchMarketingNotificationList({
      active: true,
      kind_in: [
        CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
        CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
      ],
    });
    if (this.state.selectedSortOption !== SortOption.customSort)
      this.updateSortOption(this.state.selectedSortOption);
    IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED &&
      this.props.fetchAvailableBookkeepingAccountList();
  }

  onCreate = () => {
    this.setState((prevState: State) => ({
      ...prevState,
    }));
    this.props.setOpenPaymentPackFormDialog(true);
  };

  updateOrderBySortOption(
    sortFunction: (pp1: PaymentPack, pp2: PaymentPack) => number,
  ) {
    // @ts-expect-error
    const toUpdate = [];
    this.props.paymentPackByCategory.forEach(
      // @ts-expect-error
      (category: PaymentPackCategoryWithPacks) => {
        const sorted = [...category.packs].sort((pp1, pp2) =>
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
    // @ts-expect-error
    this.setState({ paymentPackOrderByCategory: toUpdate });
  }

  updateSortOption(option: SortOption) {
    this.props.setPaymentPackSort(option);
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
        return this.setState({ paymentPackOrderByCategory: null });
    }
  }

  requestEdit = (pp: PaymentPack) => {
    // @ts-expect-error
    this.setState({ paymentPackToEdit: pp }, () =>
      this.props.setOpenPaymentPackFormDialog(true),
    );
  };

  requestDelete = (pp: PaymentPack) => {
    this.props.isPaymentPackUsedInCombo(pp.id);
    this.setState({ paymentPackToDelete: pp });
    this.props.resetConsumerPacks();
  };

  cancelDelete = () => {
    this.setState({ paymentPackToDelete: null });
  };

  deletePaymentPack = async (id: number) => {
    this.props.updatePaymentPack(id, {
      disabled: true,
    });
    this.setState({ paymentPackToDelete: null });
  };

  restorePaymentPack = async (id: number) => {
    if (this.props.disabledPacks.length === 1) {
      this.setState({ showDisabled: false });
    }
    this.props.updatePaymentPack(id, {
      disabled: false,
    });
  };

  changeSearch = (fuse: string) => (ev: MouseEvent) => {
    this.setState({
      // @ts-expect-error
      searchText: ev.target.value,
      // @ts-expect-error
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  handleRestorePack = (canEdit: boolean, pack: PaymentPack) =>
    canEdit ? () => this.restorePaymentPack(pack.id) : null;

  renderArchivedPackList = (
    packs: Array<PaymentPack>,
    hasEditPermission: boolean,
  ) => {
    return (
      <Paper>
        <List disablePadding>
          {packs.map((pack) => (
            <PaymentPackListItem
              key={pack.id}
              disabled
              divider
              // @ts-expect-error
              creditScaleFactor={this.props.theme.pass_credit_factor}
              onClick={
                pack.disabled ? null : () => this.props.goToPack(pack.id)
              }
              onRestore={this.handleRestorePack(hasEditPermission, pack)}
              pack={pack}
            />
          ))}
        </List>
      </Paper>
    );
  };

  onShowDisabled = () => {
    // @ts-expect-error
    this.setState((prevState: State) => {
      if (!prevState.showDisabled) {
        this.props.fetchPaymentPackList(
          { page_size: 70000 },
          { onSuccess: () => this.setState({ disabledLoading: false }) },
        );
        return { showDisabled: !prevState.showDisabled, disabledLoading: true };
      }
      return { showDisabled: !prevState.showDisabled };
    });
  };

  categoryOptions = memoize(() => [
    ...this.props.paymentPackByCategory.map((cat) => {
      return {
        value: cat.id || -1,
        label: cat.name || this.props.t('noCategory.name'),
      };
    }),
  ]);

  // @ts-expect-error
  categoryFilterOnchange = (categories) => {
    this.setState({
      selectedCategories: categories,
    });
  };

  // @ts-expect-error
  managerOnlyOnChange = (value) =>
    this.setState({
      selectedDisponibility: value,
    });

  // @ts-expect-error
  sortOnChange = (sortOpt) => {
    this.setState({
      selectedSortOption: sortOpt,
    });
  };

  closePaymentPackFormDrawer = () => {
    this.props.setOpenPaymentPackFormDialog(false);
    this.setState({ paymentPackToEdit: null });
  };

  closeNoShowPenaltyDialog = () => {
    this.props.setOpenNoShowPenaltyDialog(false);
    this.props.setOpenPaymentPackFormDialog(false);
  };

  closeDeleteNoShowPenaltyDialog = () => {
    this.props.setOpenDeleteNoShowPenaltyDialog(false);
    this.props.setOpenPaymentPackFormDialog(false);
  };

  updateCategoryOrder = (
    data: Array<{ id: number; category_ordering: number }>,
    options?: OptionCallback,
  ) => {
    this.props.updateCategoryOrder(data, {
      onSuccess: () => {
        options?.onSuccess();
        this.setState({ showAlert: true });
      },
    });
  };

  paymentPackOptionsFormatter =
    (hasDeletePermission: boolean, hasEditPermission: boolean) =>
    (paymentPacks: PaymentPack[]): PaymentPackOption[] =>
      paymentPacks.map((paymentPack) => {
        return {
          label: paymentPack.name,
          onClick: !paymentPack.disabled
            ? () => this.props.goToPack(paymentPack.id)
            : null,
          onDelete: hasDeletePermission
            ? () => this.requestDelete(paymentPack)
            : null,
          onEdit: hasEditPermission
            ? () => this.requestEdit(paymentPack)
            : null,
          pack: paymentPack,
          value: paymentPack.id,
        };
      });

  render() {
    const {
      loading,
      incrementCredit,
      decrementCredit,
      classes,
      t,
      categoryList,
      allTagsWithTagGroup,
      metaActivities,
      availableEstablishmentList,
      paymentPackCategories,
    } = this.props;

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

    if (
      // @ts-expect-error
      (this.props.enabledPacks || []).length +
        (this.props.disabledPacks || []).length ===
        0 &&
      !loading
    ) {
      return (
        <>
          <NoShowPenaltyDialog
            goToSettings={this.props.goToSettings}
            onClose={this.closeNoShowPenaltyDialog}
            open={this.props.openNoShowPenaltyDialog}
          />
          <DeleteNoShowPenaltyDialog
            onClose={this.closeDeleteNoShowPenaltyDialog}
            open={this.props.openDeleteNoShowPenaltyDialog}
          />
          <IsEmptyList
            button={this.props.t('addButton')}
            onCreate={this.onCreate}
            onCreateLabel={this.props.t('addButton')}
            text={this.props.t('noPaymentPack')}
          />
          <PaymentPackFormDrawer
            allowGuestMaster={
              this.props.theme.allow_guest_activatable &&
              this.props.theme.allow_guest
            }
            availableEstablishmentList={availableEstablishmentList}
            bookkeepingAccountById={this.props.bookkeepingAccountById}
            bookkeepingAccounts={this.props.bookkeepingAccounts}
            categoryList={paymentPackCategoryList}
            clearPaymentPackToEdit={() =>
              this.setState({ paymentPackToEdit: null })
            }
            closeForm={this.closePaymentPackFormDrawer}
            compatibleServicePass={this.props.compatibleServicePass}
            // @ts-expect-error
            creditFactor={this.props.theme.pass_credit_factor}
            // @ts-expect-error
            initial={this.state.paymentPackToEdit}
            metaActivityList={metaActivities}
            onSubmit={this.props.createOrUpdatePaymentPack}
            open={this.props.openPaymentPackFormDialog}
            paymentPackCategories={paymentPackCategories}
            // @ts-expect-error
            privateServices={this.props.privateServices}
            // @ts-expect-error
            tagList={allTagsWithTagGroup}
          />
        </>
      );
    }

    return (
      <>
        {(this.props.upsertCategoryLoading || this.props.loading) && (
          <LinearProgress />
        )}
        <NoShowPenaltyDialog
          goToSettings={this.props.goToSettings}
          onClose={this.closeNoShowPenaltyDialog}
          open={this.props.openNoShowPenaltyDialog}
        />
        <DeleteNoShowPenaltyDialog
          onClose={this.closeDeleteNoShowPenaltyDialog}
          open={this.props.openDeleteNoShowPenaltyDialog}
        />
        <ObjectLevelPermissionProviderComponent
          requiredPermission={[
            'product.paymentPack.allowed_actions.create',
            'product.paymentPack.allowed_actions.edit',
            'product.paymentPack.allowed_actions.delete',
          ]}
        >
          {([
            hasCreatePermission,
            hasEditPermission,
            hasDeletePermission,
          ]: boolean[]) => (
            <div className={classes.container}>
              <div className={classes.buttonRow}>
                {/* @ts-expect-error */}
                {!!this.props.enabledPacks?.length && (
                  <div style={{ flex: 1 }}>
                    <ObjectSearchComponent
                      additionalParams={searchBarAdditionalParams}
                      components={{
                        Option,
                      }}
                      optionsFormatter={this.paymentPackOptionsFormatter(
                        hasDeletePermission,
                        hasEditPermission,
                      )}
                      placeholder={this.props.t('search')}
                      searchedObjectType="payment_pack"
                      variant="underlined"
                    />
                  </div>
                )}
                {hasCreatePermission && (
                  <Button
                    className={classes.buttonAdd}
                    color="primary"
                    onClick={() => {
                      this.props.setSelectedCategory(null);
                      this.props.setShowCategoryDialog(true);
                      trackFormAdd();
                    }}
                    variant="outlined"
                  >
                    <AddIcon color="primary" />
                    {t('category.add')}
                  </Button>
                )}
              </div>
              <PaymentPackFilterAndSortHeader
                categoryFilterOnchange={this.categoryFilterOnchange}
                // @ts-expect-error
                categoryOptions={this.categoryOptions()}
                categoryValue={this.state.selectedCategories}
                managerOnlyOnChange={this.managerOnlyOnChange}
                managerOnlyValue={this.state.selectedDisponibility}
                sortOnChange={this.sortOnChange}
                sortValue={this.state.selectedSortOption}
              />

              {this.state.showAlert && (
                <Alert
                  action={
                    <Button onClick={this.props.goToSettings}>
                      {t('orderingAlert.button')}
                    </Button>
                  }
                  className={classes.alertInfo}
                  severity="warning"
                >
                  <Typography>{t('orderingAlert.text')}</Typography>
                </Alert>
              )}
              <PaymentPackCategoryList
                deletePaymentPackCategory={this.props.deletePaymentPackCategory}
                filteredCategories={this.state.selectedCategories}
                filterManagerOnly={this.state.selectedDisponibility}
                itemsDraggable={hasEditPermission}
                onClick={this.props.goToPack}
                onDelete={hasDeletePermission && this.requestDelete}
                onEdit={hasEditPermission && this.requestEdit}
                onRestore={hasEditPermission && this.restorePaymentPack}
                // @ts-expect-error
                paymentPackByCategory={this.props.paymentPackByCategory}
                paymentPackOrder={this.state.paymentPackOrderByCategory}
                setSelectedCategory={this.props.setSelectedCategory}
                showCategoryEditDialog={() =>
                  this.props.setShowCategoryDialog(true)
                }
                updateCategory={this.updateCategoryOrder}
                updatePack={this.props.updatePackOrder}
              />
              <div className={classes.container}>
                <div className={this.props.classes.buttonTitle}>
                  <Typography className={classes.titleContainer} variant="h5">
                    {`${t('disabledPacksTitle')}`}
                  </Typography>

                  <IconButton onClick={this.onShowDisabled}>
                    {this.state.showDisabled ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </div>
                {this.state.disabledLoading ? (
                  // @ts-expect-error
                  <LinearProgress className={classes.divider} />
                ) : (
                  <Divider className={classes.divider} />
                )}
                <Collapse
                  unmountOnExit
                  className={classes.collapse}
                  in={this.state.showDisabled}
                >
                  {this.renderArchivedPackList(
                    this.props.disabledPacks,
                    hasEditPermission,
                  )}
                </Collapse>
              </div>

              <PaymentPackDeleteDialog
                consumerPackSummary={
                  this.state.paymentPackToDelete ? (
                    // @ts-expect-error
                    <PaginatedConsumerPackList
                      consumerPacksUpdatingById={
                        this.props.consumerPacks.updatingById
                      }
                      decrementCredit={decrementCredit}
                      incrementCredit={incrementCredit}
                      itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
                      items={this.props.consumerPacks.items}
                      loading={this.props.consumerPacks.loading}
                      nbItems={this.props.consumerPacks.count}
                      onPageRequested={(page: number, pageSize: number) =>
                        this.props.fetchConsumerPacks(
                          this.state.paymentPackToDelete.id,
                          page,
                          pageSize,
                        )
                      }
                      page={this.props.consumerPacks.page}
                      paymentPack={this.state.paymentPackToDelete}
                    />
                  ) : null
                }
                isUsedInCombo={
                  this.props.archivationWarning[
                    this.state.paymentPackToDelete?.id
                  ]?.used_in_combo || false
                }
                onCancel={this.cancelDelete}
                onDelete={() =>
                  this.deletePaymentPack(this.state.paymentPackToDelete.id)
                }
                open={!!this.state.paymentPackToDelete}
                pack={this.state.paymentPackToDelete}
              />
              <PaymentPackFormDrawer
                allowGuestMaster={
                  this.props.theme.allow_guest &&
                  this.props.theme.allow_guest_activatable
                }
                availableEstablishmentList={availableEstablishmentList}
                bookkeepingAccountById={this.props.bookkeepingAccountById}
                bookkeepingAccounts={this.props.bookkeepingAccounts}
                categoryList={paymentPackCategoryList}
                clearPaymentPackToEdit={() =>
                  this.setState({ paymentPackToEdit: null })
                }
                closeForm={this.closePaymentPackFormDrawer}
                compatibleServicePass={this.props.compatibleServicePass}
                // @ts-expect-error
                creditScaleFactor={this.props.theme.pass_credit_factor}
                displayNewCheckoutFlow={
                  this.props.theme.display_new_checkout_flow
                }
                // @ts-expect-error
                initial={this.state.paymentPackToEdit}
                metaActivityList={metaActivities}
                onSubmit={this.props.createOrUpdatePaymentPack}
                open={this.props.openPaymentPackFormDialog}
                paymentPackCategories={paymentPackCategories}
                // @ts-expect-error
                privateServices={this.props.privateServices}
                provincialTax={this.props.theme?.provincial_tax_value}
                // @ts-expect-error
                tagList={allTagsWithTagGroup}
              />
              {hasCreatePermission && (
                <BottomActionsButton
                  onCreate={this.onCreate}
                  onCreateLabel={this.props.t('addButton')}
                />
              )}
            </div>
          )}
        </ObjectLevelPermissionProviderComponent>
        {(this.props.selectedCategory || this.props.showCategoryDialog) && (
          <PaymentPackCategoryCreationDialog
            // @ts-expect-error
            compatibleServicePass={this.props.compatibleServicePass}
            handleClose={() => {
              trackFormCancel(this.props.selectedCategory?.id);
              this.props.setShowCategoryDialog(false);
              this.props.setSelectedCategory(null);
            }}
            onSubmit={this.props.upsertPaymenPackCategory}
            open={this.props.showCategoryDialog}
            paymentPackCategorySelected={this.props.selectedCategory}
            privateServices={this.props.privateServices}
            trackIntent={() =>
              trackFormSubmitIntent(this.props.selectedCategory?.id)
            }
          />
        )}
      </>
    );
  }
}
const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingBottom: theme.spacing(16),
    },
    divider: {
      marginBottom: theme.spacing(2),
    },
    titleContainer: {
      marginBottom: theme.spacing(1),
    },
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
    buttonTitle: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(4),
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
    alertInfo: {
      display: 'flex',
      alignItems: 'center',
    },
  });
const mapStateToProps = (state: RootState) => ({
  loading: state.paymentPack.loading,
  // @ts-expect-error
  enabledPacks: withSCT(withLinkedPrivatePass(getEnabledPaymentPacks))(state),
  theme: themeSelectors.getTheme(state),
  videoCategories: state.video.filterableParams.items.SCTs,
  allTagsWithTagGroup: getAllTagsWithTagGroup(state),
  availableEstablishmentList: getAvailableEstablishmentList(state),
  paymentPackCategories: getAllPaymentPackCategory(state),
  metaActivities: uniqBy(
    [
      ...getEnabledMetaActivities(state),
      ...getEnabledWorkshops(state),
      ...getActivitiesByIdList(state, []),
    ],
    'id',
  ),
  categoryList: getEditableSCTs(state),
  paymentPackByCategory: groupByCategory(
    withPaymentPackNotification(
      // @ts-expect-error
      withLinkedPrivatePass(withSCT(getEnabledPaymentPacks)),
    ),
  )(state),
  disabledPacks: getDisabledPaymentPacks(state),
  consumerPacks: {
    // @ts-expect-error
    items: state.consumerPaymentPack.byPaymentPack.items,
    count: state.consumerPaymentPack.byPaymentPack.count,
    loading: state.consumerPaymentPack.byPaymentPack.loading,
    page: state.consumerPaymentPack.byPaymentPack.page,
    updatingById: state.consumerPaymentPack.updatingById,
  },
  userPreferenceSortOption: state.userPreference.paymentPackSort,
  userPreferenceSelectedCategories:
    state.userPreference.paymentPackCategoryFilter,
  userPreferenceSelectedDisponibility:
    state.userPreference.paymentPackManagerOnlyFilter,
  companyId: state.theme.theme.company,
  archivationWarning: state.paymentPack.archivationWarning,
  privateServices: getPrivateServices(state),
  compatibleServicePass: getCompatibleServicePass(state),
  isRollCallMandatory: state.theme.theme.is_roll_call_mandatory,
  bookkeepingAccounts: getBookkeepingAccountList(state),
  bookkeepingAccountById: getBookkeepingAccountById(state),
});
const mapDispatchToProps = {
  fetchEstablishments,
  fetchPaymentPackList: fetchPaymentPackListAction,
  fetchActivitiesCompany,
  fetchMetaActivities: fetchMetaActivitiesAction,
  fetchAllPaymentPackCategory,

  updateCreditAction,
  patchPaymentPack,
  pushRouter,
  fetchByPaymentPackAction,
  resetByPaymentPackAction,
  fetchMarketingNotificationList,
  upsertPaymenPackCategoryAction: upsertPaymenPackCategory,
  deletePaymentPackCategoryAction: deletePaymentPackCategory,
  fetchPaymentPackBulk,
  updatePackOrder: updatePaymentPack,
  updateCategoryOrder: updatePaymentPackCategoryOrder,
  setPaymentPackSort,
  setPaymentPackCategoryFilter,
  setPaymentPackManagerOnlyFilter,
  createOrUpdatePaymentPackAction,
  fetchVideoFilterableParams,
  isPaymentPackUsedInCombo,
  fetchCompatibleServicePassList: fetchCompatibleServicePassListAction,
  fetchPrivateSlotsByService: fetchAllPrivateSlots,
  fetchPrivatePassList,

  fetchAllPrivateServices,
  resetDisabledPaymentPack,
  refreshCompanyThemeAction,
  fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
};
const mapWithHandlers = {
  incrementCredit:
    (props: OwnAndConnectedProps) => (consumerPackId: number) => {
      props.updateCreditAction(consumerPackId, 1);
    },
  decrementCredit:
    (props: OwnAndConnectedProps) => (consumerPackId: number) => {
      props.updateCreditAction(consumerPackId, -1);
    },
  updatePaymentPack:
    (props: OwnAndConnectedProps) =>
    (paymentPackId: number, data: Partial<PaymentPack>) => {
      props.patchPaymentPack(paymentPackId, data, {
        onSuccess: (payload) => {
          props.refreshOptions('payment_pack', searchBarAdditionalParams);
          if (payload.linked_private_pass) {
            props.fetchPrivatePassList();
          }
        },
      });
    },
  fetchConsumerPacks:
    (props: OwnAndConnectedProps) =>
    (paymentPackId: number, page: number, pageSize: number) => {
      props.fetchByPaymentPackAction(paymentPackId, page, pageSize);
    },
  goToPack: (props: OwnAndConnectedProps) => (paymentPackId: number) => {
    props.pushRouter(`/payment-pack/${paymentPackId}`);
  },
  resetConsumerPacks: (props: OwnAndConnectedProps) => () => {
    props.resetByPaymentPackAction();
  },
  onCreate: (props: OwnAndConnectedProps) => () => {
    props.pushRouter('/payment-pack/add');
  },
  // @ts-expect-error
  fetchMarketingNotificationList: (props: OwnAndConnectedProps) => (params) => {
    props.fetchMarketingNotificationList(params);
  },
  upsertPaymenPackCategory:
    (props: OwnAndConnectedProps) => (category: PaymentPackCategory) => {
      props.setUpsertCategoryLoading(true);
      props.upsertPaymenPackCategoryAction(category, {
        onSuccess: () => {
          props.setShowCategoryDialog(false);
          props.setSelectedCategory(null);
          props.setUpsertCategoryLoading(false);
          props.fetchAllPaymentPackCategory();

          trackFormSuccess(category?.id);
        },
      });
    },
  deletePaymentPackCategory:
    (props: OwnAndConnectedProps) =>
    (category: PaymentPackCategoryWithPacks) => {
      props.setUpsertCategoryLoading(true);
      props.deletePaymentPackCategoryAction(category, {
        onSuccess: () => {
          props.fetchPaymentPackBulk(
            category.packs.filter((p) => p?.id).map((p) => p.id),
          );
          props.setSelectedCategory(null);
          props.setUpsertCategoryLoading(false);
        },
      });
    },
  createOrUpdatePaymentPack:
    (props: OwnAndConnectedProps) =>
    (data: PaymentPackFormValues, options: OptionCallback<PaymentPack>) => {
      props.createOrUpdatePaymentPackAction(data, {
        ...options,
        onSuccess: (res) => {
          // condition to edit
          if (data?.id) {
            props.refreshOptions('payment_pack', searchBarAdditionalParams);
          }
          options.onSuccess(res);
          props.refreshCompanyThemeAction(props.companyId, {
            onSuccess: (theme) => {
              if (!props.isRollCallMandatory && theme.is_roll_call_mandatory) {
                props.setOpenNoShowPenaltyDialog(true);
              } else if (
                props.isRollCallMandatory &&
                !theme.is_roll_call_mandatory
              ) {
                props.setOpenDeleteNoShowPenaltyDialog(true);
              } else {
                props.setOpenPaymentPackFormDialog(false);
              }
              props.fetchPaymentPackList({ disabled: false, page_size: 70000 });
              if (res.linked_private_pass) {
                props.fetchPrivatePassList();
              }
            },
          });
        },
      });
    },
  fetchCompatibleServicePasses:
    (props: OwnAndConnectedProps) =>
    (paymentPack: PaymentPack<PrivatePass>) => {
      if (paymentPack && paymentPack.linked_private_pass?.id) {
        props.fetchCompatibleServicePassList(
          paymentPack.linked_private_pass?.id,
          {
            onSuccess: (csps) => {
              // @ts-expect-error
              const private_service__in = csps?.map(
                (c: PrivateSlot) => c.private_service,
              );
              if (private_service__in?.length !== 0) {
                props.fetchPrivateSlotsByService({
                  private_service__in,
                });
              }
            },
          },
        );
      }
    },
  goToSettings: (props: OwnAndConnectedProps) => () => {
    props.pushRouter('/settings/personalization');
  },
  fetchAvailableBookkeepingAccountList:
    // @ts-expect-error


      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({ is_active: true }),
};
const withStateHandlersInit: StateHandlerInit = {
  showCategoryDialog: false,
  selectedCategory: null,
  upsertCategoryLoading: false,
  paymentPackToEdit: null,
  openPaymentPackFormDialog: false,
  openNoShowPenaltyDialog: false,
  openDeleteNoShowPenaltyDialog: false,
};
const withStateHandlersSetter = {
  setShowCategoryDialog: () => (showCategoryDialog: boolean) => {
    return { showCategoryDialog };
  },
  setSelectedCategory: () => (category: PaymentPackCategory | null) => {
    return { selectedCategory: category };
  },
  setUpsertCategoryLoading: () => (upsertCategoryLoading: boolean) => {
    return { upsertCategoryLoading };
  },
  setPaymentPackToEdit: () => (paymentPackToEdit: PaymentPack) => {
    return { paymentPackToEdit };
  },
  setOpenNoShowPenaltyDialog: () => (openNoShowPenaltyDialog: boolean) => {
    return { openNoShowPenaltyDialog };
  },
  setOpenDeleteNoShowPenaltyDialog:
    () => (openDeleteNoShowPenaltyDialog: boolean) => {
      return { openDeleteNoShowPenaltyDialog };
    },
  setOpenPaymentPackFormDialog: () => (openPaymentPackFormDialog: boolean) => {
    return { openPaymentPackFormDialog };
  },
};
export default compose<any, OwnProps>(
  withTranslation('paymentPack'),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
  withObjectSearch,
  withHandlers(mapWithHandlers),
)(PaymentPackList);
