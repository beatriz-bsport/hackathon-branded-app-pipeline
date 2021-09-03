import React, { MouseEvent } from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { push as pushRouter } from 'connected-react-router';
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
} from '../../libs/payment-packs/actions';
import {
  getEnabledPaymentPacks,
  getDisabledPaymentPacks,
  getPaymentPackCategoryWithPaymentPacks,
  getPaymentPackUnCategoryWithPaymentPacks,
} from '../../libs/payment-packs/selectors';
import type {
  PaymentPack,
  PaymentPackCategory,
  PaymentPackCategoryWithPacks,
} from '../../libs/payment-packs/types';
import withTitle from '../../hocs/with-title.hoc';
import { fetchMarketingNotificationList } from '../../libs/marketing/actions';
import { withPaymentPackNotification } from '../../libs/marketing/selectors';
import PaymentPackCategoryCreationDialog from '../../libs/payment-packs/components/category/PaymentPackCategoryCreationDialog.component';
import PaymentPackCategoryList from '../../libs/payment-packs/components/category/PaymentPackCategoryList.component';

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
};

const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3;
const CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT = 4;
const CONSUMER_PACK_PAGINATION_SIZE = 10;
export class ComponentName extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paymentPackToDelete: null,
      showDisabled: false,
      searchText: '',
      searchResult: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllPaymentPacks();
    this.props.fetchAllPaymentPackCategory();
    this.props.fetchMarketingNotificationList({
      active: true,
      kind_in: [
        CONSUMER_PAYMENT_PACK_NOTIFICATION_CREDIT,
        CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME,
      ],
    });
  }

  requestEdit = (pp: PaymentPack) => {
    this.props.pushToEdit(pp.id);
  };

  requestDelete = (pp: PaymentPack) => {
    this.setState({ paymentPackToDelete: pp });
    this.props.resetConsumerPacks();
  };

  cancelDelete = () => {
    this.setState({ paymentPackToDelete: null });
  };

  deletePaymentPack = async (id: number) => {
    this.props.updatePaymentPack(id, { disabled: true });
    this.setState({ paymentPackToDelete: null });
  };

  restorePaymentPack = async (id: number) => {
    if (this.props.disabledPacks.length === 1) {
      this.setState({ showDisabled: false });
    }
    this.props.updatePaymentPack(id, { disabled: false });
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

  renderPackList = (packs: Array<PaymentPack>, disabled: boolean) => (
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
            disabled={disabled}
          />
        ))}
      </List>
    </Paper>
  );

  onShowDisabled = () => {
    this.setState((prevState) => ({ showDisabled: !prevState.showDisabled }));
  };

  render() {
    const {
      loading,
      incrementCredit,
      decrementCredit,
      classes,
      t,
    } = this.props;
    const publicPacks = this.props.enabledPacks.filter(
      (pp: PaymentPack) => !pp.manager_only,
    );
    const managerPacks = this.props.enabledPacks.filter(
      (pp: PaymentPack) => !!pp.manager_only,
    );

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
        <IsEmptyList
          text={this.props.t('noPaymentPack')}
          button={this.props.t('addButton')}
          onCreate={this.props.onCreate}
          onCreateLabel={this.props.t('addButton')}
        />
      );
    }
    return (
      <>
        {this.props.upsertCategoryLoading && <LinearProgress />}
        <Grid
          container
          direction="row"
          spacing={3}
          className={classes.container}
        >
          {publicPacks.length || managerPacks.length ? (
            <>
              <Grid item xs={12} md={12}>
                <FuzeSearch
                  searchText={this.state.searchText}
                  clearSearch={this.clearSearch}
                  changeSearch={this.changeSearch}
                  items={[...publicPacks, ...managerPacks]}
                  placeholder={t('search')}
                  searchFields={['name']}
                  searchResult={this.state.searchResult}
                />

                <Paper
                  className={
                    this.state.searchResult.length > 0 &&
                    this.state.searchText !== ''
                      ? classes.searchPaperDisplayed
                      : classes.searchPaperHiden
                  }
                >
                  <Collapse
                    in={
                      this.state.searchResult.length > 0 &&
                      this.state.searchText !== ''
                    }
                  >
                    {this.renderPackList(this.state.searchResult, false)}
                  </Collapse>
                </Paper>
              </Grid>
              <div className={classes.buttonRow}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    this.props.setSelectedCategory(null);
                    this.props.setShowCategoryDialog(true);
                  }}
                  color="primary"
                >
                  <AddIcon color="primary" />
                  {t('category.add')}
                </Button>
              </div>
            </>
          ) : null}
          <PaymentPackCategoryList
            paymentPackByCategory={this.props.paymentPackByCategory}
            paymentPackUnCategorized={this.props.paymentPackUnCategorized}
            onEdit={(pack: PaymentPack) => this.requestEdit(pack)}
            onDelete={(pack: PaymentPack) => this.requestDelete(pack)}
            onClick={(packId: number) => this.props.goToPack(packId)}
            onRestore={(packId: number) => this.restorePaymentPack(packId)}
            setSelectedCategory={(category: PaymentPackCategory) =>
              this.props.setSelectedCategory(category)
            }
            showCategoryEditDialog={() =>
              this.props.setShowCategoryDialog(true)
            }
            deletePaymentPackCategory={(category: PaymentPackCategory) =>
              this.props.deletePaymentPackCategory(category)
            }
          />

          {(this.props.disabledPacks || []).length ? (
            <Grid
              container
              direction="row"
              spacing={3}
              className={classes.container}
            >
              <Grid item xs={12} md={6}>
                <ButtonBase
                  className={this.props.classes.buttonTitle}
                  onClick={this.onShowDisabled}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    className={classes.titleContainer}
                  >
                    {`${t('disabledPacksTitle')} (${
                      (this.props.disabledPacks || []).length
                    })`}
                  </Typography>
                  <div className={classes.iconContainer}>
                    {this.state.showDisabled ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </div>
                </ButtonBase>
                <Divider />
                <Collapse in={this.state.showDisabled}>
                  {this.state.showDisabled &&
                    this.renderPackList(this.props.disabledPacks, true)}
                </Collapse>
              </Grid>
            </Grid>
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
          <BottomActionsButton
            onCreateLabel={this.props.t('addButton')}
            onCreate={this.props.onCreate}
          />
        </Grid>
        {(this.props.selectedCategory || this.props.showCategoryDialog) && (
          <PaymentPackCategoryCreationDialog
            open={this.props.showCategoryDialog}
            handleClose={() => {
              this.props.setShowCategoryDialog(false);
              this.props.setSelectedCategory(null);
            }}
            paymentPackCategorySelected={this.props.selectedCategory}
            onSubmit={this.props.upsertPaymenPackCategory}
          />
        )}
      </>
    );
  }
}
const styles = (theme: Theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
  fabSwitchButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(9),
  },
  fabAddButton: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  titleContainer: {
    marginBottom: theme.spacing(1),
  },
  searchPaperDisplayed: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
  },
  searchPaperHidden: {
    border: '1px solid',
    borderColor: theme.primary_color,
    borderTop: '0px',
    boderBottom: '0px',
  },
  buttonTitle: {
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
  iconContainer: {
    marginRight: theme.spacing(1.5),
  },
});
const mapStateToProps = (state: RootState) => ({
  loading: state.paymentPack.loading,
  enabledPacks: getEnabledPaymentPacks(state),
  paymentPackUnCategorized: getPaymentPackUnCategoryWithPaymentPacks(
    withPaymentPackNotification(getEnabledPaymentPacks),
  )(state),
  paymentPackByCategory: getPaymentPackCategoryWithPaymentPacks(
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
});
const mapDispatchToProps = {
  fetchAllPaymentPacks,
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
};
const mapWithHandlers = {
  incrementCredit: (props: OwnAndConnectedProps) => (
    consumerPackId: number,
  ) => {
    props.updateCreditAction(consumerPackId, 1);
  },
  decrementCredit: (props: OwnAndConnectedProps) => (
    consumerPackId: number,
  ) => {
    props.updateCreditAction(consumerPackId, -1);
  },
  updatePaymentPack: (props: OwnAndConnectedProps) => (
    paymentPackId: number,
    data: PaymentPack,
  ) => {
    props.patchPaymentPack(paymentPackId, data, true);
  },
  pushToEdit: (props: OwnAndConnectedProps) => (paymentPackId: number) => {
    props.pushRouter(`/payment-pack/${paymentPackId}/edit`);
  },
  fetchConsumerPacks: (props: OwnAndConnectedProps) => (
    paymentPackId: number,
    page: number,
    pageSize: number,
  ) => {
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
  upsertPaymenPackCategory: (props: OwnAndConnectedProps) => (
    category: PaymentPackCategory,
  ) => {
    props.setUpsertCategoryLoading(true);
    props.upsertPaymenPackCategoryAction(category, {
      onSuccess: () => {
        props.setShowCategoryDialog(false);
        props.setSelectedCategory(null);
        props.setUpsertCategoryLoading(false);
      },
    });
  },
  deletePaymentPackCategory: (props: OwnAndConnectedProps) => (
    category: PaymentPackCategoryWithPacks,
  ) => {
    props.setUpsertCategoryLoading(true);
    props.deletePaymentPackCategoryAction(category, {
      onSuccess: (payload) => {
        const paymentPackIds = [
          ...payload.managerPacks.map((pack) => pack.id),
          ...payload.publicPacks.map((pack) => pack.id),
        ];
        props.setSelectedCategory(null);
        if (paymentPackIds.length === 0) props.setUpsertCategoryLoading(false);
        props.fetchPaymentPackBulk(paymentPackIds, {
          onSuccess: () => {
            props.setUpsertCategoryLoading(false);
          },
        });
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
  withTranslation('paymentPack'),
  withStyles(styles),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
  withHandlers(mapWithHandlers),
)(ComponentName);
