// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

import List from '@material-ui/core/List';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';
import { compose } from 'recompose';
import PaginatedConsumerPackList from '../../libs/consumer-payment-pack/components/PaginatedConsumerPackList.component';
import FuzeSearch from '../../components/FuzeSearch.component';

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
} from '../../libs/payment-packs/actions';
import { getAll as getAllPaymentPacks } from '../../libs/payment-packs/selectors';
import type {
  ConsumerPaymentPack,
  PaymentPack,
} from '../../libs/payment-packs/types';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  loading: boolean,
  consumerPacksFetching: boolean,

  packs: Array<Object>,
  updatingConsumerPacks: Array<number>,
  consumerPacks: Array<ConsumerPaymentPack>,

  pushToEdit: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  updatePaymentPack: (id: number, data: [*]) => void,
  fetchConsumerPacks: (
    paymentPackId: number,
    page: number,
    pageSize: number,
  ) => void,
  resetConsumerPacks: () => void,
  goToPack: (id: number) => void,
  fetchAllPaymentPacks: () => void,
  onCreate: () => void,

  classes: Object,
  t: TFunction,
};

type State = {
  paymentPackToDelete: ?PaymentPack,
};

const CONSUMER_PACK_PAGINATION_SIZE = 10;

export class PaymentPackList extends Component<Props, State> {
  state = {
    paymentPackToDelete: null,
    searchText: '',
    searchResult: [],
  };

  componentDidMount() {
    this.props.fetchAllPaymentPacks();
  }

  requestEdit = (p: PaymentPack) => {
    this.props.pushToEdit(p.id);
  };

  requestDelete = (paymentPack: PaymentPack) => {
    this.setState({
      paymentPackToDelete: paymentPack,
    });
    this.props.resetConsumerPacks();
  };

  cancelDelete = () => {
    this.setState({ paymentPackToDelete: null });
  };

  deletePaymentPack = async (id: number) => {
    this.props.updatePaymentPack(id, { disabled: true });
    this.setState({ paymentPackToDelete: null });
  };

  changeSearch = (fuse) => (ev) => {
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
            onClick={() => this.props.goToPack(pack.id)}
            key={pack.id}
          />
        ))}
      </List>
    </Paper>
  );

  render() {
    const {
      packs,
      loading,
      updatingConsumerPacks,
      incrementCredit,
      decrementCredit,
      classes,
      t,
    } = this.props;

    if (loading) {
      return <LinearProgress />;
    }

    const showablePacks = packs.filter((p) => !p.disabled);
    const publicPacks = showablePacks.filter((p) => !p.manager_only);
    const managerPacks = showablePacks.filter((p) => Boolean(p.manager_only));
    return (
      <Grid
        container
        direction="row"
        spacing={24}
        className={classes.container}
      >
        {publicPacks.length || managerPacks.length ? (
          <Grid item xs={12} md={12}>
            <FuzeSearch
              searchText={this.state.searchText}
              clearSearch={this.clearSearch}
              changeSearch={this.changeSearch}
              items={[...publicPacks, ...managerPacks]}
              placeHolder={t('paymentPack:search')}
              searchFields={['name']}
              searchResult={this.state.searchResult}
            />

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
                {this.renderPackList(this.state.searchResult)}
              </Collapse>
            </Paper>
          </Grid>
        ) : null}
        {publicPacks.length ? (
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              component="h2"
              className={classes.titleContainer}
            >
              {t('paymentPack.publicPacksTitle')}
            </Typography>
            {this.renderPackList(publicPacks)}
          </Grid>
        ) : null}

        {managerPacks.length ? (
          <Grid item xs={12} md={6}>
            <Typography
              variant="h5"
              component="h2"
              className={classes.titleContainer}
            >
              {t('paymentPack.privatePacksTitle')}
            </Typography>
            {this.renderPackList(managerPacks)}
          </Grid>
        ) : null}

        <PaymentPackDeleteDialog
          open={!!this.state.paymentPackToDelete}
          pack={this.state.paymentPackToDelete}
          onDelete={() =>
            this.deletePaymentPack(this.state.paymentPackToDelete.id)
          }
          consumerPacks={this.props.consumerPacks}
          consumerPacksFetching={this.props.consumerPacksFetching}
          onCancel={this.cancelDelete}
          updatingConsumerPacks={updatingConsumerPacks}
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
          onCreateLabel={this.props.t('paymentPack.addButton')}
          onCreate={this.props.onCreate}
        />
      </Grid>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing.unit * 16,
  },
  fabSwitchButton: {
    position: 'fixed',
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 9,
  },
  fabAddButton: {
    position: 'fixed',
    right: theme.spacing.unit * 2,
    bottom: theme.spacing.unit * 2,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  titleContainer: {
    marginBottom: theme.spacing.unit,
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
});

function mapStateToProps(state) {
  return {
    loading: state.paymentPack.loading,
    packs: getAllPaymentPacks(state),
    consumerPacks: {
      items: state.consumerPaymentPack.byPaymentPack.items,
      count: state.consumerPaymentPack.byPaymentPack.count,
      loading: state.consumerPaymentPack.byPaymentPack.loading,
      page: state.consumerPaymentPack.byPaymentPack.page,
      updating: state.consumerPaymentPack.updatingConsumerPacks,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllPaymentPacks() {
      dispatch(fetchAllPaymentPacks());
    },
    incrementCredit(consumerPackId) {
      dispatch(updateCreditAction(consumerPackId, 1));
    },
    decrementCredit(consumerPackId) {
      dispatch(updateCreditAction(consumerPackId, -1));
    },
    updatePaymentPack(paymentPackId, data) {
      dispatch(patchPaymentPack(paymentPackId, data, true));
    },
    pushToEdit(paymentPackId: number) {
      dispatch(pushRouter(`/payment-pack/${paymentPackId}/edit`));
    },
    fetchConsumerPacks(paymentPackId: number, page: number, pageSize: number) {
      dispatch(fetchByPaymentPackAction(paymentPackId, page, pageSize));
    },
    goToPack(id: number) {
      dispatch(pushRouter(`/payment-pack/${id}`));
    },
    resetConsumerPacks() {
      dispatch(resetByPaymentPackAction());
    },
    onCreate() {
      dispatch(pushRouter('/payment-pack/add'));
    },
  };
}

export default compose(
  withNamespaces(),
  withTitle(({ t }: { t: TFunction }) =>
    t('titles:paymentPack.paymentPackList'),
  ),
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentPackList);
