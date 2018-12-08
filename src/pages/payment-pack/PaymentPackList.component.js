// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  Typography,
  CircularProgress,
  Divider,
  Button,
  withStyles,
  Grid,
} from '@material-ui/core';
import { translate } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import { push as pushRouter } from 'react-router-redux';

import { PaymentPackCard } from '../../components';
import PaymentPackDeleteDialog from '../../components/form/PaymentPackDeleteDialog.component';
import { paymentPack as paymentPackActions } from '../../actions';
import type { MetaActivity } from '../../api/types';

const styles = (theme) => ({
  paymentPackContainer: {
    paddingBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up('sm')]: {
      paddingRight: theme.spacing.unit * 4,
    },
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
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

type Props = {
  loading: boolean,
  establishments: Array<Establishment>,
  packs: Array<Object>,
  updatingConsumerPacks: Array<number>,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  metaActivities: Array<MetaActivity>,
  updatePaymentPack: (id: number, data: [*]) => void,
  pushToEdit: (id: number) => void,
  classes: Object,
  t: (x: string) => string,
};

type State = {
  paymentPackToDeleteId: ?number,
};

export class PaymentPackList extends Component<Props, State> {
  state = {
    paymentPackToDeleteId: null,
  };

  requestEdit = (p: PaymentPack) => {
    this.props.pushToEdit(p.id);
  };

  requestDelete = (paymentPack: Object) => {
    this.setState({ paymentPackToDeleteId: paymentPack.id });
  };

  cancelDelete = () => {
    this.setState({ paymentPackToDeleteId: null });
  };

  deletePaymentPack = async (id: number) => {
    this.props.updatePaymentPack(id, { disabled: true });
    this.setState({ paymentPackToDeleteId: null });
  };

  renderPacks = (packs) => {
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
            xs={12}
            md={6}
            xl={4}
            key={p.id}
            className={classes.paymentPackContainer}
          >
            <PaymentPackCard
              pack={p}
              metaActivities={metaActivities}
              establishments={establishments}
              incrementCredit={incrementCredit}
              decrementCredit={decrementCredit}
              updatingConsumerPacks={updatingConsumerPacks}
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

    const showablePacks = packs.filter(
      (p) => !p.disabled || (p.disabled && p.consumer_payment_packs.length),
    );
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
        <Grid item>
          <Link to="/payment-pack/add" style={{ textDecoration: 'none' }}>
            <Button variant="extendedFab" color="primary">
              <AddIcon className={classes.extendedIcon} />
              {t('paymentPack.addButton')}
            </Button>
          </Link>
        </Grid>
        <PaymentPackDeleteDialog
          open={!!this.state.paymentPackToDeleteId}
          pack={this.props.packs.find(
            (pp) => pp.id === this.state.paymentPackToDeleteId,
          )}
          onDelete={() =>
            this.deletePaymentPack(this.state.paymentPackToDeleteId)
          }
          onCancel={this.cancelDelete}
          incrementCredit={incrementCredit}
          decrementCredit={decrementCredit}
          updatingConsumerPacks={updatingConsumerPacks}
        />
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.paymentPack.loading,
    packs: state.paymentPack.all,
    metaActivities: state.metaActivity.all,
    establishments: state.establishment.all,
    updatingConsumerPacks: state.paymentPack.updatingConsumerPacks,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    incrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, 1));
    },
    decrementCredit(consumerPackId) {
      dispatch(paymentPackActions.addCredit(consumerPackId, -1));
    },
    updatePaymentPack(paymentPackId, data) {
      dispatch(paymentPackActions.patch(paymentPackId, data, true));
    },
    pushToEdit(paymentPackId: number) {
      dispatch(pushRouter(`/payment-pack/${paymentPackId}/edit`));
    },
  };
}

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(PaymentPackList),
  ),
);
