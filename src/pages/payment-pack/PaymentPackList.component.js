// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Typography,
  CircularProgress,
  Divider,
  withStyles,
  Grid,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';

import i18next from 'i18next';

import PaymentPackCard from '../../libs/payment-packs/PaymentPackCard.component';
import PaymentPackDeleteDialog from '../../components/form/PaymentPackDeleteDialog.component';
import {
  consumerPaymentPack as consumerPackActions,
  paymentPack as paymentPackActions,
} from '../../actions';
import type { MetaActivity } from '../../api/types';

import withBottomButtons from '../../hocs/inject-bottom-buttons';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  loading: boolean,
  consumerPacksFetching: boolean,

  packs: Array<Object>,
  metaActivities: Array<MetaActivity>,
  establishments: Array<Establishment>,
  updatingConsumerPacks: Array<number>,
  consumerPacks: Array<ConsumerPaymentPack>,

  pushToEdit: (id: number) => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  updatePaymentPack: (id: number, data: [*]) => void,
  fetchConsumerPacks: (paymentPackId: number) => void,

  classes: Object,
  t: TFunction,
};

type State = {
  paymentPackToDeleteId: ?number,
  expandedPaymentPack: ?number,
};

export class PaymentPackList extends Component<Props, State> {
  state = {
    paymentPackToDeleteId: null,
    expandedPaymentPack: null,
  };

  requestEdit = (p: PaymentPack) => {
    this.props.pushToEdit(p.id);
  };

  requestDelete = (paymentPack: Object) => {
    this.setState({
      paymentPackToDeleteId: paymentPack.id,
      expandedPaymentPack: null,
    });
    this.props.fetchConsumerPacks(paymentPack.id);
  };

  cancelDelete = () => {
    this.setState({ paymentPackToDeleteId: null });
  };

  deletePaymentPack = async (id: number) => {
    this.props.updatePaymentPack(id, { disabled: true });
    this.setState({ paymentPackToDeleteId: null });
  };

  expandConsumerPacks = (paymentPackId: number) => (expanded: boolean) => {
    if (expanded) {
      this.props.fetchConsumerPacks(paymentPackId);
      this.setState({ expandedPaymentPack: paymentPackId });
    } else {
      this.setState({ expandedPaymentPack: null });
    }
  };

  renderPacks = (packs: Array<PaymentPack>) => {
    const {
      classes,
      metaActivities,
      establishments,
      incrementCredit,
      decrementCredit,
      updatingConsumerPacks,
    } = this.props;
    return (
      <Grid container direction="row">
        {packs.map((p) => (
          <Grid
            item
            xs={12}
            md={6}
            xl={4}
            key={p.id}
            className={classes.paymentPackContainer}
          >
            <PaymentPackCard
              pack={p}
              expanded={p.id === this.state.expandedPaymentPack}
              metaActivities={metaActivities}
              establishments={establishments}
              incrementCredit={incrementCredit}
              decrementCredit={decrementCredit}
              updatingConsumerPacks={updatingConsumerPacks}
              onExpand={this.expandConsumerPacks(p.id)}
              consumerPacks={this.props.consumerPacks}
              consumerPacksFetching={this.props.consumerPacksFetching}
              onEditButtonClick={() => this.requestEdit(p)}
              onDeleteButtonClick={() => this.requestDelete(p)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

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
      return <CircularProgress />;
    }

    const showablePacks = packs.filter((p) => !p.disabled);
    const publicPacks = showablePacks.filter((p) => !p.manager_only);
    const managerPacks = showablePacks.filter((p) => Boolean(p.manager_only));

    return (
      <Grid container direction="column" spacing={24}>
        {publicPacks.length ? (
          <div className={classes.titleContainer}>
            <Typography variant="h4" className={classes.title}>
              {t('paymentPack.publicPacksTitle')}
            </Typography>
            <Divider />
          </div>
        ) : null}
        <Grid item xs={12}>
          {this.renderPacks(publicPacks)}
        </Grid>
        {managerPacks.length ? (
          <div className={classes.titleContainer}>
            <Typography variant="h4" className={classes.title}>
              {t('paymentPack.privatePacksTitle')}
            </Typography>
            <Divider />
          </div>
        ) : null}
        <Grid item xs={12}>
          {this.renderPacks(managerPacks)}
        </Grid>

        <PaymentPackDeleteDialog
          open={!!this.state.paymentPackToDeleteId}
          pack={this.props.packs.find(
            (pp) => pp.id === this.state.paymentPackToDeleteId,
          )}
          onDelete={() =>
            this.deletePaymentPack(this.state.paymentPackToDeleteId)
          }
          consumerPacks={this.props.consumerPacks}
          consumerPacksFetching={this.props.consumerPacksFetching}
          onCancel={this.cancelDelete}
          incrementCredit={incrementCredit}
          decrementCredit={decrementCredit}
          updatingConsumerPacks={updatingConsumerPacks}
        />
      </Grid>
    );
  }
}

const styles = (theme) => ({
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
  paymentPackContainer: {
    paddingBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing.unit * 4,
    },
  },
  titleContainer: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
  title: {
    marginBottom: theme.spacing.unit,
  },
});

function mapStateToProps(state) {
  return {
    loading: state.paymentPack.loading,
    packs: state.paymentPack.all,
    metaActivities: state.metaActivity.all,
    establishments: state.establishment.all,
    updatingConsumerPacks: state.consumerPaymentPack.updatingConsumerPacks,
    consumerPacks: state.consumerPaymentPack.byPaymentPack.items,
    consumerPacksFetching: state.consumerPaymentPack.byPaymentPack.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    incrementCredit(consumerPackId) {
      dispatch(consumerPackActions.updateCredit(consumerPackId, 1));
    },
    decrementCredit(consumerPackId) {
      dispatch(consumerPackActions.updateCredit(consumerPackId, -1));
    },
    updatePaymentPack(paymentPackId, data) {
      dispatch(paymentPackActions.patch(paymentPackId, data, true));
    },
    pushToEdit(paymentPackId: number) {
      dispatch(pushRouter(`/payment-pack/${paymentPackId}/edit`));
    },
    fetchConsumerPacks(paymentPackId: number) {
      dispatch(consumerPackActions.fetchByPaymentPack(paymentPackId));
    },
  };
}

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(
      withBottomButtons({
        addButton: {
          path: '/payment-pack/add',
          text: i18next.t('paymentPack.addButton'),
        },
      })(withDrawer('paymentPackList')(PaymentPackList)),
    ),
  ),
);
