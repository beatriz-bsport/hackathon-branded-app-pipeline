// @ts-nocheck
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
import { VideoStatusEnum } from '#libs/video/types';
import { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers/index';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import PaginatedConsumerPackList from '#libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import FuzeSearch from '#components/FuzeSearch.component';
import IsEmptyList from '#components/navigation/IsEmptyList.component';
import PaymentPackListItem from '#libs/payment-packs/components/PaymentPackListItem.component';
import PaymentPackDeleteDialog from '#libs/payment-packs/components/PaymentPackDeleteDialog.component';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
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
} from '#libs/payment-packs/actions';
import BottomActionsButton from '#components/button/BottomActionsButton.component';
import {
  withSCT,
  getEnabledPaymentPacks,
  getDisabledPaymentPacks,
  groupByCategory,
  getAllPaymentPackCategory,
  withLinkedPrivatePass,
} from '#libs/payment-packs/selectors';
import { fetchVideoFilterableParams } from '#libs/video/actions';
import {
  updateCredit as updateCreditAction,
  resetByPaymentPack as resetByPaymentPackAction,
  fetchByPaymentPack as fetchByPaymentPackAction,
} from '../../libs/consumer-payment-pack/actions';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
  PaymentPackFormValues,
} from '../../libs/payment-packs/types';
import withTitle from '../../hocs/with-title.hoc';
import { fetchMarketingNotificationList } from '../../libs/marketing/actions';
import { withPaymentPackNotification } from '../../libs/marketing/selectors';
import PaymentPackCategoryCreationDialog from '../../libs/payment-packs/components/category/PaymentPackCategoryCreationDialog.component';
import PaymentPackCategoryList from '../../libs/payment-packs/components/category/PaymentPackCategoryList.component';
import {
  setPaymentPackCategoryFilter,
  setPaymentPackManagerOnlyFilter,
  setPaymentPackSort,
} from '../../libs/user-preference/actions';
import PaymentPackFilterAndSortHeader, {
  ManagerOnly,
  SortOption,
} from '../../libs/payment-packs/components/PaymentPackFilterAndSortHeader.component';
import PaymentPackFormDrawer from '../../libs/payment-packs/components/PaymentPackForm';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getAllTagsWithTagGroup } from '#libs/tag/selectors';
import { getAvailableEstablishmentList } from '#libs/establishment/selectors';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#libs/meta-activity/selectors';
import {
  fetchActivitiesCompany,
  fetchMetaActivities as fetchMetaActivitiesAction,
} from '../../libs/meta-activity/actions';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import themeSelectors from '../../libs/theme/selectors';
import { getPrivateServices } from '#libs/private-service/selectors/private-service';
import { getCompatibilityPassWithService as getCompatibleServicePass } from '#libs/private-service/selectors/private-pass';
import type { PrivatePass, PrivateSlot } from '#libs/private-service/types';
import { getEditableSCTs } from '#libs/category/selectors';

