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
import { OptionCallback } from '../../state/types';
import { RootState } from '../../reducers/index';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import PaginatedConsumerPackList from '../../libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import FuzeSearch from '../../components/FuzeSearch.component';
import IsEmptyList from '../../components/navigation/IsEmptyList.component';
import PaymentPackListItem from '../../libs/payment-packs/components/PaymentPackListItem.component';
import PaymentPackDeleteDialog from '../../libs/payment-packs/components/PaymentPackDeleteDialog.component';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';
import {
  updateCredit as updateCreditAction,
  resetByPaymentPack as resetByPaymentPackAction,
  fetchByPaymentPack as fetchByPaymentPackAction,
} from '../../libs/consumer-payment-pack/actions';
import {
  fetchAllPaymentPacks,
  patch as patchPaymentPack,
  fetchAllPaymentPackCategory,
  upsertPaymenPackCategory,
  deletePaymentPackCategory,
  fetchPaymentPackBulk,
  updatePaymentPackCategoryOrder,
  updateOrder as updatePaymentPack,
  createOrUpdate as createOrUpdatePaymentPackAction,
} from '../../libs/payment-packs/actions';
import {
  getEnabledPaymentPacks,
  getDisabledPaymentPacks,
  groupByCategory,
  getAllPaymentPackCategory,
} from '../../libs/payment-packs/selectors';
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
import PaymentPackFormDialog from '../../libs/payment-packs/components/PaymentPackForm';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { getallTagsWithTagGroup } from '#libs/tag/selectors';
import { getAllEstablishments } from '#libs/establishment/selectors';
import {
  getActivitiesByIdList,
  getEnabledMetaActivities,
  getEnabledWorkshops,
} from '#libs/meta-activity/selectors';
import {
  fetchAllActivities,
  fetchAll as fetchWorkhops,
} from '../../libs/meta-activity/actions';
import {
  withFormTrackingHOC,
  WithSegmentAnalyticsFormTrackerHandlers,
  SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM,
} from '#components/analytics/segment';

