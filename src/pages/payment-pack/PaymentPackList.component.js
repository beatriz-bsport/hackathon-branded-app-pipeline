// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { CircularProgress, Button, withStyles, Grid } from '@material-ui/core';
import { translate } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import { push as pushRouter } from 'react-router-redux';

import { SimpleModal, PaymentPackCard } from '../../components';
import PaymentPackDeleteForm from '../../components/form/PaymentPackDeleteForm.component';
import { paymentPack as paymentPackActions } from '../../actions';
import api from '../../api';
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
});

type Props = {
  loading: boolean,
  packs: Array<Object>,
  updatingConsumerPacks: Array<number>,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  metaActivities: Array<MetaActivity>,
  disablePaymentPack: (id: number) => void,
  editPaymentPack: (data: [*]) => void,
  updatePaymentPack: (id: number, data: [*]) => void,
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

  render() {
    const {
      packs,
      loading,
      updatingConsumerPacks,
      incrementCredit,
      decrementCredit,
      classes,
      metaActivities,
      t,
    } = this.props;
    if (loading) {
      return <CircularProgress />;
    }

    const { disableConsumerPack } = api.paymentPack;
    return (
      <Grid container direction="column" alignItems="center" spacing={24}>
        <Grid item>
          <Grid container direction="row">
            {packs
              .filter(
                (p) =>
                  !p.disabled ||
                  (p.disabled && p.consumer_payment_packs.length),
              )
              .map((p) => (
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
                    incrementCredit={incrementCredit}
                    decrementCredit={decrementCredit}
                    updatingConsumerPacks={updatingConsumerPacks}
                    onEditButtonClick={() => this.requestEdit(p)}
                    onDeleteButtonClick={() => this.requestDelete(p)}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid item>
          <Link to="/payment-pack/add" style={{ textDecoration: 'none' }}>
            <Button variant="extendedFab" color="primary">
              <AddIcon className={classes.extendedIcon} />
              {t('paymentPack.addButton')}
            </Button>
          </Link>
        </Grid>
        <SimpleModal open={this.state.paymentPackToDeleteId}>
          <PaymentPackDeleteForm
            pack={this.props.packs.find(
              (pp) => pp.id === this.state.paymentPackToDeleteId,
            )}
            onDelete={() =>
              this.deletePaymentPack(
                this.props.packs.find(
                  (pp) => pp.id === this.state.paymentPackToDeleteId,
                ),
              )
            }
            onCancel={this.cancelDelete}
            incrementCredit={incrementCredit}
            decrementCredit={decrementCredit}
            updatingConsumerPacks={updatingConsumerPacks}
          />
        </SimpleModal>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.paymentPack.loading,
    packs: state.paymentPack.all,
    metaActivities: state.metaActivity.all,
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
      dispatch(paymentPackActions.update(paymentPackId, data, true));
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