import {
  fetchPrivatePassList,
  fetchAllPrivateServices,
  fetchAllPrivateSlots,
  fetchCompatibleServicePassList as fetchCompatibleServicePassListAction,
} from '#libs/private-service/actions';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { refreshCompanyTheme as refreshCompanyThemeAction } from '#libs/theme/actions';
import NoShowPenaltyDialog from '#libs/payment-packs/components/PaymentPackForm/NoShowPenaltyDialog.component';
import DeleteNoShowPenaltyDialog from '#libs/payment-packs/components/PaymentPackForm/DeleteNoShowPenaltyDialog.component';

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
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
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
    const toUpdate = [];
    this.props.paymentPackByCategory.forEach(
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
      searchText: ev.target.value,
      searchResult: fuse.search(ev.target.value),
    });
  };

  clearSearch = () => {
    this.setState({ searchText: '', searchResult: [] });
  };

  renderPackList = (packs: Array<PaymentPack>) => (
    <Paper>
      <List disablePadding>
        {packs.map((pack) => (
          <PaymentPackListItem
            pack={pack}
            divider
            onEdit={() => this.requestEdit(pack)}
            onDelete={() => this.requestDelete(pack)}
            onClick={!pack.disabled ? () => this.props.goToPack(pack.id) : null}
            onRestore={() => this.restorePaymentPack(pack.id)}
            key={pack.id}
            disabled
            creditScaleFactor={this.props.theme.pass_credit_factor}
          />
        ))}
      </List>
    </Paper>
  );

  onShowDisabled = () => {
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

  categoryFilterOnchange = (categories) => {
    this.setState({
      selectedCategories: categories,
    });
  };

  managerOnlyOnChange = (value) =>
    this.setState({
      selectedDisponibility: value,
    });

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
      (this.props.enabledPacks || []).length +
        (this.props.disabledPacks || []).length ===
        0 &&
      !loading
    ) {
      return (
        <>
          <NoShowPenaltyDialog
            open={this.props.openNoShowPenaltyDialog}
            onClose={this.closeNoShowPenaltyDialog}
            goToSettings={this.props.goToSettings}
          />
          <DeleteNoShowPenaltyDialog
            open={this.props.openDeleteNoShowPenaltyDialog}
            onClose={this.closeDeleteNoShowPenaltyDialog}
          />
          <IsEmptyList
            text={this.props.t('noPaymentPack')}
            button={this.props.t('addButton')}
            onCreate={this.onCreate}
            onCreateLabel={this.props.t('addButton')}
          />
          <PaymentPackFormDrawer
            open={this.props.openPaymentPackFormDialog}
            categoryList={paymentPackCategoryList}
            availableEstablishmentList={availableEstablishmentList}
            metaActivityList={metaActivities}
            tagList={allTagsWithTagGroup}
            paymentPackCategories={paymentPackCategories}
            closeForm={this.closePaymentPackFormDrawer}
            onSubmit={this.props.createOrUpdatePaymentPack}
            clearPaymentPackToEdit={() =>
              this.setState({ paymentPackToEdit: null })
            }
            initial={this.state.paymentPackToEdit}
            privateServices={this.props.privateServices}
            creditFactor={this.props.theme.pass_credit_factor}
            compatibleServicePass={this.props.compatibleServicePass}
            allowGuestMaster={
              this.props.theme.allow_guest_activatable &&
              this.props.theme.allow_guest
            }
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
          open={this.props.openNoShowPenaltyDialog}
          onClose={this.closeNoShowPenaltyDialog}
          goToSettings={this.props.goToSettings}
        />
        <DeleteNoShowPenaltyDialog
          open={this.props.openDeleteNoShowPenaltyDialog}
          onClose={this.closeDeleteNoShowPenaltyDialog}
        />
        <div className={classes.container}>
          <div className={classes.buttonRow}>
            {this.props.enabledPacks?.length && (
              <div style={{ flex: 1 }}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={[...this.props.enabledPacks]}
                  placeholder={t('search')}
                  searchFields={['name']}
                  searchResult={this.state.searchResult}
                />
              </div>
            )}
            <Button
              variant="outlined"
              onClick={() => {
                this.props.setSelectedCategory(null);
                this.props.setShowCategoryDialog(true);
                trackFormAdd();
              }}
              color="primary"
              className={classes.buttonAdd}
            >
              <AddIcon color="primary" />
              {t('category.add')}
            </Button>
          </div>
          <Paper
            className={
              this.state.searchResult.length > 0 && this.state.searchText !== ''
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
              <Paper>
                <List disablePadding>
                  {this.state.searchResult.map((pack) => (
                    <PaymentPackListItem
                      pack={pack}
                      divider
                      onEdit={() => this.requestEdit(pack)}
                      onDelete={() => this.requestDelete(pack)}
                      onClick={
                        !pack.disabled
                          ? () => this.props.goToPack(pack.id)
                          : null
                      }
                      onRestore={() => this.restorePaymentPack(pack.id)}
                      key={pack.id}
                      creditScaleFactor={this.props.theme.pass_credit_factor}
                    />
                  ))}
                </List>
              </Paper>
            </Collapse>
          </Paper>
          <PaymentPackFilterAndSortHeader
            categoryOptions={this.categoryOptions()}
            categoryFilterOnchange={this.categoryFilterOnchange}
            categoryValue={this.state.selectedCategories}
            managerOnlyOnChange={this.managerOnlyOnChange}
            managerOnlyValue={this.state.selectedDisponibility}
            sortOnChange={this.sortOnChange}
            sortValue={this.state.selectedSortOption}
          />

          {this.state.showAlert && (
            <Alert
              severity="warning"
              className={classes.alertInfo}
              action={
                <Button onClick={this.props.goToSettings}>
                  {t('orderingAlert.button')}
                </Button>
              }
            >
              <Typography>{t('orderingAlert.text')}</Typography>
            </Alert>
          )}

          <PaymentPackCategoryList
            paymentPackOrder={this.state.paymentPackOrderByCategory}
            filterManagerOnly={this.state.selectedDisponibility}
            filteredCategories={this.state.selectedCategories}
            paymentPackByCategory={this.props.paymentPackByCategory}
            onEdit={this.requestEdit}
            onDelete={this.requestDelete}
            onClick={this.props.goToPack}
            onRestore={this.restorePaymentPack}
            updatePack={this.props.updatePackOrder}
            setSelectedCategory={this.props.setSelectedCategory}
            showCategoryEditDialog={() =>
              this.props.setShowCategoryDialog(true)
            }
            deletePaymentPackCategory={this.props.deletePaymentPackCategory}
            updateCategory={this.updateCategoryOrder}
          />
          <div className={classes.container}>
            <div className={this.props.classes.buttonTitle}>
              <Typography variant="h5" className={classes.titleContainer}>
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
              <LinearProgress className={classes.divider} />
            ) : (
              <Divider className={classes.divider} />
            )}
            <Collapse
              className={classes.collapse}
              in={this.state.showDisabled}
              unmountOnExit
            >
              {this.renderPackList(this.props.disabledPacks)}
            </Collapse>
          </div>

          <PaymentPackDeleteDialog
            open={!!this.state.paymentPackToDelete}
            pack={this.state.paymentPackToDelete}
            isUsedInCombo={
              this.props.archivationWarning[this.state.paymentPackToDelete?.id]
                ?.used_in_combo || false
            }
            onDelete={() =>
              this.deletePaymentPack(this.state.paymentPackToDelete.id)
            }
            onCancel={this.cancelDelete}
            consumerPackSummary={
              this.state.paymentPackToDelete ? (
                <PaginatedConsumerPackList
                  paymentPack={this.state.paymentPackToDelete}
                  incrementCredit={incrementCredit}
                  decrementCredit={decrementCredit}
                  items={this.props.consumerPacks.items}
                  nbItems={this.props.consumerPacks.count}
                  loading={this.props.consumerPacks.loading}
                  page={this.props.consumerPacks.page}
                  itemPerPage={CONSUMER_PACK_PAGINATION_SIZE}
                  consumerPacksUpdatingById={
                    this.props.consumerPacks.updatingById
                  }
                  onPageRequested={(page: number, pageSize: number) =>
                    this.props.fetchConsumerPacks(
                      this.state.paymentPackToDelete.id,
                      page,
                      pageSize,
                    )
                  }
                />
              ) : null
            }
          />
          <PaymentPackFormDrawer
            provincialTax={this.props.theme?.provincial_tax_value}
            open={this.props.openPaymentPackFormDialog}
            categoryList={paymentPackCategoryList}
            availableEstablishmentList={availableEstablishmentList}
            metaActivityList={metaActivities}
            tagList={allTagsWithTagGroup}
            paymentPackCategories={paymentPackCategories}
            closeForm={this.closePaymentPackFormDrawer}
            onSubmit={this.props.createOrUpdatePaymentPack}
            clearPaymentPackToEdit={() =>
              this.setState({ paymentPackToEdit: null })
            }
            initial={this.state.paymentPackToEdit}
            privateServices={this.props.privateServices}
            compatibleServicePass={this.props.compatibleServicePass}
            creditScaleFactor={this.props.theme.pass_credit_factor}
            allowGuestMaster={
              this.props.theme.allow_guest &&
              this.props.theme.allow_guest_activatable
            }
          />
          <BottomActionsButton
            onCreateLabel={this.props.t('addButton')}
            onCreate={this.onCreate}
          />
        </div>
        {(this.props.selectedCategory || this.props.showCategoryDialog) && (
          <PaymentPackCategoryCreationDialog
            open={this.props.showCategoryDialog}
            handleClose={() => {
              trackFormCancel(this.props.selectedCategory?.id);
              this.props.setShowCategoryDialog(false);
              this.props.setSelectedCategory(null);
            }}
            paymentPackCategorySelected={this.props.selectedCategory}
            onSubmit={this.props.upsertPaymenPackCategory}
            trackIntent={() =>
              trackFormSubmitIntent(this.props.selectedCategory?.id)
            }
            privateServices={this.props.privateServices}
            compatibleServicePass={this.props.compatibleServicePass}
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
  enabledPacks: withLinkedPrivatePass(getEnabledPaymentPacks)(state),
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
      withLinkedPrivatePass(withSCT(getEnabledPaymentPacks)),
    ),
  )(state),
  disabledPacks: getDisabledPaymentPacks(state),
  consumerPacks: {
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
  withHandlers(mapWithHandlers),
)(PaymentPackList);