type StateHandlerInit = {
  showCategoryDialog: boolean;
  selectedCategory: PaymentPackCategory;
  upsertCategoryLoading: boolean;
};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps &
  ConnectedProps &
  StateHandlerType &
  WithSegmentAnalyticsFormTrackerHandlers;
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
  openPaymentPackFormDialog: boolean;
  paymentPackOrderByCategory: Array<{
    id: number;
    ordering_in_category: number;
  }> | null;
  paymentPackToEdit: PaymentPack;
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
      searchText: '',
      searchResult: [],
      selectedCategories: this.props.userPreferenceSelectedCategories,
      selectedDisponibility: this.props.userPreferenceSelectedDisponibility,
      selectedSortOption: this.props.userPreferenceSortOption,
      paymentPackOrderByCategory: null,
      openPaymentPackFormDialog: false,
      paymentPackToEdit: null,
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
  }

  componentDidMount() {
    this.props.fetchEstablishments();
    this.props.fetchAllActivities({ customer_enabled: true });
    this.props.fetchWorkhops();
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllPaymentPackCategory();
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
      openPaymentPackFormDialog: true,
    }));
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
      this.setState({ openPaymentPackFormDialog: true }),
    );
  };

  requestDelete = (pp: PaymentPack) => {
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
          />
        ))}
      </List>
    </Paper>
  );

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
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
      establishmentList,
      paymentPackCategories,
    } = this.props;

    if (loading) {
      return <LinearProgress />;
    }
    if (
      (this.props.enabledPacks || []).length +
        (this.props.disabledPacks || []).length ===
        0 &&
      !loading
    ) {
      return (
        <>
          <IsEmptyList
            text={this.props.t('noPaymentPack')}
            button={this.props.t('addButton')}
            onCreate={this.onCreate}
            onCreateLabel={this.props.t('addButton')}
          />
          <PaymentPackFormDialog
            open={this.state.openPaymentPackFormDialog}
            categoryList={[...categoryList].filter(
              (category) =>
                metaActivities.map((a) => a.SCT).indexOf(category.id) !== -1,
            )}
            establishmentList={establishmentList}
            metaActivityList={metaActivities}
            tagList={allTagsWithTagGroup}
            paymentPackCategories={paymentPackCategories}
            closeDialog={() =>
              this.setState({ openPaymentPackFormDialog: false })
            }
            onSubmit={this.props.createOrUpdatePaymentPack}
            clearPaymentPackToEdit={() =>
              this.setState({ paymentPackToEdit: null })
            }
            initial={this.state.paymentPackToEdit}
          />
        </>
      );
    }

    return (
      <>
        {this.props.upsertCategoryLoading && <LinearProgress />}
        <div className={classes.container}>
          {this.props.enabledPacks?.length ? (
            <>
              <FuzeSearch
                searchText={this.state.searchText}
                clearSearch={this.clearSearch}
                changeSearch={this.changeSearch}
                items={[...this.props.enabledPacks]}
                placeholder={t('search')}
                searchFields={['name']}
                searchResult={this.state.searchResult}
              />
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
                        />
                      ))}
                    </List>
                  </Paper>
                </Collapse>
              </Paper>
            </>
          ) : null}

          <div className={classes.buttonRow}>
            <Button
              variant="outlined"
              onClick={() => {
                this.props.setSelectedCategory(null);
                this.props.setShowCategoryDialog(true);
                this.props.formAdd && this.props.formAdd({});
              }}
              color="primary"
            >
              <AddIcon color="primary" />
              {t('category.add')}
            </Button>
          </div>
          <PaymentPackFilterAndSortHeader
            categoryOptions={this.categoryOptions()}
            categoryFilterOnchange={this.categoryFilterOnchange}
            categoryValue={this.state.selectedCategories}
            managerOnlyOnChange={this.managerOnlyOnChange}
            managerOnlyValue={this.state.selectedDisponibility}
            sortOnChange={this.sortOnChange}
            sortValue={this.state.selectedSortOption}
          />

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
            updateCategory={this.props.updateCategoryOrder}
          />
          {(this.props.disabledPacks || []).length ? (
            <div className={classes.container}>
              <div className={this.props.classes.buttonTitle}>
                <Typography variant="h5" className={classes.titleContainer}>
                  {`${t('disabledPacksTitle')} (${
                    (this.props.disabledPacks || []).length
                  })`}
                </Typography>

                <IconButton onClick={this.onShowDisabled}>
                  {this.state.showDisabled ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </div>
              <Divider className={classes.divider} />
              <Collapse in={this.state.showDisabled}>
                {this.state.showDisabled &&
                  this.renderPackList(this.props.disabledPacks)}
              </Collapse>
            </div>
          ) : null}

          <PaymentPackDeleteDialog
            open={!!this.state.paymentPackToDelete}
            pack={this.state.paymentPackToDelete}
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
                  consumerPacksUpdating={this.props.consumerPacks.updating}
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
          <PaymentPackFormDialog
            open={this.state.openPaymentPackFormDialog}
            categoryList={[...categoryList].filter(
              (category) =>
                metaActivities.map((a) => a.SCT).indexOf(category.id) !== -1,
            )}
            establishmentList={establishmentList}
            metaActivityList={metaActivities}
            tagList={allTagsWithTagGroup}
            paymentPackCategories={paymentPackCategories}
            closeDialog={() =>
              this.setState({ openPaymentPackFormDialog: false })
            }
            onSubmit={this.props.createOrUpdatePaymentPack}
            clearPaymentPackToEdit={() =>
              this.setState({ paymentPackToEdit: null })
            }
            initial={this.state.paymentPackToEdit}
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
              this.props.formCancel &&
                this.props.formCancel(
                  this.props.selectedCategory
                    ? {
                        payment_pack_category_id:
                          this.props.selectedCategory.id || null,
                      }
                    : {},
                );
              this.props.setShowCategoryDialog(false);
              this.props.setSelectedCategory(null);
            }}
            paymentPackCategorySelected={this.props.selectedCategory}
            onSubmit={this.props.upsertPaymenPackCategory}
            trackIntent={() =>
              this.props.formSubmitIntent &&
              this.props.formSubmitIntent(
                this.props.selectedCategory
                  ? {
                      payment_pack_category_id:
                        this.props.selectedCategory.id || null,
                    }
                  : {},
              )
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
    },
    searchPaperHidden: {
      border: '1px solid',
      borderTop: '0px',
      boderBottom: '0px',
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
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  });
const mapStateToProps = (state: RootState) => ({
  loading: state.paymentPack.loading,
  enabledPacks: getEnabledPaymentPacks(state),

  allTagsWithTagGroup: getallTagsWithTagGroup(state),
  establishmentList: getAllEstablishments(state),
  paymentPackCategories: getAllPaymentPackCategory(state),
  metaActivities: uniqBy(
    [
      ...getEnabledMetaActivities(state),
      ...getEnabledWorkshops(state),
      ...getActivitiesByIdList(state, []),
    ],
    'id',
  ),
  categoryList: state.category.SCTs,

  paymentPackByCategory: groupByCategory(
    withPaymentPackNotification(getEnabledPaymentPacks),
  )(state),
  disabledPacks: getDisabledPaymentPacks(state),
  consumerPacks: {
    items: state.consumerPaymentPack.byPaymentPack.items,
    count: state.consumerPaymentPack.byPaymentPack.count,
    loading: state.consumerPaymentPack.byPaymentPack.loading,
    page: state.consumerPaymentPack.byPaymentPack.page,
    updating: state.consumerPaymentPack.updatingConsumerPacks,
  },
  userPreferenceSortOption: state.userPreference.paymentPackSort,
  userPreferenceSelectedCategories:
    state.userPreference.paymentPackCategoryFilter,
  userPreferenceSelectedDisponibility:
    state.userPreference.paymentPackManagerOnlyFilter,
});
const mapDispatchToProps = {
  fetchEstablishments,
  fetchAllPaymentPacks,
  fetchAllActivities,
  fetchWorkhops,
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
    (paymentPackId: number, data: PaymentPack) => {
      props.patchPaymentPack(paymentPackId, data);
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
          props.formSuccess &&
            props.formSuccess(
              category
                ? {
                    payment_pack_category_id: category.id || null,
                  }
                : {},
            );
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
    (data: PaymentPackFormValues, options: OptionCallback) => {
      props.createOrUpdatePaymentPackAction(data, {
        ...options,
        onSuccess: (res) => {
          options.onSuccess(res);
          props.fetchAllPaymentPacks();
        },
      });
    },
};
const withStateHandlersInit: StateHandlerInit = {
  showCategoryDialog: false,
  selectedCategory: null,
  upsertCategoryLoading: false,
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
};
export default compose<any, OwnProps>(
  withFormTrackingHOC({
    object_identifier:
      SEGMENT_ANALYTICS_FORM_OBJECT_IDENTIFIER_ENUM.PAYMENT_PACK_CATEGORY,
  }),
  withTranslation('paymentPack'),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
  withHandlers(mapWithHandlers),
)(PaymentPackList);
